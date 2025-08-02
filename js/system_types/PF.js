
///////////////////////////////////////////////////////////////////////////////////////////////
////////  PF = Planar Flow (from FD = Fluid Dynamics)  ////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

class ModelCalc_PF extends ModelCalc {

    constructor() {
	super();

	this.mat_dim = 5 + 2;  // N + 2
	this.matrix_M = zeros([ this.mat_dim, this.mat_dim ], {'dtype': 'float64'});
	let eta = 0.1;
	for (let i = 0; i < this.mat_dim; i++) {
	    for (let j = 0; j < this.mat_dim; j++) {

		if (j == i) {
		    this.matrix_M.set(i, j, 1.0 - 2.0*eta);
		}
		if (j == i - 1) {
		    this.matrix_M.set(i, j, eta);
		}
		if (j == i + 1) {
		    this.matrix_M.set(i, j, eta);
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

/*
class Coords_LM extends Coords {

    static x_0 = undefined;  // = new UINI_float(this, "UI_P_ND_LM_x_0", true);  assignment occurs in UserInterface(); see discussion there

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


class Coords_IS extends Coords_Spin {

    static N = undefined;  // = new UINI_int(this, "UI_P_SM_IS_N", false);  assignment occurs in UserInterface(); see discussion there    

    constructor(...args) {  // see discussion of # args at definition of abstract Coords()

	super(...args);

	let N = this.extra_args[0];

	if (this.constructing_init_cond) {

	    this.spins = zeros([ N, N ], {'dtype': 'int8'});
	    Coords_Spin.randomize_spins_arr(this.spins, this.get_rand_spin_val.bind(this));
	    this.prev_trans = null;  // since IC was not arrived at via a transition

	} else {

	    let x = this.get_rand_index(N);  // pick a random site, both x...
	    let y = this.get_rand_index(N);  // ... and y
	    let old_val = this.c_prev.spins.get(x, y);
	    let proposed_val = this.flip_spin_val(old_val);  // only possible basic move is to flip the spin
	    let Delta_E = this.mc.get_Delta_E_proposed_move(proposed_val, this.c_prev.spins, x, y);
	    let move_accepted = this.mc.accept_move(Delta_E, this.p.T);
	    this.spins = copy(this.c_prev.spins);
	    if (move_accepted) {
		this.flip_spin(this.spins, x, y);
	    }
	    let new_val = this.spins.get(x, y);
	    let pts = new CoordTransition_Spin(x, y, old_val, new_val, move_accepted, Delta_E);
	    this.c_prev.next_trans = pts;
	    this.prev_trans = pts;
	}

    }

}

class Coords_IG extends Coords {

    constructor(...args) {  // see discussion of # args at definition of abstract Coords()

	super(...args);

	this.gpud = new GasParticleUpdate();

	if (this.constructing_init_cond) {

	    this.gsh = new GasSpeedHistogram();
	    this.particles = new Array();
	    this.initialize_particles_etc();

	    // initialize quantities involved in time-averaging
	    this.num_t_avg_contribs = 0;
	    this.P_x_cumul = 0.0;
	    this.P_y_cumul = 0.0;

	} else {

	    this.gsh = GasSpeedHistogram.copy(this.c_prev.gsh);
	    this.particles = copy(this.c_prev.particles);

	    // copy over quantities involved in time-averaging
	    this.num_t_avg_contribs = this.c_prev.num_t_avg_contribs;
	    this.P_x_cumul = this.c_prev.P_x_cumul;
	    this.P_y_cumul = this.c_prev.P_y_cumul;

	    this.update_state(Params_IG.dt);
	}
    }

}

class Trajectory_IG extends Trajectory {

    constructor(sim) {

	// Volume V is achieved by setting Lx = V and Ly = 1
	Params_IG.Lx = Params_IG.V.v;
	Params_IG.Ly = 1;

	super(sim);

	// still figuring out best way to store parameter values...
	this.N = Params_IG.N.v;
	this.T = Params_IG.T.v;
	this.V = Params_IG.V.v;
	this.m = Params_IG.m;
    }

    gmc() {  // gmc = get ModelCalc object
	return new ModelCalc_IG();
    }

    gp() {  // gp = get Params object


    // still figuring out best way to store parameter values...
    Params_PF.N = Params_PF.UINI_N.v;
    this.N = Params_PF.N;


    
	return new Params_IG(Params_IG.x_BC_refl, Params_IG.y_BC_refl);
    }

    gc_ic(mc) {  // gc_ic = get Coords, initial condition
	return new Coords_IG(mc, [ Params_IG.N.v ]);
    }

    gc_nv(mc, p, c_prev) {  // gc_nv = get Coords, new value
	return new Coords_IG(mc, p, c_prev, [ Params_IG.N.v ]);
    }

    get_max_num_t_steps() {
	return Trajectory.DEFAULT_MAX_NUM_T_STEPS
    }
}
*/
