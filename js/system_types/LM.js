
///////////////////////////////////////////////////////////////////////////////////////////////
////////  LM = Logistic Map (from ND = Nonlinear Dynamics)  ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

class ModelCalc_LM extends ModelCalc {

    constructor() {
	super();
    }

    model_is_stoch() {return false; }

    get_x_new(p, x) {
	return (p.r * x * (1.0 - x));
    }
}

class Params_LM extends Params {

    static UINI_r;  // = new UINI_float(this, "UI_P_ND_LM_r", true);  assignment occurs in UserInterface(); see discussion there
    static UINI_x_0;  // = new UINI_float(this, "UI_P_ND_LM_x_0", false);  assignment occurs in UserInterface(); see discussion there
    static UICI_IC;  // = new UICI_LM(this, "UI_P_ND_LM_IC", false);  assignment occurs in UserInterface(); see discussion there

    constructor(r_val) {
	super();
	this.r = r_val;
    }

    push_vals_to_UI() {
	Params_LM.UINI_r.push_to_UI(this.r);
    }

    get_info_str() {
	return "r = " + this.r;
    }
}

class Coords_LM extends Coords {

    constructor(...args) {  // see discussion of # args at definition of abstract Coords()

	super(...args);

	if (this.constructing_init_cond) {

	    this.x = this.extra_args[0];

	} else {

	    this.x = this.mc.get_x_new(this.p, this.c_prev.x);
	}
    }

    output() {
	console.log("x =", this.x);
    }
}

class Trajectory_LM extends Trajectory {

    constructor(sim) {
	super(sim);
    }

    gmc() {  // gmc = get ModelCalc object
	return new ModelCalc_LM();
    }

    gp() {  // gp = get Params object
	return new Params_LM(Params_LM.UINI_r.v);
    }

    gc_ic(mc) {  // gc_ic = get Coords, initial condition
	return new Coords_LM(mc, [ Params_LM.UINI_x_0.v ]);
    }

    gc_nv(mc, p, c_prev) {  // gc_nv = get Coords, new value
	return new Coords_LM(mc, p, c_prev, []);
    }

    get_max_num_t_steps() {
	return Trajectory.DEFAULT_MAX_NUM_T_STEPS
    }
}
