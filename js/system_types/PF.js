
///////////////////////////////////////////////////////////////////////////////////////////////
////////  PF = Planar Flow (from FD = Fluid Dynamics)  ////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

class ModelCalc_PF extends ModelCalc {

    constructor() {
	super();

	// allocate and initialize matrix_M, which multiplies Coords_PF velocity vector v to update it
	this.matrix_M = zeros([ Params_PF.mv_dim, Params_PF.mv_dim ], {'dtype': 'float64'});
	for (let i = 0; i < Params_PF.mv_dim; i++) {

	    if ((i == 0) || (i == Params_PF.mv_dim - 1)) {
		this.matrix_M.set(i, i, 1.0);  // these diagonal entries keep the boundary v's unchanged
	    } else {

		for (let j = 0; j < Params_PF.mv_dim; j++) {  // for each interior row i...

		    if (j == i) {
			this.matrix_M.set(i, j, 1.0 - 2.0*Params_PF.zeta);  // make the diagonal element 1 - 2*zeta
		    }
		    if (j == i - 1) {
			this.matrix_M.set(i, j, Params_PF.zeta);  // make the off-diagonal elements zeta here...
		    }
		    if (j == i + 1) {
			this.matrix_M.set(i, j, Params_PF.zeta);  // ... and here
		    }
		}
	    }
	}

    }

    model_is_stoch() {return false; }

    // get a single value of the quadratic theory curve from solving true fluid equations (cf. Kundu 6th ed. section 9.2)
    get_analytical_steady_state_thr_val(Dpol, Ut, Ub, N, mu, i) {

	let alpha = Dpol / ( N * mu );
	console.log("alpha =", alpha);////////
	//return Cc + Cl*y + Cq*y*(h - y);
    }

    // get a single value of the quadratic theory curve from solving true fluid equations (cf. Kundu 6th ed. section 9.2)
    get_fluid_planar_flow_thr_val(Ut, Ub, h, mu, Dpdx, y) {

	let Cc = Ub;
	let Cl = (Ut - Ub) / h;
	//let Cq = 0.028 * Dpdx / mu;///  DID A FITTING TO CHECK FORM!!!  FIND ACTUAL THEORY/SIM MISMATCH!!!!!  GET RID OF 0.028 and put back 0.5
	let Cq = 0.5 * Dpdx / (h * mu);///  DID A FITTING TO CHECK FORM!!!  FIND ACTUAL THEORY/SIM MISMATCH!!!!!  GET RID OF 0.028 and put back 0.5
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
    static UINI_mu;  // = new UINI_float(this, "UI_P_FD_PF_mu", false);  assignment occurs in UserInterface(); see discussion there
    static mu;
    static UINI_N;  // = new UINI_int(this, "UI_P_FD_PF_N", false);  assignment occurs in UserInterface(); see discussion there
    static N;
    static mv_dim;  // mv_dim = matrix vector dimension (first/last indices correspond to top/bottom boundary plates, so dim is N + 2)
    static UINI_Dtorho;  // = new UINI_float(this, "UI_P_FD_PF_Dtorho", false);  assignment occurs in UserInterface(); see discussion there
    static Dtorho;// = 0.1;  // autocalculate this eventually?  Dtorho = Delta t / rho
    static zeta;  // zeta = mu * N * Dtorho  set in Trajectory_PF constructor

    constructor(Dpol_val, Ut_val, Ub_val) {
	super();

	this.Dpol = Dpol_val;
	this.eta = Params_PF.Dtorho * this.Dpol;  // eta = Delta t * Delta p / (rho * l)
	this.Ut = Ut_val;
	this.Ub = Ub_val;

	// summarize physical parameter values
	//console.log("physical parameter value summary:");
	//console.log("N     :", Params_HS.N);
    }

    push_vals_to_UI() {
	Params_PF.UINI_Dpol.push_to_UI(this.Dpol);
	Params_PF.UINI_Ut.push_to_UI(this.Ut);
	Params_PF.UINI_Ub.push_to_UI(this.Ub);
    }

    get_info_str() {
	return "Dpol = " + this.Dpol;
	return "eta = " + this.eta;
	return "Ut = " + this.Ut;
	return "Ub = " + this.Ub;
    }
}

class Coords_PF extends Coords {

    static temp_vs;
    
    constructor(...args) {  // see discussion of # args at definition of abstract Coords()

	super(...args);

	if (this.constructing_init_cond) {  // NOTE: Params_PF.UINI_Ut/b.v passed in extra_args since they are simultaneously parameters and part of coordinate vector

	    this.vs = zeros([ Params_PF.mv_dim ], {'dtype': 'float64'});
	    this.vs.set(0, this.extra_args[1]);  // this is ***Ub***  (chose to put 0th index of vector at bottom to "match" y coordinate axis from theory curve u(y) )
	    this.vs.set(Params_PF.mv_dim - 1, this.extra_args[0]);  // this is ***Ut***  (chose to put 0th index of vector at bottom to "match" y coordinate axis from theory curve u(y) )

	} else {

	    // it's a bit odd since Ut and Ub are simultaneously parameters and, in some sense, part of the coordinate vector...  We choose not to mess with c_prev.vs
	    // and not to check whether Ut/Ub values have changed, but rather to always make a copy of vs and assign Ut/UB as first/last entries, respectively, then
	    // calculate matrix-vector product...
	    Coords_PF.temp_vs = copy(this.c_prev.vs);
	    Coords_PF.temp_vs.set(0, this.p.Ub);  // ***Ub***  (chose to put 0th index of vector at bottom to "match" y coordinate axis from theory curve u(y) )
	    Coords_PF.temp_vs.set(Params_PF.mv_dim - 1, this.p.Ut);  // ***Ut***  (chose to put 0th index of vector at bottom to "match" y coordinate axis from theory curve u(y) )

	    // matrix-vector product;  periodically check back whether stdlib-js blas/base/dgemv routine is available via jsdelivr cdn!!!
	    this.vs = zeros([ Params_PF.mv_dim ], {'dtype': 'float64'});
	    for (let i = 0; i < Params_PF.mv_dim; i++) {  // doh!!!  matrix-vector product done by hand!!!
		let new_val = 0.0;
		for (let j = 0; j < Params_PF.mv_dim; j++) {
		    new_val += this.mc.matrix_M.get(i, j) * Coords_PF.temp_vs.get(j);
		}
		if ((i > 0) && (i < Params_PF.mv_dim - 1)) {
		    new_val += this.p.eta;  // only interior entries "feel the pressure" haha :-)
		}
		this.vs.set(i, new_val);
	    }
	}
    }
}

class Trajectory_PF extends Trajectory {

    constructor(sim) {

	Params_PF.mu = Params_PF.UINI_mu.v;
	Params_PF.N = Params_PF.UINI_N.v;
	Params_PF.mv_dim = Params_PF.N + 2;  // mv_dim = matrix vector dimension (first/last indices correspond to top/bottom boundary plates, so dim is N + 2)
	Params_PF.Dtorho = Params_PF.UINI_Dtorho.v;
	Params_PF.zeta = Params_PF.mu * Params_PF.N * Params_PF.Dtorho;
	Coords_PF.temp_vs = empty('float64', [ Params_PF.mv_dim ]);  // used in matrix-vector product in Coords_PF constructor

	super(sim);  // NOTE: all static vars used in ModelCalc/etc. constructors should precede this, while all local this.* vars should follow this
    }

    gmc() {  // gmc = get ModelCalc object
	return new ModelCalc_PF();
    }

    gp() {  // gp = get Params object    
	return new Params_PF(Params_PF.UINI_Dpol.v, Params_PF.UINI_Ut.v, Params_PF.UINI_Ub.v);
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
