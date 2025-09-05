
///////////////////////////////////////////////////////////////////////////////////////////////
////////  PF = Planar Flow (from FD = Fluid Dynamics)  ////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

class ModelCalc_PF extends ModelCalc {

    constructor() {
	super();

	this.set_default_Dt();
    }

    model_is_stoch() {return false; }

    // calculate a heuristic default Dt to set us up for likely numerical stability (see help viewer entry for Dt for more)
    set_default_Dt() {
	let prelim_default_Dt_val = 0.1 / (Params_PF.UINI_mu.v * Params_PF.N * Params_PF.N);  // adjust 0.1 as necessary/desired
	let default_Dt_val = roundsd(prelim_default_Dt_val, 4);  // no point in keeping too many significant digits
	Params_PF.UINI_Dt.sv(default_Dt_val);
	console.log("default Dt set to", default_Dt_val);
    }

    // load a_vect with values calculated from v_vect and alpha; a_vect's first and last entries are set to zero
    load_a_vect(a_vect, prefactor, v_vect, alpha) {

	for (let i = 1; i <= Params_PF.v_dim - 2; i++) {  // NOTE the limits for values i runs over...
	    let a_val = prefactor * ( v_vect.get(i + 1) + v_vect.get(i - 1) - 2.0*v_vect.get(i) - alpha );  // ...so i +- 1 are in range here
	    a_vect.set(i, a_val);
	}
	a_vect.set(0, 0.0);
	a_vect.set(Params_PF.v_dim - 1, 0.0);
    }
    
    // get single analytical steady state value
    get_analytical_steady_state_thr_val(i, N, Ut, Ub, alpha) {

	return ( (N - i)*Ut + (i + 1.0)*Ub ) / (N + 1.0) - alpha*(i + 1.0)*(N - i)/2.0;  // can this be put in form (Ut + Ub)/2 + ... ?
    }

    // get vector of the analytical steady state values
    get_analytical_steady_state_thr_vect(alpha, Ut, Ub, N, mu) {

	let arr_to_return = [];

	for (let i = 0; i < N; i++) {
	    let v_val = this.get_analytical_steady_state_thr_val(i, N, Ut, Ub, alpha);
	    let y_val = (i + 0.5)/N;
	    arr_to_return.push( [ y_val, v_val ] );  // flot requires format [ [x0, y0], [x1, y1], ... ]
	}
	return arr_to_return;
    }

    // get a single value of the quadratic theory curve from solving true fluid equations (cf. Kundu 6th ed. section 9.2)
    get_fluid_planar_flow_thr_val(Ut, Ub, h, mu, Dpdx, y) {

	let Cc = Ub;  // Coeff_const
	let Cl = (Ut - Ub) / h;  // Coeff_linear
	let Cq = -0.5 * Dpdx / (h * mu);  // Coeff_quadratic
	return Cc + Cl*y + Cq*y*(h - y);
    }

    // get curve (i.e., vector of values) of the quadratic theory curve from solving true fluid equations (cf. Kundu 6th ed. section 9.2)
    get_fluid_planar_flow_thr_curve(Ut, Ub, h, mu, Dpdx, num_points) {

	let arr_to_return = [];
	let y_vals = linspace(0, h, num_points);
	for (let i = 0; i < num_points; i++) {

	    let y = y_vals[i];
	    let u_y = this.get_fluid_planar_flow_thr_val(Ut, Ub, h, mu, Dpdx, y);
	    arr_to_return.push( [ y, u_y ] );  // flot requires format [ [x0, y0], [x1, y1], ... ]
	}
	return arr_to_return;
    }
}

class Params_PF extends Params {

    static UINI_Dpol;  // = new UINI_float(this, "UI_P_FD_PF_Dpol", true);  assignment occurs in UserInterface(); see discussion there;  Dpol = Delta p / l
    static UINI_Ut;  // = new UINI_float(this, "UI_P_FD_PF_Ut", true);  assignment occurs in UserInterface(); see discussion there;  Ut = U of top plate
    static UINI_Ub;  // = new UINI_float(this, "UI_P_FD_PF_Ub", true);  assignment occurs in UserInterface(); see discussion there;  Ub = U of bottom plate
    static UINI_mu;  // = new UINI_float(this, "UI_P_FD_PF_mu", true);  assignment occurs in UserInterface(); see discussion there
    static UINI_Dt;  // = new UINI_float(this, "UI_P_FD_PF_Dt", true);  assignment occurs in UserInterface(); see discussion there
    static UINI_N;  // = new UINI_int(this, "UI_P_FD_PF_N", false);  assignment occurs in UserInterface(); see discussion there
    static N;
    static v_dim;  // v_dim = vector dimension (first/last indices correspond to top/bottom boundary plates, so dim is N + 2)
    static rho = 1.0;  // mass density generally appears with time as (Delta t / rho), so we fix it for simplicity at rho = 1
    static h = 1.0;  // height of set of slabs generally appears with viscosity as (mu / h^2), so we fix it for simplicity at h = 1
    // whether to use Runge Kutta 4 rather than forward Euler for numerical integration; set to false since (1) Euler is a tad faster (2) accuracy is not really
    // an issue, and (3) no significant difference when it comes to numerical stability and choice of Dt value
    static use_RK4_not_Euler = false;

    constructor(Dpol_val, Ut_val, Ub_val, mu_val, Dt_val) {
	super();

	this.Dpol = Dpol_val;
	this.Ut = Ut_val;
	this.Ub = Ub_val;
	this.mu = mu_val;
	this.Dt = Dt_val;
	this.alpha = this.Dpol * Params_PF.h * Params_PF.h / (this.mu * Params_PF.N * Params_PF.N);  // alpha = Dpol * h^2 / (mu * N^2)
	this.a_prefactor = this.mu * Params_PF.N * Params_PF.N / ( Params_PF.rho * Params_PF.h * Params_PF.h );  // used in mc.load_a_vect()

	// summarize physical parameter values
	//console.log("physical parameter value summary:");
	//console.log("N     :", Params_HS.N);
    }

    push_vals_to_UI() {
	Params_PF.UINI_Dpol.push_to_UI(this.Dpol);
	Params_PF.UINI_Ut.push_to_UI(this.Ut);
	Params_PF.UINI_Ub.push_to_UI(this.Ub);
	Params_PF.UINI_mu.push_to_UI(this.mu);
	Params_PF.UINI_Dt.push_to_UI(this.Dt);
    }

    get_info_str() {
	return "Dpol = " + this.Dpol;
	return "Ut = " + this.Ut;
	return "Ub = " + this.Ub;
	return "mu = " + this.mu;
	return "Dt = " + this.Dt;
    }
}

class Coords_PF extends Coords {

    static temp_vs; static v1; static v2; static v3; static v4; static vRK4; static k1; static k2; static k3; static k4; static kRK4;
    
    constructor(...args) {  // see discussion of # args at definition of abstract Coords()

	super(...args);

	if (this.constructing_init_cond) {  // NOTE: Params_PF.UINI_Ut/b.v passed in extra_args since they are simultaneously parameters and part of coordinate vector

	    this.vs = zeros([ Params_PF.v_dim ], {'dtype': 'float64'});
	    this.vs.set(0, this.extra_args[1]);  // this is ***Ub***  (chose to put 0th index of vector at bottom to "match" y coordinate axis from theory curve u(y) )
	    this.vs.set(Params_PF.v_dim - 1, this.extra_args[0]);  // this is ***Ut***  (chose to put 0th index of vector at bottom to "match" y coordinate axis from theory curve u(y) )
	    this.xs = zeros([ Params_PF.v_dim ], {'dtype': 'float64'});  // vector of slab positions tracked for visualization in PlotTypeCV_PF

	} else {

	    // it's a bit odd since Ut and Ub are simultaneously parameters and, in some sense, part of the coordinate vector...  We choose not to mess with c_prev.vs
	    // and not to check whether Ut/Ub values have changed, but rather to always make a copy of vs and assign Ut/UB as first/last entries, respectively, then
	    Coords_PF.temp_vs = copy(this.c_prev.vs);
	    Coords_PF.temp_vs.set(0, this.p.Ub);  // ***Ub***  (chose to put 0th index of vector at bottom to "match" y coordinate axis from theory curve u(y) )
	    Coords_PF.temp_vs.set(Params_PF.v_dim - 1, this.p.Ut);  // ***Ut***  (chose to put 0th index of vector at bottom to "match" y coordinate axis from theory curve u(y) )
	    this.vs = zeros([ Params_PF.v_dim ], {'dtype': 'float64'});  // "v's", as in v values (not versus)

	    if (Params_PF.use_RK4_not_Euler) {  // use Runge Kutta (RK4) method

		CU.copy_vect(Coords_PF.temp_vs, Coords_PF.v1);  // calc v1
		//console.log("v1", Coords_PF.v1._buffer);/////////
		this.mc.load_a_vect(Coords_PF.k1, this.p.a_prefactor, Coords_PF.v1, this.p.alpha);  // calc k1
		//console.log("k1", Coords_PF.k1._buffer);/////////

		CU.scal_mult_vect(Coords_PF.v2, (this.p.Dt / 2.0), Coords_PF.k1);  // calc dv2
		CU.add_vects(Coords_PF.v2, Coords_PF.v1, Coords_PF.v2);  // calc v2
		//console.log("v2", Coords_PF.v2._buffer);/////////
		this.mc.load_a_vect(Coords_PF.k2, this.p.a_prefactor, Coords_PF.v2, this.p.alpha);  // calc k2
		//console.log("k2", Coords_PF.k2._buffer);/////////

		CU.scal_mult_vect(Coords_PF.v3, (this.p.Dt / 2.0), Coords_PF.k2);  // calc dv3
		CU.add_vects(Coords_PF.v3, Coords_PF.v1, Coords_PF.v3);  // calc v3
		//console.log("v3", Coords_PF.v3._buffer);/////////
		this.mc.load_a_vect(Coords_PF.k3, this.p.a_prefactor, Coords_PF.v3, this.p.alpha);  // calc k3
		//console.log("k3", Coords_PF.k3._buffer);/////////

		CU.scal_mult_vect(Coords_PF.v4, this.p.Dt, Coords_PF.k3);  // calc dv4
		CU.add_vects(Coords_PF.v4, Coords_PF.v1, Coords_PF.v4);  // calc v4
		//console.log("v4", Coords_PF.v4._buffer);/////////
		this.mc.load_a_vect(Coords_PF.k4, this.p.a_prefactor, Coords_PF.v4, this.p.alpha);  // calc k4
		//console.log("k4", Coords_PF.k4._buffer);/////////

		CU.scal_mult_vect(Coords_PF.k2, 2.0, Coords_PF.k2);  // k2 --> 2k2
		CU.scal_mult_vect(Coords_PF.k3, 2.0, Coords_PF.k3);  // k3 --> 2k3
		CU.add_vects(Coords_PF.kRK4, Coords_PF.k1, Coords_PF.k2);
		CU.add_vects(Coords_PF.kRK4, Coords_PF.kRK4, Coords_PF.k3);
		CU.add_vects(Coords_PF.kRK4, Coords_PF.kRK4, Coords_PF.k4);  // kRK4 now holds k1 + 2*k2 + 2*k3 + k4
		//console.log("kRK4", Coords_PF.kRK4._buffer);/////////

		CU.scal_mult_vect(Coords_PF.vRK4, (this.p.Dt / 6.0), Coords_PF.kRK4);  // calc dvRK4
		CU.add_vects(Coords_PF.vRK4, Coords_PF.v1, Coords_PF.vRK4);  // calc vRK4
		//console.log("vRK4", Coords_PF.vRK4._buffer);/////////
		CU.copy_vect(Coords_PF.vRK4, this.vs);

	    } else {  // use forward Euler method

		CU.copy_vect(Coords_PF.temp_vs, Coords_PF.v1);  // calc v1
		//console.log("v1", Coords_PF.v1._buffer);/////////
		this.mc.load_a_vect(Coords_PF.k1, this.p.a_prefactor, Coords_PF.temp_vs, this.p.alpha);  // calc a
		//console.log("k1", Coords_PF.k1._buffer);/////////

		CU.scal_mult_vect(this.vs, this.p.Dt, Coords_PF.k1);  // calc dv
		CU.add_vects(this.vs, Coords_PF.v1, this.vs);
		//console.log("vs", this.vs._buffer);/////////
	    }
	    

	    // update slab positions (tracked for visualization in PlotTypeCV_PF) using **newly-calculated** velocities
	    this.xs = zeros([ Params_PF.v_dim ], {'dtype': 'float64'});
	    for (let i = 0; i < Params_PF.v_dim; i++) {
		let new_x_val = this.c_prev.xs.get(i) + this.vs.get(i) * this.p.Dt;  // would rather have Dt alone here, but np since this is only for visualization
		this.xs.set(i, new_x_val);
	    }
	}
    }
}

class Trajectory_PF extends Trajectory {

    constructor(sim) {

	Params_PF.N = Params_PF.UINI_N.v;
	Params_PF.v_dim = Params_PF.N + 2;  // v_dim = vector dimension (first/last indices correspond to top/bottom boundary plates, so dim is N + 2)
	Coords_PF.temp_vs = empty('float64', [ Params_PF.v_dim ]);  // used in Coords_PF constructor
	Coords_PF.v1 = empty('float64', [ Params_PF.v_dim ]);  // used in Coords_PF constructor
	Coords_PF.v2 = empty('float64', [ Params_PF.v_dim ]);  // used in Coords_PF constructor
	Coords_PF.v3 = empty('float64', [ Params_PF.v_dim ]);  // used in Coords_PF constructor
	Coords_PF.v4 = empty('float64', [ Params_PF.v_dim ]);  // used in Coords_PF constructor
	Coords_PF.vRK4 = empty('float64', [ Params_PF.v_dim ]);  // used in Coords_PF constructor
	Coords_PF.k1 = empty('float64', [ Params_PF.v_dim ]);  // used in Coords_PF constructor
	Coords_PF.k2 = empty('float64', [ Params_PF.v_dim ]);  // used in Coords_PF constructor
	Coords_PF.k3 = empty('float64', [ Params_PF.v_dim ]);  // used in Coords_PF constructor
	Coords_PF.k4 = empty('float64', [ Params_PF.v_dim ]);  // used in Coords_PF constructor
	Coords_PF.kRK4 = empty('float64', [ Params_PF.v_dim ]);  // used in Coords_PF constructor

	super(sim);  // NOTE: all static vars used in ModelCalc/etc. constructors should precede this, while all local this.* vars should follow this
    }

    gmc() {  // gmc = get ModelCalc object
	return new ModelCalc_PF();
    }

    gp() {  // gp = get Params object    
	return new Params_PF(Params_PF.UINI_Dpol.v, Params_PF.UINI_Ut.v, Params_PF.UINI_Ub.v, Params_PF.UINI_mu.v, Params_PF.UINI_Dt.v);
    }

    gc_ic(mc) {  // gc_ic = get Coords, initial condition
	return new Coords_PF(mc, [ Params_PF.UINI_Ut.v, Params_PF.UINI_Ub.v ]);  // Ut and Ub are simultaneously parameters and part of the coordinate vector
    }

    gc_nv(mc, p, c_prev) {  // gc_nv = get Coords, new value
	return new Coords_PF(mc, p, c_prev, []);
    }

    get_max_num_t_steps() {
	return Trajectory.DEFAULT_MAX_NUM_T_STEPS
    }
}
