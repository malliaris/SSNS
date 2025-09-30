
// UICI: User Interface Cycle Input
// helper class that connects a button in the UI with an internal parameter (in Params classes, etc.);
// each press of the button cycles the parameter to the next of a fixed sequence of values;
// e.g., a 2 value cycle UICI would just be a toggle button
class UICI {

    constructor(ui, id_str_stem, vals, img_pre, img_post, indicate_params_changed) {

	if (!this.cycle) throw new Error("Derived UICI must define cycle()");

	this.ui = ui;  // needed for this.ui.indicate_new_param_vals_ready_to_pull_UI_to_traj();
	this.id_str_stem = id_str_stem;
	this.vals = vals;
	this.val_id_str = this.id_str_stem + "_UICI_val";
	this.img_id_str = this.id_str_stem + "_UICI_img";
	this.img_pre = img_pre;
	this.img_mid = this.vals.length.toString() + "_";
	this.img_post = img_post;
	this.indicate_params_changed = indicate_params_changed;

	this.v;  // holds the current value as an array index
	this.sv(0);  // the default value is the 0th, and the UICI cycles from there, e.g., 0 --> 1 --> 2 --> 0 ...
    }

    sv(val) {  // sv = set value method sets both internal variable and interface variable, thus keeping the two in sync

	this.v = val;
	CU.sk(this.val_id_str, this.vals[this.v]);
	let img_num_str = (this.v + 1).toString();  // v is 0-based, but image filenames are 1-based
	let img_path_str = this.img_pre + this.img_mid + img_num_str + this.img_post;
	$("#" + this.img_id_str).attr("src", img_path_str);
    }

    cycle_basics() {  // called, e.g., by "onClick()" in HTML button element

	let new_v = (this.v + 1) % this.vals.length;
	this.sv(new_v);
	if (this.indicate_params_changed) {
	    this.ui.indicate_new_param_vals_ready_to_pull_UI_to_traj();
	}
    }

    push_to_UI(val) {  // take a value (perhaps from a Params_*) and push to UI input
	this.sv(val);
    }
}

class UICI_IG extends UICI {

    constructor(...args) {  // "..." is Javascript spread operator
	super(...args);
    }

    cycle() {this.cycle_basics(); }

    x_refl() {
	return ((this.v == 0) || (this.v == 1));
    }
    
    y_refl() {
	return ((this.v == 0) || (this.v == 2));
    }
    
    get_v(x_refl, y_refl) {

	let new_val = 0;
	if ( ! x_refl) new_val += 2;
	if ( ! y_refl) new_val += 1;
	return new_val;
    }
}

class UICI_HS_rho extends UICI {

    constructor(...args) {  // "..." is Javascript spread operator
	super(...args);
	this.sv(1);  // override parent class default value
    }

    cycle() {
	this.cycle_basics();
	this.ui.sim.process_cmd("RT");  // reload to create new Trajectory with new value
    }

    use_distribution() {
	return (this.v == 1);  // based on order of values chosen in UserInterface.js
    }

    // if all particles have the same mass, we plot Maxwell-Boltzmann distribution for speeds; otherwise, we plot just Boltzmann distribution for energies
    // "single value" setting for both rho and R is one way to have single mass; other way is m = rho*V = const. which works even if there is an R distribution
    all_particles_same_m() {
	let single_value_for_both_rho_and_R = (this.v == 0) && ( ! Params_HS.UICI_R.use_distribution());
	return ((this.v == 2) || single_value_for_both_rho_and_R);  // based on order of values chosen in UserInterface.js
    }
}

class UICI_HS_R extends UICI {

    constructor(...args) {  // "..." is Javascript spread operator
	super(...args);
	this.sv(1);  // override parent class default value
    }

    cycle() {
	this.cycle_basics();
	this.ui.sim.process_cmd("RT");  // reload to create new Trajectory with new value
    }

    use_distribution() {
	return (this.v == 1);  // based on order of values chosen in UserInterface.js
    }
}

class UICI_HS_IC extends UICI {  // used specifically for HS IC (initial conditions) of particle positions and velocities

    constructor(...args) {  // "..." is Javascript spread operator
	super(...args);
	this.sv(4);  // override parent class default value
    }

    set_param_vals(area, grid_spacing) {

	// handle calculation of R_max
	let ideal_R_max = ModelCalc_HS.get_R_max_from_mean_area_frac(Params_HS.N, Params_HS.R_min, Params_HS.R_dist_a, Params_HS.R_dist_b, area, Params_HS.target_area_frac);
	let just_under_grid_spacing = grid_spacing - Coords_HS.EPSILON;
	let just_under_half_grid_spacing = grid_spacing/2.0 - Coords_HS.EPSILON;
	//if (candidate_R_val < (this.grid_seg_length - Coords_HS.EPSILON)) {  // don't let R exceed grid spacing
	//    return candidate_R_val;
	//}

	$("#UI_P_SM_HS_rho").show();
	$("#UI_P_SM_HS_R").show();
	$("#UI_P_SM_HS_N").removeAttr("disabled");

	switch (this.v) {

	case 0:  // random | single v_0
	    Params_HS.R_max = ideal_R_max;
	    break;
	case 1:  // im/ex-plosion
	    Params_HS.R_max = Math.min(ideal_R_max, just_under_grid_spacing);
	    break;
	case 2:  // grid | all v_{y,0} ~= 0
	    Params_HS.R_max = Math.min(ideal_R_max, just_under_half_grid_spacing);
	    break;
	case 3:  // equilibrium
	    Params_HS.R_max = ideal_R_max;
	    break;
	case 4:  // confinement
	    $("#UI_P_SM_HS_rho").hide();
	    $("#UI_P_SM_HS_R").hide();
	    Params_HS.UINI_N.sv(1);  // NEED TO SET Params_HS.N as well???  how to best do this???
	    //Params_HS.N = Params_HS.UINI_N.v; //////////
	    //$("#UI_P_SM_HS_N").val(1);
	    $("#UI_P_SM_HS_N").attr("disabled", "true");
	    this.ui.sim.process_cmd("RT");  // reload to create new Trajectory with new value
	    Params_HS.R_max = ideal_R_max;
	    break;
	default:
	    console.log("ERROR:   invalid code value in UICI_HS_IC::set_special_param_vals()");
	    break;
	}
	console.log("INFO:   Aiming for area fraction of", Params_HS.target_area_frac, "using auto-calculated R_max of", Params_HS.R_max);
    }
    
    cycle() {

	this.cycle_basics();
	//Params_LM.UINI_x_0.sv(new_x_0);
	this.ui.sim.process_cmd("RT");  // reload to create new Trajectory with new value
    }

    position_on_grid() {
	return ((this.v == 1) || (this.v == 2));  // based on order of values chosen in UserInterface.js
    }

    position_randomly() {
	return ((this.v == 0) || (this.v == 3));  // based on order of values chosen in UserInterface.js
    }
}

// UICI_LM and UICI_GM are very similar and could both inherit from a common parent class in next refactoring...
class UICI_LM extends UICI {

    constructor(...args) {  // "..." is Javascript spread operator
	super(...args);
    }

    cycle() {

	this.cycle_basics();
	let pattern = /\(([0-9.-]+), ([0-9.-]+)\)/;  // capture the two values in ordered pair of the form (###, ###)
	let matches = pattern.exec(this.vals[this.v]);
	let new_r = parseFloat(matches[1]);  // recall matches[0] is the entire string, so matches[1] is x_0
	let new_x_0 = parseFloat(matches[2]);  // recall matches[0] is the entire string, so matches[2] is y_0
	Params_LM.UINI_r.sv(new_r);
	Params_LM.UINI_x_0.sv(new_x_0);
	this.ui.sim.process_cmd("RT");  // reload to create new Trajectory with new value
    }
}

// UICI_LM and UICI_GM are very similar and could both inherit from a common parent class in next refactoring...
class UICI_GM extends UICI {

    constructor(...args) {  // "..." is Javascript spread operator
	super(...args);
    }

    cycle() {

	this.cycle_basics();
	let pattern = /\(([0-9.-]+), ([0-9.-]+)\)/;  // capture the two values in ordered pair of the form (###, ###)
	let matches = pattern.exec(this.vals[this.v]);
	let new_x_0 = parseFloat(matches[1]);  // recall matches[0] is the entire string, so matches[1] is x_0
	let new_y_0 = parseFloat(matches[2]);  // recall matches[0] is the entire string, so matches[2] is y_0
	Params_GM.UINI_x_0.sv(new_x_0);
	Params_GM.UINI_y_0.sv(new_y_0);
	this.ui.sim.process_cmd("RT");  // reload to create new Trajectory with new value
    }
}
