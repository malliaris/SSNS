
///////////////////////////////////////////////////////////////////////////////////////////////
////////  SH = Shock Tube (from FD = Fluid Dynamics)  /////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

class ModelCalc_SH extends ModelCalc {

    static gamma = 1.4;  // perfect gas ratio of specific heats c_p / c_v

    constructor() {
	super();
    }

    model_is_stoch() {return false; }

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

	time = time + dt

      end
    */
}

class Params_SH extends Params {

    static L_x = 10.0;  // length of x-domain
    static h;  // spacing between consecutive grid points
    static ds = 0.01;  // EVENTUALLY USE ALGORITHM TO SET VALUE via CFL condition or similar???
    
    static UINI_N;  // = new UINI_int(this, "UI_P_FD_SH_N", false);  assignment occurs in UserInterface(); see discussion there
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

	if (this.constructing_init_cond) {  // NOTE: Params_SH.UINI_Ut/b.v passed in extra_args since they are simultaneously parameters and part of coordinate vector

	    //Coords_PF.temp_vs = empty('float64', [ Params_PF.mv_dim ]);
	    //this.vs = zeros([ Params_SH.mv_dim ], {'dtype': 'float64'});
	    //this.vs.set(0, this.extra_args[1]);  // this is ***Ub***  (chose to put 0th index of vector at bottom to "match" y coordinate axis from theory curve u(y) )

	} else {

	    //Coords_SH.temp_vs = copy(this.c_prev.vs);
	    //Coords_SH.temp_vs.set(0, this.p.Ub);  // ***Ub***  (chose to put 0th index of vector at bottom to "match" y coordinate axis from theory curve u(y) )

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
