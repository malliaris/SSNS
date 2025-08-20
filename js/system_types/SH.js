
///////////////////////////////////////////////////////////////////////////////////////////////
////////  SH = Shock Tube (from FD = Fluid Dynamics)  /////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

class ModelCalc_SH extends ModelCalc {

    static gamma = 1.4;  // perfect gas ratio of specific heats c_p / c_v
    static gammam1 = 0.4;  // gammam1 = gamma - 1
    static cmax;

    constructor() {
	super();

	this.p = empty('float64', [ Params_SH.N ]);  // vector of pressure values
	this.c = empty('float64', [ Params_SH.N ]);  // vector of speed-of-sound values
	this.u = empty('float64', [ Params_SH.N ]);  // vector of velocity values
	this.m = empty('float64', [ Params_SH.N ]);  // vector of mach number values
	this.F1 = empty('float64', [ Params_SH.N ]);  // vector of flux element (rho*u) values
	this.F2 = empty('float64', [ Params_SH.N ]);  // vector of flux element (rho*u^2 + p) values
	this.F3 = empty('float64', [ Params_SH.N ]);  // vector of flux element (rho*e*u + p*u) values

	this.calc_dt();
    }

    model_is_stoch() {return false; }

    get_p(rho_val, rhou_val, rhoe_val) {  // gas pressure p value
	return ModelCalc_SH.gammam1 * (rhoe_val - 0.5*rhou_val*rhou_val/rho_val);
    }
    
    get_c(p_val, rho_val) {  // get speed of sound value for a perfect gas
	return Math.sqrt(ModelCalc_SH.gamma * p_val / rho_val);
    }
    
    get_u(rho_val, rhou_val) {  // get gas velocity u value
	return rhou_val / rho_val;
    }
    
    get_m(u_val, c_val) {  // get gas Mach number m value
	return u_val / c_val;
    }
    
    load_p_vector(rho, rhou, rhoe) {
	for (let i = 0; i < Params_SH.N; i++) {
	    this.p.set(i, this.get_p(rho.get(i), rhou.get(i), rhoe.get(i)));
	}
    }

    load_c_vector(p, rho) {
	for (let i = 0; i < Params_SH.N; i++) {
	    this.c.set(i, this.get_c(p.get(i), rho.get(i)));
	}
    }

    load_u_vector(rho, rhou) {
	for (let i = 0; i < Params_SH.N; i++) {
	    this.u.set(i, this.get_u(rho.get(i), rhou.get(i)));
	}
    }

    load_m_vector(u, c) {
	for (let i = 0; i < Params_SH.N; i++) {
	    this.m.set(i, this.get_m(u.get(i), c.get(i)));
	}
    }

    calc_dt() {

	let cL = this.get_c(Params_SH.pL, Params_SH.rhoL);
	let cR = this.get_c(Params_SH.pR, Params_SH.rhoR);
	ModelCalc_SH.cmax = Math.max(cL, cR);
	Params_SH.ds = 0.45 * Params_SH.h / ModelCalc_SH.cmax;
	Params_SH.dsoh = 0.45 / ModelCalc_SH.cmax;  // for convenience
    }

    // NOTE: each of these derived quantities is used in calculating flux vectors in load_flux_vectors(); ORDER BELOW IS IMPORTANT!!!
    load_derived_vectors_pcum(rho, rhou, rhoe) {

	this.load_p_vector(rho, rhou, rhoe);
	this.load_c_vector(this.p, rho);  // DEPENDS ON FRESH p CALCULATION ABOVE
	this.load_u_vector(rho, rhou);
	this.load_m_vector(this.u, this.c);  // DEPENDS ON FRESH u,c CALCULATIONS ABOVE
    }

    // these flux vectors are used in load_new_state_vectors()
    load_flux_vectors(rho, rhou, rhoe) {

	this.load_derived_vectors_pcum(rho, rhou, rhoe);
	//console.log("p", this.p._buffer);/////
	//console.log("c", this.c._buffer);/////
	//console.log("u", this.u._buffer);/////
	//console.log("m", this.m._buffer);/////

	for (let i = 0; i < Params_SH.N - 1; i++) {  // ??? for i = 1:nx - 1
	    this.F1.set(i, 0.5*(rhou.get(i + 1) + rhou.get(i)) - 0.5*(Math.abs(rhou.get(i + 1)) - Math.abs(rhou.get(i))));
	    this.F2.set(i, 0.5*(this.u.get(i + 1)*rhou.get(i + 1) + this.p.get(i + 1) + this.u.get(i)*rhou.get(i) + this.p.get(i)) - 0.5*(Math.abs(this.u.get(i + 1))*rhou.get(i + 1) - Math.abs(this.u.get(i))*rhou.get(i)) - 0.5*(this.p.get(i + 1)*this.m.get(i + 1) - this.p.get(i)*this.m.get(i)));  // SPLIT UP!
	    this.F3.set(i, 0.5*(this.u.get(i + 1)*(rhoe.get(i + 1) + this.p.get(i + 1)) + this.u.get(i)*(rhoe.get(i) + this.p.get(i))) - 0.5*(Math.abs(this.u.get(i + 1))*rhoe.get(i + 1) - Math.abs(this.u.get(i))*rhoe.get(i)) - 0.5*(this.p.get(i + 1)*this.c.get(i + 1) - this.p.get(i)*this.c.get(i)));  // SPLIT UP!

	    if (this.m.get(i) > 1.0) {
		this.F2.set(i, rhou.get(i)*this.u.get(i) + this.p.get(i));
		this.F3.set(i, (rhoe.get(i) + this.p.get(i))*this.u.get(i));
	    } else if (this.m.get(i) < -1.0) {
		this.F2.set(i, rhou.get(i + 1)*this.u.get(i + 1) + this.p.get(i + 1));
		this.F3.set(i, (rhoe.get(i + 1) + this.p.get(i + 1))*this.u.get(i + 1));
	    }
	}
    }

    load_new_state_vectors(c_prev, rho, rhou, rhoe) {

	this.load_flux_vectors(c_prev.rho, c_prev.rhou, c_prev.rhoe);
	//console.log("1", this.F1._buffer);/////
	//console.log("2", this.F2._buffer);/////
	//console.log("3", this.F3._buffer);/////

	for (let i = 2; i < Params_SH.N - 2; i++) {  // ??? for i = 1:nx - 1 ??? for i = 2:nx - 2
	    rho.set(i, c_prev.rho.get(i) - Params_SH.dsoh*(this.F1.get(i) - this.F1.get(i - 1)));
	    rhou.set(i, c_prev.rhou.get(i) - Params_SH.dsoh*(this.F2.get(i) - this.F2.get(i - 1)));
	    rhoe.set(i, c_prev.rhoe.get(i) - Params_SH.dsoh*(this.F3.get(i) - this.F3.get(i - 1)));
	}
    }
}

class Params_SH extends Params {

    static L_x = 10.0;  // length of x-domain
    static h;  // spacing between consecutive grid points
    static ds;
    static dsoh;
    
    static UINI_N;  // = new UINI_even_int(this, "UI_P_FD_SH_N", false);  assignment occurs in UserInterface(); see discussion there
    static N;
    static UINI_rhoL;  // = new UINI_float(this, "UI_P_FD_SH_rhoL", false);  assignment occurs in UserInterface(); see discussion there
    static rhoL;
    static UINI_rhoR;  // = new UINI_float(this, "UI_P_FD_SH_rhoR", false);  assignment occurs in UserInterface(); see discussion there
    static rhoR;
    static UINI_pL;  // = new UINI_float(this, "UI_P_FD_SH_pL", false);  assignment occurs in UserInterface(); see discussion there
    static pL;
    static UINI_pR;  // = new UINI_float(this, "UI_P_FD_SH_pR", false);  assignment occurs in UserInterface(); see discussion there
    static pR;

    constructor() {
	super();
    }

    push_vals_to_UI() {}

    get_info_str() {}
}

class Coords_SH extends Coords {

    constructor(...args) {  // see discussion of # args at definition of abstract Coords()

	super(...args);

	this.rho = empty('float64', [ Params_SH.N ]);  // vector of rho (i.e., density) grid values
	this.rhou = empty('float64', [ Params_SH.N ]);  // vector of rho*u grid values
	this.rhoe = empty('float64', [ Params_SH.N ]);  // vector of rho*e grid values

	if (this.constructing_init_cond) {

	    // set up initial condition; number of grid points N is UINI_even_int so we know that N/2 is also an integer
	    for (let i = 0; i < Params_SH.N/2; i++) {  // left half
		this.rho.set(i, Params_SH.rhoL);
		this.rhou.set(i, 0.0);
		this.rhoe.set(i, Params_SH.pL / ModelCalc_SH.gammam1);
	    }
	    for (let i = Params_SH.N/2; i < Params_SH.N; i++) {  // right half
		this.rho.set(i, Params_SH.rhoR);
		this.rhou.set(i, 0.0);
		this.rhoe.set(i, Params_SH.pR / ModelCalc_SH.gammam1);
	    }
	    //this.vs = zeros([ Params_SH.mv_dim ], {'dtype': 'float64'});
	    //console.log(this.rho._buffer);/////
	    //console.log(this.rhou._buffer);/////
	    //console.log(this.rhoe._buffer);/////

	} else {

	    this.mc.load_new_state_vectors(this.c_prev, this.rho, this.rhou, this.rhoe);
	    //console.log("r ", this.rho._buffer);/////
	    //console.log("ru", this.rhou._buffer);/////
	    //console.log("re", this.rhoe._buffer);/////
	}
    }
}

class Trajectory_SH extends Trajectory {

    constructor(sim) {

	Params_SH.N = Params_SH.UINI_N.v;
	Params_SH.rhoL = Params_SH.UINI_rhoL.v;
	Params_SH.rhoR = Params_SH.UINI_rhoR.v;
	Params_SH.pL = Params_SH.UINI_pL.v;
	Params_SH.pR = Params_SH.UINI_pR.v;

	Params_SH.h = Params_SH.L_x / (Params_SH.N - 1);  // spacing between consecutive grid points

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
