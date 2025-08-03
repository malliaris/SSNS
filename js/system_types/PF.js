
///////////////////////////////////////////////////////////////////////////////////////////////
////////  PF = Planar Flow (from FD = Fluid Dynamics)  ////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

class ModelCalc_PF extends ModelCalc {

    constructor() {
	super();

	let eta = 0.1;//////////////////////

	// allocate and initialize matrix_M, which multiplies Coords_PF velocity vector v to update it
	this.matrix_M = zeros([ Params_PF.mv_dim, Params_PF.mv_dim ], {'dtype': 'float64'});
	for (let i = 0; i < Params_PF.mv_dim; i++) {

	    if ((i == 0) || (i == Params_PF.mv_dim - 1)) {
		this.matrix_M.set(i, i, 1.0);  // these diagonal entries keep the boundary v's unchanged
	    } else {

		for (let j = 0; j < Params_PF.mv_dim; j++) {  // for each interior row i...

		    if (j == i) {
			this.matrix_M.set(i, j, 1.0 - 2.0*eta);  // make the diagonal element 1 - 2*eta
		    }
		    if (j == i - 1) {
			this.matrix_M.set(i, j, eta);  // make the off-diagonal elements eta here...
		    }
		    if (j == i + 1) {
			this.matrix_M.set(i, j, eta);  // ... and here
		    }
		}
	    }
	}

    }

    model_is_stoch() {return false; }

    get_x_new(p, x) {
	//return (p.r * x * (1.0 - x));
    }
}

class Params_PF extends Params {

    static UINI_N;  // = new UINI_int(this, "UI_P_FD_PF_N", false);  assignment occurs in UserInterface(); see discussion there    
    static N;
    static mv_dim;  // mv_dim = matrix vector dimension (first/last indices correspond to top/bottom boundary plates, so dim is N + 2)

    constructor() {
	super();
	//this.r = r_val;

	// summarize physical parameter values
	//console.log("physical parameter value summary:");
	//console.log("N     :", Params_HS.N);
    }

    push_vals_to_UI() {
	//Params_LM.r.push_to_UI(this.r);
    }

    get_info_str() {
	//return "r = " + this.r;
    }
}

class Coords_PF extends Coords {

    constructor(...args) {  // see discussion of # args at definition of abstract Coords()

	super(...args);

	if (this.constructing_init_cond) {

	    //this.vs = new float64Array(Params_PF.mv_dim);
	    this.vs = zeros([ Params_PF.mv_dim ], {'dtype': 'float64'});
	    //for (let i = 0; i < Params_PF.mv_dim; i++) {
	    this.vs.set(0, 1.7);
	    this.vs.set(Params_PF.mv_dim - 1, 3.3);

	} else {

	    // periodically check back whether stdlib-js blas/base/dgemv routine is available via jsdelivr cdn!!!
	    this.vs = zeros([ Params_PF.mv_dim ], {'dtype': 'float64'});
	    for (let i = 0; i < Params_PF.mv_dim; i++) {  // doh!!!  matrix-vector product done by hand!!!
		let new_val = 0.0;
		for (let j = 0; j < Params_PF.mv_dim; j++) {
		    new_val += this.mc.matrix_M.get(i, j) * this.c_prev.vs.get(j);
		}
		this.vs.set(i, new_val);
	    }
	}
    }
}

class Trajectory_PF extends Trajectory {

    constructor(sim) {

	Params_PF.N = Params_PF.UINI_N.v;
	Params_PF.mv_dim = Params_PF.N + 2;  // mv_dim = matrix vector dimension (first/last indices correspond to top/bottom boundary plates, so dim is N + 2)

	super(sim);  // NOTE: all static vars used in ModelCalc/etc. constructors should precede this, while all local this.* vars should follow this
    }

    gmc() {  // gmc = get ModelCalc object
	return new ModelCalc_PF();
    }

    gp() {  // gp = get Params object    
	return new Params_PF();
    }

    gc_ic(mc) {  // gc_ic = get Coords, initial condition
	return new Coords_PF(mc, []);
    }

    gc_nv(mc, p, c_prev) {  // gc_nv = get Coords, new value
	return new Coords_PF(mc, p, c_prev, []);
    }

    get_max_num_t_steps() {
	return Trajectory.DEFAULT_MAX_NUM_T_STEPS
    }
}
