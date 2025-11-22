
///////////////////////////////////////////////////////////////////////////////////////////////
////////  CH = Chemical system (from SP = Stochastic Processes)  //////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

class ModelCalc_CH extends ModelCalc_SP {

    constructor() {
	super();

	this.largest_x_in_c_prev;  // set in Coords_CH constructor **before** super() call
    }

    // (1) BELOW: largest_x_in_c_prev stored **before** super() calls (and mc.get_P_step_R/L() calls in Coords_SP_semiinf constructor)
    // (2)  HERE: largest_x_in_c_prev used --> get_P_gt_1_protective_fctr() --> mc.get_P_step_R/L() modified to never return probability P > 1
    get_P_gt_1_protective_fctr(p) {
	let possible_fctr = 1.0 / (p.alpha + p.beta*this.largest_x_in_c_prev);
	return Math.min(1.0, possible_fctr);  // min() means we only "use" factor if it's needed
    }

    get_P_step_R(p, x) {  // probability (conditioned on value of x) of x increasing
	let possibly_corrected_val = this.get_P_gt_1_protective_fctr(p) * p.alpha;
	return Math.min(1.0, possibly_corrected_val);  // min() protects against numerical error, e.g., 1.0000000000000002
    }

    get_P_step_L(p, x) {  // probability (conditioned on value of x) of x decreasing
	let possibly_corrected_val = this.get_P_gt_1_protective_fctr(p) * p.beta * x;
	return Math.min(1.0, possibly_corrected_val);  // min() protects against numerical error, e.g., 1.0000000000000002
    }
}

class Params_CH extends Params {

    static alpha;  // = new UINI_float(this, "UI_P_SP_CH_alpha", true);  assignment occurs in UserInterface(); see discussion there
    static beta;  // = new UINI_float(this, "UI_P_SP_CH_beta", true);  assignment occurs in UserInterface(); see discussion there

    constructor(alpha_val, beta_val) {
	super();
	this.alpha = alpha_val;
	this.beta = beta_val;
    }

    push_vals_to_UI() {
	Params_CH.alpha.push_to_UI(this.alpha);
	Params_CH.beta.push_to_UI(this.beta);
    }

    get_info_str() {
	return "alpha, beta = " + this.alpha + ", " + this.beta;

    }
}
class Coords_CH extends Coords_SP_semiinf {

    static x_0;  // = new UINI_int(this, "UI_P_SP_CH_x_0", false);  assignment occurs in UserInterface(); see discussion there

    constructor(...args) {  // "..." is Javascript spread operator

	// (1)  HERE: largest_x_in_c_prev stored **before** super() calls (and mc.get_P_step_R/L() calls in Coords_SP_semiinf constructor)
	// (2) ABOVE: largest_x_in_c_prev used --> get_P_gt_1_protective_fctr() --> mc.get_P_step_R/L() modified to never return probability P > 1
	if (arguments.length == 4) {  // i.e., not constructing_init_cond, but subsequent Coords
	    let mc = arguments[0];     // for clarity; these mirror steps in Coords constructor that haven't happened yet
	    let c_prev = arguments[2]; // for clarity; these mirror steps in Coords constructor that haven't happened yet
	    mc.largest_x_in_c_prev = c_prev.H_x_group.back()[0];  // map is ordered by x value key, so back()[0] is largest x value
	}

	super(...args);
    }
}

class Trajectory_CH extends Trajectory_SP {

    constructor(sim) {
	super(sim);
    }

    gmc() {  // gmc = get ModelCalc object
	return new ModelCalc_CH();
    }

    gp() {  // gp = get Params object
	return new Params_CH(Params_CH.alpha.v, Params_CH.beta.v);
    }

    gc_ic(mc) {  // gc_ic = get Coords, initial condition
	return new Coords_CH(mc, [ Coords_CH.x_0.v ]);
    }

    gc_nv(mc, p, c_prev) {  // gc_nv = get Coords, new value
	return new Coords_CH(mc, p, c_prev, []);
    }

    get_max_num_t_steps() {
	return Trajectory.DEFAULT_MAX_NUM_T_STEPS;
    }
}
