
///////////////////////////////////////////////////////////////////////////////////////////////
////////  PF = Planar Flow (from FD = Fluid Dynamics)  ////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

class ModelCalc_PF extends ModelCalc {

    constructor() {
	super();
    }

    model_is_stoch() {return false; }

    get_x_new(p, x) {
	//return (p.r * x * (1.0 - x));
    }
}

class Params_LM extends Params {

    static r = undefined;  // = new UINI_float(this, "UI_P_ND_LM_r", true);  assignment occurs in UserInterface(); see discussion there

    constructor(r_val) {
	super();
	this.r = r_val;
    }

    push_vals_to_UI() {
	Params_LM.r.push_to_UI(this.r);
    }

    get_info_str() {
	return "r = " + this.r;
    }
}

class Params_IG extends Params {

    static N;  // = new UINI_int(this, "UI_P_SM_IG_N", false);  assignment occurs in UserInterface(); see discussion there    
    static V;  // = new UINI_float(this, "UI_P_SM_IG_V", false);  assignment occurs in UserInterface(); see discussion there
    static T;  // = new UINI_float(this, "UI_P_SM_IG_T", true);  assignment occurs in UserInterface(); see discussion there
    static x_BC_refl = true;  // = new UINI_int(this, "UI_P_SM_IG_xBC", true);  assignment occurs in UserInterface(); see discussion there
    static y_BC_refl = true;  // = new UINI_int(this, "UI_P_SM_IG_yBC", true);  assignment occurs in UserInterface(); see discussion there

    static R = 0.003;  // EVENTUALLY MAKE AN INPUT PARAMETER?
    static m = 10.0;  // EVENTUALLY MAKE AN INPUT PARAMETER?
    static dt = 0.01;  // EVENTUALLY MAKE AN INPUT PARAMETER?  OR USE SMALL ALGORITHM TO SET VALUE?
    static Lx;  // assignment occurs in Trajectory_IG constructor
    static Ly;  // assignment occurs in Trajectory_IG constructor
    static m_dist_code = "c";  // dummy value; c for constant? add a sensible distribution to try?
    static R_dist_code = "c";  // dummy value; c for constant? add a sensible distribution to try?
    static IC_code = "r";  // dummy value; eventually have many options here

    constructor(x_BC_refl, y_BC_refl) {

	super();
	this.x_BC_refl = x_BC_refl;
	this.y_BC_refl = y_BC_refl;

	// summarize physical parameter values
	console.log("physical parameter value summary:");
	console.log("N     :", Params_IG.N.v);
	console.log("kT    :", Params_IG.T.v);
	console.log("V     :", Params_IG.V.v);
	console.log("Lx    :", Params_IG.Lx);
	console.log("Ly    :", Params_IG.Ly);
	console.log("dt    :", Params_IG.dt);
	console.log("p_thr :", (Params_IG.N.v * Params_IG.T.v / Params_IG.V.v));
    }

    push_vals_to_UI() {
	Params_IG.x_BC_refl.push_to_UI(this.x_BC_refl);
	Params_IG.y_BC_refl.push_to_UI(this.y_BC_refl);
    }

    get_info_str() {
	return "x BC reflecting? = " + this.x_BC_refl;
	return "y BC reflecting? = " + this.y_BC_refl;
    }
}

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

class Trajectory_LM extends Trajectory {

    constructor(sim) {
	super(sim);
    }

    gmc() {  // gmc = get ModelCalc object
	return new ModelCalc_LM();
    }

    gp() {  // gp = get Params object
	return new Params_LM(Params_LM.r.v);
    }

    gc_ic(mc) {  // gc_ic = get Coords, initial condition
	return new Coords_LM(mc, [ Coords_LM.x_0.v ]);
    }

    gc_nv(mc, p, c_prev) {  // gc_nv = get Coords, new value
	return new Coords_LM(mc, p, c_prev, []);
    }

    get_max_num_t_steps() {
	return Trajectory.DEFAULT_MAX_NUM_T_STEPS
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////
////////  IS = Ising Model (from SM = Statistical Mechanics)  /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

class Params_IS extends Params_Spin {

    static T = undefined;  // = new UINI_float(this, "UI_P_SM_IS_T", true);  assignment occurs in UserInterface(); see discussion there

    push_vals_to_UI() {
	Params_IS.T.push_to_UI(this.T);
    }
}

class Coords_IS extends Coords_Spin {

    static N = undefined;  // = new UINI_int(this, "UI_P_SM_IS_N", false);  assignment occurs in UserInterface(); see discussion there    

    constructor(...args) {  // see discussion of # args at definition of abstract Coords()

	super(...args);

	// TRY TO MOVE CHUNKS OF THIS UP TO Coords_Spin()?

	// this.spins, the data structure the holds the square grid of spins
	// * we represent spin down as 0 and spin up as 1
	// * dtype binary would have been perfect, but it's not implemented (yet?)
	// * also, the underlying array doesn't appear to be available at this.spins.data as it was with int32... stride issue?
	this.prev_trans;  // will "point" to previous CoordTransition_Spin object for backward navigation
	this.next_trans;  // will "point" to next CoordTransition_Spin object for forward navigation

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

	// regardless of how the data was calculated, we record the state of the rng(s) for potential future use
	this.unif01_rng_state = this.mc.unif01_rng.state;
	this.discunif_rng_state = this.mc.discunif_rng.state;
    }

    get_rand_spin_val() {
	return this.mc.discunif_rng(0, 1);  // [0, 1]
    }

    flip_spin_val(curr_val) {  // alternatively, we could return ((curr_val + 1) % 2)... safer?
	return 1 - curr_val;  // 1 --> 1 - 1 = 0  and  0 --> 1 - 0 = 1
    }

    flip_spin(sa, x, y) {  // sa = spins array
	sa.set(x, y, this.flip_spin_val(sa.get(x, y)));
    }

    flip_random_spin() {
	let x = get_rand_index(this.mc.N);
	let y = get_rand_index(this.mc.N);
	this.flip_spin(this.spins, x, y);
    }
}

// * note that, in this model, N is # rows/columns in square array of spins, whereas, in the 1D SP models, N + 1 sites ran [0, N]
class Trajectory_IS extends Trajectory_Stoch {

    constructor(sim) {

	super(sim);
    }

    gmc() {  // gmc = get ModelCalc object
	return new ModelCalc_IS(Coords_IS.N.v);
    }

    gp() {  // gp = get Params object
	return new Params_IS(Params_IS.T.v);
    }

    gc_ic(mc) {  // gc_ic = get Coords, initial condition
	return new Coords_IS(mc, [ Coords_IS.N.v ]);
    }

    gc_nv(mc, p, c_prev) {  // gc_nv = get Coords, new value
	return new Coords_IS(mc, p, c_prev, [ Coords_IS.N.v ]);
    }

    set_rng_states_from_edge_vals() {
	this.mc.unif01_rng.state = this.get_x(this.t_edge).unif01_rng_state;
	this.mc.discunif_rng.state = this.get_x(this.t_edge).discunif_rng_state;
    }	

    get_max_num_t_steps() {
	return Trajectory.DEFAULT_MAX_NUM_T_STEPS
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////
////////  IG = Ideal Gas (from SM = Statistical Mechanics)  /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

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

    initialize_particles_etc() {

	let vc = {x: 0.0, y: 0.0};  // vc = velocity components (useful for passing into methods that set both)

	for (let i = 0; i < Params_IG.N.v; i++) {

	    let rx = this.mc.mbde.get_rand_x();  // random x position
	    let ry = this.mc.mbde.get_rand_y();  // random y position

	    //let v_chi = this.mc.mbde.get_MBD_v_chi(Params_IG.T.v, Params_IG.m);
	    //this.mc.mbde.load_vc_spec_v_rand_dir(vc, v_chi);

	    //let v_avg = this.mc.mbde.get_MBD_v_avg(Params_IG.T.v, Params_IG.m);
	    //this.mc.mbde.load_vc_spec_v_rand_dir(vc, v_avg);

	    //this.mc.mbde.load_vc_spec_v_rand_dir(vc, 1.0);

	    this.mc.mbde.load_vc_MBD_v_comps(vc, Params_IG.T.v, Params_IG.m);

	    let vx = vc.x;
	    let vy = vc.y;
	    let new_p = new GasParticle(rx, ry, Params_IG.R, Params_IG.m, vx, vy);
	    new_p.v_hist_bi = GasSpeedHistogram.get_bin_indx(new_p.get_speed());
	    CU.incr_entry_OM(this.gsh.hist, new_p.v_hist_bi);  // increment bin count
	    this.particles.push(new_p);
	}
    }
    
    update_state(dt) {

	this.num_x_collisions = 0;
	this.num_y_collisions = 0;
	this.P_x = 0.0;
	this.P_y = 0.0;

	for (let i = 0; i < Params_IG.N.v; i++) {

	    // update x-direction position and quantities
	    this.gpud.set_inputs(this.particles[i].x, this.particles[i].vx, Params_IG.Lx, Params_IG.x_BC_refl, dt);  // set inputs...
	    this.particles[i].x = this.gpud.new_z;           // ...then grab calculated values
	    this.particles[i].vx = this.gpud.new_vz;         // ...then grab calculated values
	    this.num_x_collisions += this.gpud.num_collisions;  // ...then grab calculated values
	    this.P_x += 2.0 * this.gpud.num_collisions * this.particles[i].m * Math.abs(this.particles[i].vx) / (2 * Params_IG.Ly * dt);  // 2*Ly in denominator converts force to pressure

	    // update y-direction position and quantities
	    this.gpud.set_inputs(this.particles[i].y, this.particles[i].vy, Params_IG.Ly, Params_IG.y_BC_refl, dt);  // set inputs...
	    this.particles[i].y = this.gpud.new_z;           // ...then grab calculated values
	    this.particles[i].vy = this.gpud.new_vz;         // ...then grab calculated values
	    this.num_y_collisions += this.gpud.num_collisions;  // ...then grab calculated values
	    this.P_y += 2.0 * this.gpud.num_collisions * this.particles[i].m * Math.abs(this.particles[i].vy) / (2 * Params_IG.Lx * dt);  // 2*Lx in denominator converts force to pressure
	}

	// update time-averaged quantities
	this.num_t_avg_contribs += 1;
	this.P_x_cumul += this.P_x;
	this.P_y_cumul += this.P_y;
	this.P_x_t_avg = this.P_x_cumul / this.num_t_avg_contribs;
	this.P_y_t_avg = this.P_y_cumul / this.num_t_avg_contribs;
	this.PVoNkT_x_t_avg = this.P_x_t_avg * Params_IG.V.v / (Params_IG.N.v * Params_IG.T.v);
	this.PVoNkT_y_t_avg = this.P_y_t_avg * Params_IG.V.v / (Params_IG.N.v * Params_IG.T.v);
    }

    output() {

	for (let i = 0; i < Params_IG.N.v; i++) {

	    let cp = this.particles[i];  // cp = current particle; for convenience
	    console.log("i = ", i, "x = ", cp.x, "y = ", cp.y, "vx = ", cp.vx, "vy = ", cp.vy);
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
