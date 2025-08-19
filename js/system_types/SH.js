
///////////////////////////////////////////////////////////////////////////////////////////////
////////  SH = Shock Tube (from FD = Fluid Dynamics)  /////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

class ModelCalc_SH extends ModelCalc {

    static gamma = 1.4;  // perfect gas ratio of specific heats c_p / c_v
    static gammam1 = 0.4;  // gammam1 = gamma - 1

    constructor() {
	super();

	this.p = empty('float64', [ Params_SH.N ]);  // vector of pressure values
	this.c = empty('float64', [ Params_SH.N ]);  // vector of speed-of-sound values
	this.u = empty('float64', [ Params_SH.N ]);  // vector of velocity values
	this.m = empty('float64', [ Params_SH.N ]);  // vector of mach number values
	this.F1 = empty('float64', [ Params_SH.N ]);  // vector of flux element (rho*u) values
	this.F2 = empty('float64', [ Params_SH.N ]);  // vector of flux element (rho*u^2 + p) values
	this.F3 = empty('float64', [ Params_SH.N ]);  // vector of flux element (rho*e*u + p*u) values
    }

    model_is_stoch() {return false; }

    load_derived_vectors_pcum(rho, rhou, rhoe) {

	for (let i = 0; i < Params_SH.N; i++) {
	    let p_val = ModelCalc_SH.gammam1 * (rhoe.get(i) - 0.5 * rhou.get(i) * rhou.get(i) / rho.get(i));
	    this.p.set(i, p_val);
	}
	for (let i = 0; i < Params_SH.N; i++) {
	    let c_val = Math.sqrt( ModelCalc_SH.gamma * this.p.get(i) / rho.get(i) );
	    this.c.set(i, c_val);
	}
	for (let i = 0; i < Params_SH.N; i++) {
	    let u_val = rhou.get(i) / rho.get(i);
	    this.u.set(i, u_val);
	}
	for (let i = 0; i < Params_SH.N; i++) {
	    let m_val = this.u.get(i) / this.c.get(i);
	    this.m.set(i, m_val);
	}
    }

    load_flux_vectors(rho, rhou, rhoe) {

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

	for (let i = 2; i < Params_SH.N - 2; i++) {  // ??? for i = 1:nx - 1 ??? for i = 2:nx - 2
	    rho.set(i, c_prev.rho.get(i) - Params_SH.dsoh*(this.F1.get(i) - this.F1.get(i - 1)));
	    rhou.set(i, c_prev.rhou.get(i) - Params_SH.dsoh*(this.F2.get(i) - this.F2.get(i - 1)));
	    rhoe.set(i, c_prev.rhoe.get(i) - Params_SH.dsoh*(this.F3.get(i) - this.F3.get(i - 1)));
	}
    }

    /*

      nx = 40*256;
      tfinal = 0.005;
      xl = 10.0;
      time = 0;
      gg = 1.4;
      h = xl/(nx - 1);

      for i = 1:nx,x(i) = h*(i - 1);end

      p_left = 100000;
      p_right = 10000;
      r_left = 1;
      r_right = 0.125;
      //???u_left = 0;
      r = zeros(1,nx);
      ru = zeros(1,nx);
      rE = zeros(1,nx);
      p = zeros(1,nx);
      c = zeros(1,nx);
      u = zeros(1,nx);
      m = zeros(1,nx);
      F1 = zeros(1,nx);
      F2 = zeros(1,nx);
      F3 = zeros(1,nx);

      for i = 1:nx, r(i) = r_right;ru(i) = 0.0;rE(i) = p_right/(gg - 1);end
      for i = 1:nx/2; r(i) = r_left; rE(i) = p_left/(gg - 1); end

      cmax = sqrt( max(gg*p_right/r_right,gg*p_left/r_left) );
      dt = 0.45*h/cmax;
      maxstep = tfinal/dt;
      
      for istep = 1:maxstep
        for i = 1:nx,p(i) = (gg - 1)*(rE(i) - 0.5*(ru(i)*ru(i)/r(i)));end
	for i = 1:nx,c(i) = sqrt( gg*p(i)/r(i) );end
	for i = 1:nx,u(i) = ru(i)/r(i);end;
	for i = 1:nx,m(i) = u(i)/c(i);end

	// Find fluxes
	for i = 1:nx - 1
	  F1(i) = 0.5*(ru(i + 1) + ru(i)) - 0.5*(abs(ru(i + 1)) - abs(ru(i)));
	  F2(i) = 0.5*(u(i + 1)*ru(i + 1) + p(i + 1) + u(i)*ru(i) + p(i)) - 0.5*(abs(u(i + 1))*ru(i + 1) - abs(u(i))*ru(i)) - 0.5*(p(i + 1)*m(i + 1) - p(i)*m(i));
	  F3(i) = 0.5*(u(i + 1)*(rE(i + 1) + p(i + 1)) + u(i)*(rE(i) + p(i))) - 0.5*(abs(u(i + 1))*rE(i + 1) - abs(u(i))*rE(i)) - 0.5*(p(i + 1)*c(i + 1) - p(i)*c(i));
	  if m(i) > 1, F2(i) = ru(i)*u(i) + p(i);
	    F3(i) = (rE(i) + p(i))*u(i);end
	  if m(i) < -1, F2(i) = ru(i + 1)*u(i + 1) + p(i + 1);
	    F3(i) = (rE(i + 1) + p(i + 1))*u(i + 1);end
	end

	// Update solution
	for i = 2:nx - 2
	  r(i) = r(i) - (dt/h)*(F1(i) - F1(i - 1));
	  ru(i) = ru(i) - (dt/h)*(F2(i) - F2(i - 1));
	  rE(i) = rE(i) - (dt/h)*(F3(i) - F3(i - 1));
	end

	time = time + dt//???,istep

      end

    */
}

class Params_SH extends Params {

    static L_x = 10.0;  // length of x-domain
    static h;  // spacing between consecutive grid points
    static ds = 0.01;  // EVENTUALLY USE ALGORITHM TO SET VALUE via CFL condition or similar???
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

	if (this.constructing_init_cond) {

	    this.rho = empty('float64', [ Params_SH.N ]);  // vector of rho (i.e., density) grid values
	    this.rhou = empty('float64', [ Params_SH.N ]);  // vector of rho*u grid values
	    this.rhoe = empty('float64', [ Params_SH.N ]);  // vector of rho*e grid values

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

	    this.mc.load_derived_vectors_pcum(this.c_prev.rho, this.c_prev.rhou, this.c_prev.rhoe);
	    console.log("p", this.mc.p._buffer);/////
	    console.log("c", this.mc.c._buffer);/////
	    console.log("u", this.mc.u._buffer);/////
	    console.log("m", this.mc.m._buffer);/////
	    this.mc.load_flux_vectors(this.c_prev.rho, this.c_prev.rhou, this.c_prev.rhoe);
	    console.log("1", this.mc.F1._buffer);/////
	    console.log("2", this.mc.F2._buffer);/////
	    console.log("3", this.mc.F3._buffer);/////
	    this.rho = empty('float64', [ Params_SH.N ]);  // vector of rho (i.e., density) grid values
	    this.rhou = empty('float64', [ Params_SH.N ]);  // vector of rho*u grid values
	    this.rhoe = empty('float64', [ Params_SH.N ]);  // vector of rho*e grid values
	    this.mc.load_new_state_vectors(this.c_prev, this.rho, this.rhou, this.rhoe);
	    console.log("r ", this.rho._buffer);/////
	    console.log("ru", this.rhou._buffer);/////
	    console.log("re", this.rhoe._buffer);/////
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
	Params_SH.dsoh = Params_SH.ds / Params_SH.h;  // for convenience

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
