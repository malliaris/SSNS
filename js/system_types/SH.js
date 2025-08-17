
///////////////////////////////////////////////////////////////////////////////////////////////
////////  SH = Shock Tube (from FD = Fluid Dynamics)  /////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

class ModelCalc_SH extends ModelCalc {

    constructor() {
	super();
    }

    model_is_stoch() {return false; }
}

class Params_SH extends Params {

    static UINI_mu;  // = new UINI_float(this, "UI_P_FD_SH_mu", false);  assignment occurs in UserInterface(); see discussion there
    static mu;

    constructor() {
	super();

	//this.Dpol = Dpol_val;

	// summarize physical parameter values
	//console.log("physical parameter value summary:");
	//console.log("N     :", Params_HS.N);
    }

    push_vals_to_UI() {
	//Params_SH.UINI_Dpol.push_to_UI(this.Dpol);
    }

    get_info_str() {
	//return "Dpol = " + this.Dpol;
    }
}

class Coords_SH extends Coords {

    constructor(...args) {  // see discussion of # args at definition of abstract Coords()

	super(...args);

	if (this.constructing_init_cond) {  // NOTE: Params_SH.UINI_Ut/b.v passed in extra_args since they are simultaneously parameters and part of coordinate vector

	    //this.vs = zeros([ Params_SH.mv_dim ], {'dtype': 'float64'});
	    //this.vs.set(0, this.extra_args[1]);  // this is ***Ub***  (chose to put 0th index of vector at bottom to "match" y coordinate axis from theory curve u(y) )
	    //this.vs.set(Params_SH.mv_dim - 1, this.extra_args[0]);  // this is ***Ut***  (chose to put 0th index of vector at bottom to "match" y coordinate axis from theory curve u(y) )

	} else {

	    //Coords_SH.temp_vs = copy(this.c_prev.vs);
	    //Coords_SH.temp_vs.set(0, this.p.Ub);  // ***Ub***  (chose to put 0th index of vector at bottom to "match" y coordinate axis from theory curve u(y) )
	    //Coords_SH.temp_vs.set(Params_SH.mv_dim - 1, this.p.Ut);  // ***Ut***  (chose to put 0th index of vector at bottom to "match" y coordinate axis from theory curve u(y) )

	}
    }
}

class Trajectory_SH extends Trajectory {

    constructor(sim) {

	//Params_SH.mu = Params_SH.UINI_mu.v;

	super(sim);  // NOTE: all static vars used in ModelCalc/etc. constructors should precede this, while all local this.* vars should follow this
    }

    gmc() {  // gmc = get ModelCalc object
	return new ModelCalc_SH();
    }

    gp() {  // gp = get Params object    
	return new Params_SH();//Params_SH.UINI_Dpol.v);
    }

    gc_ic(mc) {  // gc_ic = get Coords, initial condition
	return new Coords_SH(mc, []);
    }

    gc_nv(mc, p, c_prev) {  // gc_nv = get Coords, new value
	return new Coords_SH(mc, p, c_prev, []);
    }

    get_max_num_t_steps() {
	return Trajectory.DEFAULT_MAX_NUM_T_STEPS
    }
}
