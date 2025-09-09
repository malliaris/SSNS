
///////////////////////////////////////////////////////////////////////////////////////////////
////////  SH = Shock Tube (from FD = Fluid Dynamics)  /////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

class ModelCalc_SH extends ModelCalc {

    static gamma = 1.4;  // perfect gas ratio of specific heats c_p / c_v
    static gammam1 = 0.4;  // gammam1 = gamma - 1
    static cL;  // aka c4
    static cR;  // aka c1
    static cmax;
    static p2;
    static p3;
    static c2;
    static c3;
    static u2;
    static u3;
    static u_shock;
    static rho2;
    static rho3;

    constructor() {
	super();

	this.x = empty('float64', [ Params_SH.N ]);  // vector of x values
	this.p = empty('float64', [ Params_SH.N ]);  // vector of pressure values
	this.c = empty('float64', [ Params_SH.N ]);  // vector of speed-of-sound values
	this.u = empty('float64', [ Params_SH.N ]);  // vector of velocity values
	this.m = empty('float64', [ Params_SH.N ]);  // vector of mach number values
	this.F1 = empty('float64', [ Params_SH.N - 1 ]);  // vector of flux element (rho*u) values
	this.F2 = empty('float64', [ Params_SH.N - 1 ]);  // vector of flux element (rho*u^2 + p) values
	this.F3 = empty('float64', [ Params_SH.N - 1 ]);  // vector of flux element (rho*e*u + p*u) values

	this.calc_quantities();
	this.set_analyt_soln_values();
    }

    model_is_stoch() {return false; }

    calc_quantities() {

	for (let i = 0; i < Params_SH.N; i++) {  // set the x coordinate values
	    this.x.set(i, i*Params_SH.h);
	}
	ModelCalc_SH.cL = this.get_c(Params_SH.pL, Params_SH.rhoL);
	ModelCalc_SH.cR = this.get_c(Params_SH.pR, Params_SH.rhoR);
	ModelCalc_SH.cmax = Math.max(ModelCalc_SH.cL, ModelCalc_SH.cR);
	Params_SH.ds = 0.45 * Params_SH.h / ModelCalc_SH.cmax;  // reduce 0.45 a bit??...  was seeing a bit of num instability...
	Params_SH.dsoh = 0.45 / ModelCalc_SH.cmax;  // for convenience; reduce 0.45 a bit??...  was seeing a bit of num instability...
    }

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
    
    get_rho(p_val, c_val) {  // get gas density rho value
	return ModelCalc_SH.gamma * p_val / (c_val*c_val);
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

    analyt_soln_implicit_eqn(p21, p41, rho41) {  // p21 = p2 / p1, etc.

	let bsqrt = Math.sqrt( (6.0/7.0) * (p21 - 1.0) + 1.0 );  // bsqrt = bottom (of the fraction) square root
	return p41**(1/7) * ( 1.0 - (1.0/7.0) * Math.sqrt(rho41/p41) * (p21 - 1.0) / bsqrt ) - p21**(1/7);
    }

    analyt_soln_implicit_eqn_for_root_finding(p21) {  // p21 = p2 / p1

	let p41 = Params_SH.pL / Params_SH.pR;  // pL aka p4; pR aka p1
	let rho41 = Params_SH.rhoL / Params_SH.rhoR;  // rhoL aka rho4; rhoR aka rho1
	return this.analyt_soln_implicit_eqn(p21, p41, rho41);
    }

    set_analyt_soln_values() {  // analytical solution to Riemann problem requires root finding, which has only been done for **this IC** (numerics difficult in js!)

	let p41 = Params_SH.pL / Params_SH.pR;  // pL aka p4; pR aka p1; used as upper bound in bracket in next step
	let p2_over_p1 = RootFinding.bisect_method(this.analyt_soln_implicit_eqn_for_root_finding.bind(this), 1.0, p41, 1e-15, 100);

	ModelCalc_SH.p2 = p2_over_p1 * Params_SH.pR;  // pR aka p1
	ModelCalc_SH.p3 = ModelCalc_SH.p2;
	ModelCalc_SH.u2 = 5.0 * ModelCalc_SH.cL * (1.0 - Math.pow(ModelCalc_SH.p2/Params_SH.pL, 1.0/7.0));  // cL aka c4; pL aka p4
	ModelCalc_SH.u3 = ModelCalc_SH.u2;
	ModelCalc_SH.u_shock = ModelCalc_SH.cR * Math.sqrt( (6.0/7.0) * (p2_over_p1 - 1.0) + 1.0 );  // cR aka c1
        ModelCalc_SH.c2 = ModelCalc_SH.cR * Math.sqrt( p2_over_p1 * (p2_over_p1 + 6.0) / (6.0*p2_over_p1 + 1.0) );  // cR aka c1
	ModelCalc_SH.c3 = ModelCalc_SH.cL - (1.0/5.0)*ModelCalc_SH.u3;  // cL aka c4
	ModelCalc_SH.rho2 = this.get_rho(ModelCalc_SH.p2, ModelCalc_SH.c2);
	ModelCalc_SH.rho3 = this.get_rho(ModelCalc_SH.p3, ModelCalc_SH.c3);
    }

    get_traj_max_t_val() {  // we calculate max_t such that simulation stops just before shock hits boundary
	let num_steps_shock_f = (0.5 * Params_SH.L_x / ModelCalc_SH.u_shock) / Params_SH.ds;  // (L/2)/u is time, then converted to float num time steps
	let max_t = parseInt(Math.floor(0.95 * num_steps_shock_f));  // take 95% of val, round down, and return result...
	return max_t;
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

	for (let i = 0; i < Params_SH.N - 1; i++) {  // flux entries sit between grid points; for F1,F2,F3 vectors indices 0,1,2,... --> 1/2, 3/2, 5/2,...
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

	// NOT CLEAR ON BEST WAY TO HANDLE BOUNDARY CONDITIONS...
	//rho.set(0, c_prev.rho.get(0) - Params_SH.dsoh*this.F1.get(0));
	//rhou.set(0, c_prev.rhou.get(0) - Params_SH.dsoh*this.F2.get(0));
	//rhoe.set(0, c_prev.rhoe.get(0) - Params_SH.dsoh*this.F3.get(0));
	
	//for (let i = 1; i < Params_SH.N - 1; i++) {  // ??? for i = 1:nx - 1 ??? for i = 2:nx - 2
	//for (let i = 2; i < Params_SH.N - 2; i++) {  // ??? for i = 1:nx - 1 ??? for i = 2:nx - 2
	for (let i = 1; i < Params_SH.N - 1; i++) {  // ??? for i = 1:nx - 1 ??? for i = 2:nx - 2
	    rho.set(i, c_prev.rho.get(i) - Params_SH.dsoh*(this.F1.get(i) - this.F1.get(i - 1)));
	    rhou.set(i, c_prev.rhou.get(i) - Params_SH.dsoh*(this.F2.get(i) - this.F2.get(i - 1)));
	    rhoe.set(i, c_prev.rhoe.get(i) - Params_SH.dsoh*(this.F3.get(i) - this.F3.get(i - 1)));
	}
	rho.set(0, rho.get(1));
	rhou.set(0, rhou.get(1));
	rhoe.set(0, rhoe.get(1));
	rho.set(Params_SH.N - 1, rho.get(Params_SH.N - 2));
	rhou.set(Params_SH.N - 1, rhou.get(Params_SH.N - 2));
	rhoe.set(Params_SH.N - 1, rhoe.get(Params_SH.N - 2));

	//rho.set(Params_SH.N - 1, c_prev.rho.get(Params_SH.N - 1) + Params_SH.dsoh*this.F1.get(Params_SH.N - 2));
	//rhou.set(Params_SH.N - 1, c_prev.rhou.get(Params_SH.N - 1) + Params_SH.dsoh*this.F2.get(Params_SH.N - 2));
	//rhoe.set(Params_SH.N - 1, c_prev.rhoe.get(Params_SH.N - 1) + Params_SH.dsoh*this.F3.get(Params_SH.N - 2));
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

	    this.s = 0.0;  // continuous time "clock" s (as opposed to SSNS time step t); start it at zero
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
	    this.x_contact_discont_analyt = Params_SH.L_x / 2;
	    this.x_shock_analyt = Params_SH.L_x / 2;

	} else {

	    this.s = this.c_prev.s + Params_SH.ds;  // update clock
	    this.mc.load_new_state_vectors(this.c_prev, this.rho, this.rhou, this.rhoe);
	    this.x_shock_analyt = this.c_prev.x_shock_analyt + ModelCalc_SH.u_shock * Params_SH.ds;
	    this.x_contact_discont_analyt = this.c_prev.x_contact_discont_analyt + ModelCalc_SH.u2 * Params_SH.ds;  // u2 == u3
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
	let traj_max_t_val = this.mc.get_traj_max_t_val();
	console.log("INFO:   SH t_max set to", traj_max_t_val - 1);  // is there an off-by-1 issue here???
	return traj_max_t_val;
    }
}
