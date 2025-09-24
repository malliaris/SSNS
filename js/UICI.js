
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
	this.ui.sim.process_cmd("RT");
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
	this.ui.sim.process_cmd("RT");
    }
}
