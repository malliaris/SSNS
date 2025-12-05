
///////////////////////////////////////////////////////////////////////////////////////////////
////////  LZ = Lorenz System (from ND = Nonlinear Dynamics)  //////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

class ModelCalc_LZ extends ModelCalc {

    constructor() {
	super();
    }

    model_is_stoch() {return false; }
}

class Params_LZ extends Params {

    static UINI_sigma;  // = new UINI_float(this, "UI_P_ND_LZ_sigma", true);  assignment occurs in UserInterface(); see discussion there
    static sigma;  // alias for convenience; "hooked up" in Trajectory_LZ constructor
    static UINI_rho;  // = new UINI_float(this, "UI_P_ND_LZ_rho", true);  assignment occurs in UserInterface(); see discussion there
    static rho;  // alias for convenience; "hooked up" in Trajectory_LZ constructor
    static UINI_beta;  // = new UINI_float(this, "UI_P_ND_LZ_beta", true);  assignment occurs in UserInterface(); see discussion there
    static beta;  // alias for convenience; "hooked up" in Trajectory_LZ constructor
    //static UICI_IC;  // = new UICI_LZ(this, "UI_P_ND_LZ_IC", false);  assignment occurs in UserInterface(); see discussion there

    constructor(sigma_val, rho_val, beta_val) {
	super();
	this.sigma = sigma_val;
	this.rho = rho_val;
	this.beta = beta_val;
    }

    push_vals_to_UI() {
	Params_LZ.UINI_sigma.push_to_UI(this.sigma);
	Params_LZ.UINI_rho.push_to_UI(this.rho);
	Params_LZ.UINI_beta.push_to_UI(this.beta);
    }

    get_info_str() {
	let info_str = "";
	info_str += "sigma = " + this.sigma + ", ";
	info_str += "rho = " + this.rho + ", ";
	info_str += "beta = " + this.beta;
	return info_str;
    }
}

// STORE AS SEPARATE x, y, and z, OR AS A 3-VECTOR???
class Coords_LZ extends Coords {

    constructor(...args) {  // see discussion of # args at definition of abstract Coords()

	super(...args);

	if (this.constructing_init_cond) {

	    this.x = 0.0;
	    this.y = 0.0;
	    this.z = 0.0;

	} else {

	    this.x = this.c_prev.x + 0.1;
	    this.y = this.c_prev.y + 0.1;
	    this.z = this.c_prev.z + 0.1;
	}
    }

    output() {
	console.log("x, y, z =", this.x, this.y, this.z);
    }
}

class Trajectory_LZ extends Trajectory {

    constructor(sim) {

	Params_LZ.sigma = Params_LZ.UINI_sigma.v;
	Params_LZ.rho = Params_LZ.UINI_rho.v;
	Params_LZ.beta = Params_LZ.UINI_beta.v;
	
	super(sim);
    }

    gmc() {  // gmc = get ModelCalc object
	return new ModelCalc_LZ();
    }

    gp() {  // gp = get Params object
	return new Params_LZ(Params_LZ.sigma, Params_LZ.rho, Params_LZ.beta);
    }

    gc_ic(mc) {  // gc_ic = get Coords, initial condition
	return new Coords_LZ(mc, []);
    }

    gc_nv(mc, p, c_prev) {  // gc_nv = get Coords, new value
	return new Coords_LZ(mc, p, c_prev, []);
    }

    get_max_num_t_steps() {
	return Trajectory.DEFAULT_MAX_NUM_T_STEPS;
    }
}
