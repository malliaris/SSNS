
///////////////////////////////////////////////////////////////////////////////////////////////
////////  HS = Hard Sphere Gas (from SM = Statistical Mechanics)  /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

class GasParticle_HS extends GasParticle {

    constructor(x, y, R, mass, vx, vy, rho_val_i, rho) {

	super(x, y, mass, vx, vy);

	this.R = R;
	this.rho_val_i = rho_val_i;  // integer index associated with density value (will, e.g., be translated into greyscale color)
	this.rho = rho;  // particle density, which will be plotted as greyscale color
	this.E_hist_bi;  // E_hist_bi = E histogram bin index
	this.cet_entries = new OrderedSet([], CollisionEvent.compare_CEs);
    }

    static copy(gptc) {  // "copy constructor"; gptc = GasParticle_HS to copy

	let ngp = new GasParticle_HS(gptc.x, gptc.y, gptc.R, gptc.m, gptc.vx, gptc.vy);  // ngp = new gas particle
	for (const cei = gptc.cet_entries.begin(); !cei.equals(gptc.cet_entries.end()); cei.next()) {
	    ngp.cet_entries.insert(copy(cei.pointer));
	}
	ngp.rho_val_i = gptc.rho_val_i;
	ngp.rho = gptc.rho;
	ngp.v_hist_bi = gptc.v_hist_bi;
	ngp.E_hist_bi = gptc.E_hist_bi;
	return ngp;
    }
}

// class to "wrap" the particle update code, which gets used for both the x and y directions
//
// * in another language, we would have a method instead of a class and pass in references, e.g., &vx or &vy, but that's not possible in js
// * after calling set_inputs(...), the new/needed values are present in this.num_collisions, this.new_z, and this.new_vz
// * to clarify: arguments are passed in by value, so method does not modify anything external, and so new values need to be "installed" explicitly after the call
//
// The following particle-update code rests on these assumptions:
//
// * ideal gas, i.e., no particle-particle collisions
// * point particles, i.e., R = 0 for wall collision purposes, even if graphically R > 0
// * walls do not move, i.e., no piston for compression/expansion work
// * BC are periodic, reflecting, or something similarly simple
//
// Making these assumptions allows us to use, e.g., x += vx*dt and then wrap/reflect and count collisions after the fact, keeping things simple
//
// NOTE: T is measured in energy units, i.e., it could be called tau = k_B T
class ModelCalc_HS extends ModelCalc_Gas {

    static Z_Solana;  // set in do_post_particle_creation_tasks() and used in CollisionPressureStats.calc_quantities()
    static Z_SHY;  // set in do_post_particle_creation_tasks() and used in CollisionPressureStats.calc_quantities()
    
    constructor(ui, rs) {

	super();

	this.ui = ui;  // this is reference to UserInterface object this.sim.ui to access aux_ctr, etc. in CollisionPressureStats...
	this.rs = rs;  // this is reference to RunState object this.sim.rs to access params_changed in CoordsHS constructor...
    }

    get_rand_sign() {
	return ((this.discunif_rng(0, 1) == 0) ? -1.0 : 1.0);
    }

    get_rand_R_val(R_min, R_max, R_cutoff) {

	for (let i = 0; i < Params_HS.num_IC_creation_attempts; i++) {  // stop trying after a certain # failed attempts

	    let beta_dist_val = this.beta_rng(Params_HS.R_dist_a, Params_HS.R_dist_b);
	    let candidate_R = R_min + (R_max - R_min)*beta_dist_val;
	    if (candidate_R < R_cutoff) {
		return candidate_R;
	    }
	}
	console.log("ERROR:   Failed to draw a small enough Beta-distributed radius even after", Params_HS.num_IC_creation_attempts, "attempts.  Check parameter values and/or try reloading SSNS.");
	return 0.0;  // dummy value
    }

    static get_m_from_rho_and_R(rho, R) {
	return Math.PI * R * R * rho;  // we're interpreting rho as mass/area and multiplying by area of circular cross-section of sphere (or disc)
    }

    static get_mean_area_frac(N, R_mean, A) {
	return N * Math.PI * R_mean * R_mean / A;
    }

    // solve quadratic to find R_max that will produce desired mean area fraction, given R_min, N, etc.;
    // calculation involved E[X] and E[X^2] (via the variance) for X ~ Beta(a, b)
    // basic Beta dist stats printed out since it's convenient
    static get_R_max_from_mean_area_frac(N, R_min, a, b, A, frac) {  // "R_dist_*" removed for brevity

	let mean = a / (a + b);  // mean of Beta dist
	let vrnce = a*b / ((a + b)*(a + b)*(a + b + 1.0));  // variance of Beta dist
	let stddev = Math.sqrt(vrnce);
	let EX2 = vrnce + mean*mean;  // for convenience; this is E[X^2]
	let EXoEX2 = mean / EX2;  // for convenience; this is E[X] / E[X^2]
	let B = 2.0 * R_min * (EXoEX2 - 1.0);  // coefficient of linear term; quadratic coefficient A = 1
	let C = R_min*R_min*(1.0 - 2.0*EXoEX2 + 1.0/EX2) - frac*A / (N*Math.PI*EX2);  // constant term
	let R_max = -0.5*B + 0.5*Math.sqrt( B*B - 4.0*C );  // take positive root in quadratic formula
	console.log("INFO:   Beta dist stats (mean, variance, std. dev.) =", mean, ",", vrnce, ",", stddev, R_min, (B*B - 4.0*C));
	console.log("INFO:   ... cont'd ... (mean - stddev, mean + stddev, R_max)", (mean - stddev), (mean + stddev), R_max);
	return R_max;
    }

    static get_Z_Solana(eta) {  // see Mulero - Theory and Simulation of Hard-Sphere Fluids and Related Systems: equation 3.42 (due to Solana)

	return (1.0 + 5.0*eta*eta/64.0) / ( (1.0 - eta)*(1.0 - eta) );
    }

    static get_Z_SHY(eta) {  // see Mulero - Theory and Simulation of Hard-Sphere Fluids and Related Systems: equation 3.35

	let eta_c = Math.PI * Math.sqrt(3.0) / 6.0;
	let eta_c_fctr = (2.0*eta_c - 1.0) / (eta_c*eta_c);
	return 1.0 / ( 1.0 - 2.0*eta + eta_c_fctr*eta*eta);
    }
}

// js equivalent of a C #define macro... see static get accessors in Params_HS
const T_W = 0;  // Top Wall
const L_W = 1;  // Left Wall
const B_W = 2;  // Bottom Wall
const R_W = 3;  // Right Wall (*** the only one that can move! ***)

// NOTE: T is measured in energy units, i.e., it could be called tau = k_B T
class Params_HS extends Params {

    static get T_W() {return T_W; }  // == 0; basically a #define; Top Wall
    static get L_W() {return L_W; }  // == 1; basically a #define; Left Wall
    static get B_W() {return B_W; }  // == 2; basically a #define; Bottom Wall
    static get R_W() {return R_W; }  // == 3; basically a #define; Right Wall (*** the only one that can move! ***)

    static UINI_N;  // = new UINI_int(this, "UI_P_SM_HS_N", false);  assignment occurs in UserInterface(); see discussion there    
    static N;
    static UINI_kT0;  // = new UINI_float(this, "UI_P_SM_HS_kT0", false);  assignment occurs in UserInterface(); see discussion there
    static kT0;
    static UINI_v_pist;  // = new UINI_float(this, "UI_P_SM_HS_v_pist", true);  assignment occurs in UserInterface(); see discussion there
    static UICI_rho;  // = new UICI_HS_rho(this, "UI_P_SM_HS_rho", false);  assignment occurs in UserInterface(); see discussion there
    static UICI_R;  // = new UICI_HS_R(this, "UI_P_SM_HS_R", false);  assignment occurs in UserInterface(); see discussion there
    static UICI_IC;  // = new UICI_HS_IC(this, "UI_P_SM_HS_IC", false);  assignment occurs in UserInterface(); see discussion there

    static R_min = 1e-10;  // see initialize_particle_basics(); coordinate value with Beta distribution; Beta dist mean, mode are a/(a + b) and (a - 1)/(a + b - 2), resp.
    static R_max;  // now auto-calculated in get_R_max_from_mean_area_frac() based on other parameter values
    static R_dist_a = 1.000001;
    static R_dist_b = 100;
    static R_single_value;  // now auto-calculated in create_particles_w_random_R_x_y() based on other parameter values
    static target_area_frac = 0.001;
    static total_particle_area;  // calculated once (in do_post_particle_creation_tasks()) after particles are created
    static R_tiny_particle_cutoff = 0.005;
    static R_tiny_particle_drawn_as = 0.01;
    static draw_tiny_particles_artificially_large = true;
    static color_tracker_particle = true;  // whether to paint the i == 0 particle red for easy visual tracking
    static m_single_value = 1.0;  // not a big loss of flexibility setting m to unity since other parameters, e.g., T can always be tweaked
    static num_rho_vals = 4;                                                        // VALUE MUST MATCH NUMBER OF ENTRIES IN ARRAYS BELOW!
    static rho_vals = [1e4, 1e5, 1e6, 1e7];                                         // ARRAY LENGTH MUST MATCH NUMBER STORED IN num_rho_vals!
    static rho_greyscale_val_strs = ["#cccccc", "#888888", "#444444", "#000000"];   // ARRAY LENGTH MUST MATCH NUMBER STORED IN num_rho_vals!
    static num_particles_per_rho_val;
    static num_IC_creation_attempts = 1000;
    static ds = 0.01;  // eventually use algorithm to set value?
    static Lx_min = 0.05;  // assignment occurs in Trajectory_HS constructor
    static Lx_max = 1.0;  // assignment occurs in Trajectory_HS constructor
    static Ly = 1.0;  // assignment occurs in Trajectory_HS constructor
    static x_RW_max = Params_HS.Lx_max - Params_HS.Lx_min;  // NOTE: RW piston coordinate is flipped: positive (negative) is compression (expansion)
    static x_RW_min = 0.0;
    static x_RW_0 = 0.0;  // initial value of x_RW
    
    static get_wi_char(i) {
	let char_arr = ["T", "L", "B", "R"];
	return char_arr[i];
    }
    
    constructor(v_pist_0) {

	super();

	this.v_pist_0 = v_pist_0;

	// summarize physical parameter values
	console.log("physical parameter value summary:");
	console.log("N        :", Params_HS.N);
	console.log("kT       :", Params_HS.kT0);
	console.log("Ly       :", Params_HS.Ly);
	console.log("Lx_min   :", Params_HS.Lx_min);
	console.log("Lx_max   :", Params_HS.Lx_max);
	console.log("x_RW_min :", Params_HS.x_RW_min);
	console.log("x_RW_max :", Params_HS.x_RW_max);
	console.log("x_RW_0   :", Params_HS.x_RW_max);
	console.log("ds       :", Params_HS.ds);
    }

    push_vals_to_UI() {
	Params_HS.UINI_v_pist.push_to_UI(this.v_pist_0);
    }

    get_info_str() {
	return "v_pist_0 = " + this.v_pist_0;
    }
}

class Coords_HS extends Coords {

    static s;  // the official "clock" for our continuous time gas system; using s rather than t so as not to confuse with SSNS discrete time step t
    static WC_just_occurred;  // indicates whether a Wall-Container (WC) collision just occurred; set in update_collision_structures_WC()
    static dummy_particle = new GasParticle_HS(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0);  // used in creating particles, checking positions for overlap, etc.
    static EPSILON = 1e-10;  // used, e.g., as a little cushion when positioning particles

    constructor(...args) {  // see discussion of # args at definition of abstract Coords()

	super(...args);

	if (this.constructing_init_cond) {

	    this.x_RW = Params_HS.x_RW_0;  // set Right Wall (RW) piston initial position
	    this.v_RW = this.extra_args[1];  // this is basically parameter v_pist_0, passed in an awkward way since Params p is not available
	    this.cps = new CollisionPressureStats_HS(this.mc.ui);
	    this.psh = new ParticleQuantityHistogram(ParticleQuantityHistogram.get_reasonable_v_bin_width(Params_HS.kT0, Params_HS.m_single_value, Params_HS.N));// 0.2);  // psh = particle speed histogram
	    this.peh = new ParticleQuantityHistogram(ParticleQuantityHistogram.get_reasonable_E_bin_width(Params_HS.kT0, Params_HS.N));// 0.5);  // peh = particle energy histogram
	    this.cet = new CollisionEventsTable();
	    this.particles = new Array();
	    this.initialize_particle_basics();
	    this.do_post_particle_creation_tasks();
	    this.initialize_collision_structures();

	} else {

	    this.cps = CollisionPressureStats_HS.copy(this.c_prev.cps);
	    this.psh = ParticleQuantityHistogram.copy(this.c_prev.psh);
	    this.peh = ParticleQuantityHistogram.copy(this.c_prev.peh);  // peh = particle energy histogram
	    this.copy_particles_collision_structures_etc();

	    // determine this timestep's x_RW and v_RW initial values (actual values may change during timestep's update_state() routines)
	    this.x_RW = this.c_prev.x_RW;  // initial Right Wall (RW) piston position is always taken from previous CoordsHS
	    if ((this.mc.rs.params_changed) || (Coords_HS.WC_just_occurred)) {  // value of initial Right Wall (RW) piston velocity depends on various things...

		if (Coords_HS.WC_just_occurred) {  // if a Wall-Container (WC) collision just occurred

		    this.v_RW = this.c_prev.v_RW;  // should == 0, I believe
		    this.p.v_pist_0 = 0.0;
		    console.log("INFO:\tthe piston hit its max amount of compression or extension in the previous timestep, so v_pist is now 0 ...");
		    Params_HS.UINI_v_pist.sv(0.0);  // push corrected value back to UI
		    Coords_HS.WC_just_occurred = false;  // reset indicator
		    // NOTE: the way things are structured, user must "wait" 1 timestep after WC collision before moving piston again... no big deal

		} else {  // else, user has requested a new value...

		    // determine whether requested value of v_RW is allowed given state of x_RW
		    let requested_v_pist_0 = this.p.v_pist_0;
		    let attempting_overcompress = ((requested_v_pist_0 > 0) && (this.x_RW >= Params_HS.x_RW_max));  // can't compress beyond compression limit
		    let attempting_overexpand = ((requested_v_pist_0 < 0) && (this.x_RW <= Params_HS.x_RW_min));  // can't expand beyond expansion limit
		    if (attempting_overcompress || attempting_overexpand) {
			this.v_RW = 0.0;
			this.p.v_pist_0 = 0.0;
			console.log("INFO:\tin Coords_HS constructor: requested v_pist would compress/expand gas beyond limits Params_HS.Lx_min/max!  Setting v_pist to 0 ...");
			Params_HS.UINI_v_pist.sv(0.0);  // push corrected value back to UI
		    } else {  // otherwise, go ahead with requested value and update data structures accordingly
			this.v_RW = this.p.v_pist_0;
			this.delete_and_reenter_RW_entries(Coords_HS.s);  // since v_RW has been changed
		    }
		}

	    } else {
		this.v_RW = this.c_prev.v_RW;
	    }

	    this.update_state(Params_HS.ds);
	}
	this.check_basic_machinery_integrity_and_output();
	//this.check_cet_table_and_entries_integrity_and_output(true);
    }

    get_rand_x_centered_interval(length, offset) {

	let Dx = length - 2.0*offset;
	return (Dx*this.mc.unif01_rng() + offset);
    }

    get_rand_y_centered_interval(length, offset) {

	let Dy = length - 2.0*offset;
	return (Dy*this.mc.unif01_rng() + offset);
    }

    get_kT() {  // wrapper for convenience
	return this.mc.get_kT(Params_HS.N, this.particles);
    }

    get_Lx() {
	return (Params_HS.Lx_max - this.x_RW);  // NOTE: RW piston coordinate is flipped: positive (negative) is compression (expansion)
    }

    get_area() {
	return (Params_HS.Ly * this.get_Lx());  // NOTE: RW piston coordinate is flipped: positive (negative) is compression (expansion)
    }

    get_total_particle_area() {

	let total_particle_area = 0.0;
	for (let i = 0; i < Params_HS.N; i++) {
	    let particle_area = Math.PI * this.particles[i].R * this.particles[i].R;
	    total_particle_area += particle_area;
	}
	return total_particle_area;
    }

    get_area_frac() {
	return Params_HS.total_particle_area / this.get_area();
    }

    particle_config_free_of_overlaps() {

	for (let i = 1; i < this.particles.length; i++) {  // use particles.length instead of N to be able to check partially-formed config; check each pair... NOTE starting index of i == 1
	    for (let j = 0; j < i; j++) {        //                    NOTE ending index of j == i - 1
		if (CollisionEvent_PP.are_overlapping(this.particles[i], this.particles[j])) {
		    return false;
		}
	    }
	}
	return true;
    }

    candidate_particle_position_free_of_overlaps(cand_particle) {

	for (let j = 0; j < this.particles.length; j++) {  // use particles.length instead of N to be able to check partially-formed config
	    if (CollisionEvent_PP.are_overlapping(this.particles[j], cand_particle)) {
		return false;
	    }
	}
	return true;
    }
    
    // add entries to both the main data structure (cet.table) and auxiliary entries within each particle's cet_entries array
    add_collision_event_PP(i, j, s_to_add) {  // s_to_add will be added to Ds_coll to give absolute time s_coll for collision event

	let Ds_coll = CollisionEvent_PP.get_Ds_collision(this.particles[i], this.particles[j]);
	let s_coll = s_to_add + Ds_coll;
    	let ce = new CollisionEvent_PP(i, j, s_coll);
	this.cet.table.insert(ce);
	this.particles[i].cet_entries.insert(copy(ce));
	this.particles[j].cet_entries.insert(copy(ce));
    }

    get_particle_rho_val_i(indx) {  // determine and return new particle's density value index (which then is used to determine density)

	if (Params_HS.UICI_rho.use_distribution()) {  // if rho distribution is being used...
	    let modf_parts = modf(indx / Params_HS.num_particles_per_rho_val);
	    return parseInt(modf_parts[0]);
	} else {  // otherwise, all particles have the same rho_val_i and rho value
	    return 0;
	}
    }

    // REVIEW HOW THIS METHOD FITS IN AND CONSIDER REFACTORING TO SIMPLIFY
    get_particle_mass_val(rho_val, R_val) {  // determine and return new particle's mass

	if (Params_HS.UICI_rho.all_particles_same_m()) {
	    return Params_HS.m_single_value;
	} else {
	    return ModelCalc_HS.get_m_from_rho_and_R(rho_val, R_val);
	}
    }

    report_num_particles_w_R_below_cutoff() {

	let num_particles_w_R_below_cutoff = 0;
	for (let i = 0; i < Params_HS.N; i++) {
	    if (this.particles[i].R < Params_HS.R_tiny_particle_cutoff) {
		num_particles_w_R_below_cutoff += 1;
	    }
	}
	console.log("INFO:   ", num_particles_w_R_below_cutoff, "out of", Params_HS.N, "particles are below cutoff and therefore depicted as open circles");
    }

    set_up_grid_structures(N, only_perimeter, shuffle_spots) {

	// determine grid_size ("size" of grid, meaning the number of particles per row or column)
	this.grid_size = 1;
	while (N > this.grid_size*this.grid_size) {
	    this.grid_size += 1;
	}
	this.grid_seg_length = 1.0 / (this.grid_size + 1);
	this.under_grid_spacing = this.grid_seg_length - Coords_HS.EPSILON;
	this.under_half_grid_spacing = this.grid_seg_length/2.0 - Coords_HS.EPSILON;

	// add N coordinate pairs to an array, which can then be optionally shuffled
	this.grid_coordinate_pairs = [];
	for (let i = 0; i < N; i++) {
	    let ci = this.grid_size - 1 - parseInt(Math.floor(i / this.grid_size));  // ci = column index
	    let ri = i % this.grid_size;  // ri = row index
	    let xc = (ri + 1) * this.grid_seg_length;
	    let yc = (ci + 1) * this.grid_seg_length;
	    let on_verticals = (((ci == 1) || (ci == this.grid_size - 2)) && (ri >= 1) && (ri <= this.grid_size - 2));
	    let on_horizontals = (((ri == 1) || (ri == this.grid_size - 2)) && (ci >= 1) && (ci <= this.grid_size - 2));
	    let on_perimeter = on_verticals || on_horizontals;  // site is on (not necessarily outermost) square perimeter
	    if (( ! only_perimeter) || (on_perimeter)) {
		this.grid_coordinate_pairs.push([xc, yc]);
	    }
	}
	if (shuffle_spots) this.grid_coordinate_pairs = shuffle(this.grid_coordinate_pairs, {'copy': 'none'});  // shuffle items (the coordinate pairs) to randomize density arrangement
    }

    // create specific particle arrangement for the confinement IC (#4)
    // ASSUME piston is fully extended when this method is called, so that Lx = Ly = 1
    create_particles_confinement_IC() {

	// set up confined particles first so that the red i == 0 tracker particle is one of them
	let num_confined_particles = Params_HS.N - this.grid_coordinate_pairs.length;
	let confined_particle_pseudo_kT = Params_HS.N * Params_HS.kT0 / num_confined_particles;
	console.log("confined_particle_pseudo_kT =", confined_particle_pseudo_kT);////////////
	let pc = {x: 0.0, y: 0.0};  // pc = position components (to pass into methods that set both)
	let vc = {x: 0.0, y: 0.0};  // vc = velocity components (to pass into methods that set both)
	let R_val = 0.003;
	let rho_val_i = 0;
	let rho_val = Params_HS.rho_vals[rho_val_i];     // ... to determine density
	let mass_val = ModelCalc_HS.get_m_from_rho_and_R(rho_val, R_val);  // determine new particle's mass
	Coords_HS.dummy_particle.R = R_val;  // needs to be set for call(s) to are_overlapping() below
	let offset_from_wall = 2.6 * this.grid_seg_length;
	for (let i = 0; i < num_confined_particles; i++) {

	    let particle_positioning_successful = false;
	    for (let j = 0; j < Params_HS.num_IC_creation_attempts; j++) {  // stop trying after a certain # failed attempts

		Coords_HS.dummy_particle.x = this.get_rand_x_centered_interval(this.get_Lx(), offset_from_wall);  // candidate x position
		Coords_HS.dummy_particle.y = this.get_rand_y_centered_interval(Params_HS.Ly, offset_from_wall);  // candidate y position

		if (this.candidate_particle_position_free_of_overlaps(Coords_HS.dummy_particle)) {
		    particle_positioning_successful = true;
		    pc.x = Coords_HS.dummy_particle.x;
		    pc.y = Coords_HS.dummy_particle.y;
		    break;
		}
	    }
	    if ( ! particle_positioning_successful) {
		throw new Error("ERROR:   Failed to find a non-overlapping position for particle even after " + Params_HS.num_IC_creation_attempts + " attempts.  Check parameter values and/or try reloading SSNS.");
	    }

	    this.mc.mbde.load_vc_spec_v_rand_dir(vc, this.mc.mbde.get_BD_v(confined_particle_pseudo_kT, mass_val));
	    let new_p = new GasParticle_HS(pc.x, pc.y, R_val, mass_val, vc.x, vc.y, rho_val_i, rho_val);
	    this.particles.push(new_p);
	}

	// set up large enclosure particles second (see note above)
	R_val = this.grid_seg_length/2.0 - Coords_HS.EPSILON;
	rho_val_i = 3;
	rho_val = Params_HS.rho_vals[rho_val_i];     // ... to determine density
	mass_val = ModelCalc_HS.get_m_from_rho_and_R(rho_val, R_val);  // determine new particle's mass

	for (let i = 0; i < this.grid_coordinate_pairs.length; i++) {  // 

	    let xc = this.grid_coordinate_pairs[i][0];  // x position
	    let yc = this.grid_coordinate_pairs[i][1];  // y position
	    let new_p = new GasParticle_HS(xc, yc, R_val, mass_val, 0.0, 0.0, rho_val_i, rho_val);  // 0.0 for vx and vy
	    this.particles.push(new_p);
	}
    }

    get_sorted_R_arr() {

	let R_vals = [];
	if (Params_HS.UICI_R.use_distribution()) {  // if R distribution is being used...

	    for (let i = 0; i < Params_HS.N; i++) {
		R_vals.push(this.mc.get_rand_R_val(Params_HS.R_min, Params_HS.R_max, Params_HS.R_cutoff));
	    }
	    R_vals = R_vals.sort( (R1, R2) => R2 - R1);  // sort bigger R's first so they are positioned first below

	} else {  // otherwise, all particles have the same R value, which we calculate from target_area_frac

	    let particle_area = Params_HS.target_area_frac * this.get_area() / Params_HS.N;
	    Params_HS.R_single_value = Math.sqrt(particle_area / Math.PI);
	    for (let i = 0; i < Params_HS.N; i++) {
		R_vals.push(Params_HS.R_single_value);
	    }
	}
	return R_vals;
    }

    // create particles, setting R, x, and y to random values along the way (R's are random only if requested)
    create_particles_w_random_R_x_y() {

	let R_vals = this.get_sorted_R_arr();
	for (let i = 0; i < Params_HS.N; i++) {

	    Coords_HS.dummy_particle.R = R_vals[i];  // set dummy particle's R using array from above
	    let particle_positioning_successful = false;
	    for (let j = 0; j < Params_HS.num_IC_creation_attempts; j++) {  // make repeated attempts to position this particle

		let dist_from_wall = Coords_HS.dummy_particle.R + Coords_HS.EPSILON;
		Coords_HS.dummy_particle.x = this.get_rand_x_centered_interval(this.get_Lx(), dist_from_wall);  // candidate x position
		Coords_HS.dummy_particle.y = this.get_rand_y_centered_interval(Params_HS.Ly, dist_from_wall);  // candidate y position

		if (this.candidate_particle_position_free_of_overlaps(Coords_HS.dummy_particle)) {  // check dummy particle against existing particles array entries for overlap

		    particle_positioning_successful = true;
		    let new_p = new GasParticle_HS(Coords_HS.dummy_particle.x, Coords_HS.dummy_particle.y, Coords_HS.dummy_particle.R, 0.0, 0.0, 0.0, 0, 0.0);
		    let random_position = this.mc.discunif_rng(0, this.particles.length);
		    this.particles.splice(random_position, 0, new_p);  // (0 is # of items to delete in splice() method)
		    break;
		}
	    }
	    if ( ! particle_positioning_successful) {
		throw new Error("ERROR:   Failed to find a non-overlapping position for particle even after " + Params_HS.num_IC_creation_attempts + " attempts.  Check parameter values and/or try reloading SSNS.");
	    }
	}
    }

    // create particles, setting R, x, and y along the way; positions will be on grid and R's will be (if requested) random
    create_particles_on_grid_w_random_R() {

	let R_vals = this.get_sorted_R_arr();  // positioning particles in descending order of R might not be necessary here w/ R_cutoff, but no harm...
	for (let i = 0; i < Params_HS.N; i++) {

	    Coords_HS.dummy_particle.R = R_vals[i];  // set dummy particle's R using array from above
	    let particle_positioning_successful = false;
	    for (let j = 0; j < this.grid_coordinate_pairs.length; j++) {  // iterate down grid_coordinate_pairs, i.e., try all unfilled grid positions

		Coords_HS.dummy_particle.x = this.grid_coordinate_pairs[j][0];  // candidate x position
		Coords_HS.dummy_particle.y = this.grid_coordinate_pairs[j][1];  // candidate y position
		if (this.candidate_particle_position_free_of_overlaps(Coords_HS.dummy_particle)) {

		    particle_positioning_successful = true;
		    this.grid_coordinate_pairs.splice(j, 1);
		    let new_p = new GasParticle_HS(Coords_HS.dummy_particle.x, Coords_HS.dummy_particle.y, Coords_HS.dummy_particle.R, 0.0, 0.0, 0.0, 0, 0.0);
		    let random_position = this.mc.discunif_rng(0, this.particles.length);
		    this.particles.splice(random_position, 0, new_p);  // (0 is # of items to delete in splice() method)
		    break;
		}
	    }
	    if ( ! particle_positioning_successful) {
		console.log("ERROR:   Failed to find a non-overlapping position for particle out of all remaining grid spots.  Check parameter values and/or try reloading SSNS.");
	    }
	}
    }
    
    set_particle_rho_mass() {

	for (let i = 0; i < Params_HS.N; i++) {

	    let cp = this.particles[i];  // for convenience
	    cp.rho_val_i = this.get_particle_rho_val_i(i);  // determine new particle's density value index, which then is used...
	    cp.rho = Params_HS.rho_vals[cp.rho_val_i];     // ... to determine density
	    cp.m = this.get_particle_mass_val(cp.rho, cp.R);  // determine new particle's mass
	}
    }
    
    set_particle_velocity_eql(p, kT, m) {

	let vc = {x: 0.0, y: 0.0};  // vc = velocity components (to pass into methods that set both)
	let v_Boltzmann = this.mc.mbde.get_BD_v(kT, m);  // draw E from Boltzmann dist, then convert to v via m*v^2/2
	this.mc.mbde.load_vc_spec_v_rand_dir(vc, v_Boltzmann);  // pick random direction and load v components
	p.vx = vc.x;
	p.vy = vc.y;
    }

    get_single_v_conserve_tot_energy() {

	let sum_of_masses = 0.0;
	for (let i = 0; i < Params_HS.N; i++) {
	    sum_of_masses += this.particles[i].m;
	}
	return Math.sqrt(2.0 * Params_HS.N * Params_HS.kT0 / sum_of_masses);
    }

    set_particle_velocities_implosion() {

	let x_mid = this.get_Lx() / 2.0;
	let y_mid = Params_HS.Ly / 2.0;

	// calculate the sum of m_i * d_i^2 for use below
	let sum_m_d2 = 0.0;
	for (let i = 0; i < Params_HS.N; i++) {
	    let Dx = this.particles[i].x - x_mid;
	    let Dy = this.particles[i].y - y_mid;
	    let dist_from_center = Math.sqrt( Dx*Dx + Dy*Dy );
	    sum_m_d2 += this.particles[i].m * dist_from_center * dist_from_center;
	}

	// actually set particle velocities
	let speed_mult_fctr = Math.sqrt(2.0 * Params_HS.N * Params_HS.kT0 / sum_m_d2);  // use sum_m_d2 from above so that total energy is N*k_B*T_0
	for (let i = 0; i < Params_HS.N; i++) {
	    let Dx = this.particles[i].x - x_mid;
	    let Dy = this.particles[i].y - y_mid;
	    let dist_from_center = Math.sqrt( Dx*Dx + Dy*Dy );
	    let speed = speed_mult_fctr * dist_from_center;
	    let angle_from_center = atan2(Dy, Dx);  // note argument order!
	    this.particles[i].vx = -1.0 * speed * Math.cos(angle_from_center);
	    this.particles[i].vy = -1.0 * speed * Math.sin(angle_from_center);
	}
    }

    do_post_particle_creation_tasks() {

	// all ICs except confinement (4) allow user to switch rho and R between single values and distributions
	if (Params_HS.UICI_IC.v == 4) {

	    $("#UI_P_SM_HS_rho").hide();
	    $("#UI_P_SM_HS_R").hide();
	} else {

	    $("#UI_P_SM_HS_rho").show();
	    $("#UI_P_SM_HS_R").show();
	}

	// store quantity histogram bin indices and update respective histograms
	for (let i = 0; i < Params_HS.N; i++) {

	    this.particles[i].v_hist_bi = this.psh.get_bin_indx(this.particles[i].get_speed());
	    CU.incr_entry_OM(this.psh.hist, this.particles[i].v_hist_bi);  // increment bin count
	    this.particles[i].E_hist_bi = this.peh.get_bin_indx(this.particles[i].get_KE());
	    CU.incr_entry_OM(this.peh.hist, this.particles[i].E_hist_bi);  // increment bin count
	}

	// miscellaneous tasks
	console.log("INFO:   Aiming for area fraction of", Params_HS.target_area_frac, "using auto-calculated R_max of", Params_HS.R_max, "and R_cutoff of", Params_HS.R_cutoff);
	Params_HS.total_particle_area = this.get_total_particle_area();
	let area_frac = this.get_area_frac();
	//console.log("INFO:   Generated gas of particles is", ((this.particle_config_free_of_overlaps() ? "" : "NOT") + "free of overlaps and has area fraction of"), area_frac);  // GET RID OF OVERLAP CHECK???
	console.log("INFO:   Generated gas of particles has total particle area", Params_HS.total_particle_area, " and (currently) area fraction", area_frac);
	this.report_num_particles_w_R_below_cutoff();
	ModelCalc_HS.Z_Solana = ModelCalc_HS.get_Z_Solana(area_frac);
	ModelCalc_HS.Z_SHY = ModelCalc_HS.get_Z_SHY(area_frac);
	console.log("INFO:   Z_Solana =", ModelCalc_HS.Z_Solana);
	console.log("INFO:   Z_SHY =", ModelCalc_HS.Z_SHY);
	console.log("INFO:   kT =", this.get_kT());
    }
    
    initialize_particle_basics() {

	let ideal_R_max = ModelCalc_HS.get_R_max_from_mean_area_frac(Params_HS.N, 1e-10, Params_HS.R_dist_a, Params_HS.R_dist_b, this.get_area(), Params_HS.target_area_frac);  // NOTE: 0 for R_min, here
	Params_HS.R_max = ideal_R_max;

	switch (Params_HS.UICI_IC.v) {

	case 0:  // random | single v_0

	    Params_HS.R_cutoff = Math.min(ideal_R_max, 0.75);  // this setup not ideal yet... ideal_R_max may be > 1, which obviously won't fit
	    this.create_particles_w_random_R_x_y();
	    this.set_particle_rho_mass();
	    let single_v0 = this.get_single_v_conserve_tot_energy();
	    let rand_angle = this.mc.mbde.get_rand_angle();
	    for (let i = 0; i < Params_HS.N; i++) {
		this.particles[i].vx = single_v0 * Math.cos(rand_angle);
		this.particles[i].vy = single_v0 * Math.sin(rand_angle);
	    }
	    break;

	case 1:  // im/ex-plosion

	    this.set_up_grid_structures(Params_HS.N, false, true);
	    Params_HS.R_min = Params_HS.R_tiny_particle_cutoff + Coords_HS.EPSILON;  // would rather have all particles filled in... nicer visually
	    Params_HS.R_cutoff = this.under_half_grid_spacing/2.0;
	    this.create_particles_on_grid_w_random_R();
	    this.set_particle_rho_mass();
	    this.set_particle_velocities_implosion();
	    break;

	case 2:  // 1D oscillators

	    this.set_up_grid_structures(Params_HS.N, false, true);
	    Params_HS.R_min = Params_HS.R_tiny_particle_cutoff + Coords_HS.EPSILON;  // would rather have all particles filled in... nicer visually
	    Params_HS.R_cutoff = this.under_half_grid_spacing;
	    this.create_particles_on_grid_w_random_R();
	    this.set_particle_rho_mass();
	    for (let i = 0; i < Params_HS.N; i++) {
		let speed = this.mc.mbde.get_BD_v(Params_HS.kT0, this.particles[i].m);
		this.particles[i].vx = this.mc.get_rand_sign() * speed;
		this.particles[i].vy = 0.0;
	    }
	    break;

	case 3:  // equilibrium

	    Params_HS.R_cutoff = Math.min(ideal_R_max, 0.75);  // this setup not ideal yet... ideal_R_max may be > 1, which obviously won't fit
	    this.create_particles_w_random_R_x_y();
	    this.set_particle_rho_mass();
	    for (let i = 0; i < Params_HS.N; i++) {
		this.set_particle_velocity_eql(this.particles[i], Params_HS.kT0, this.particles[i].m);
	    }
	    break;

	case 4:  // confinement

	    this.set_up_grid_structures(36, true, false);
	    this.create_particles_confinement_IC();
	    break;

	default:
	    console.log("ERROR:   invalid code value in initialize_particle_basics()");
	    break;
	}
    }

    initialize_collision_structures() {

	this.RW_cet_entries = new OrderedSet([], CollisionEvent.compare_CEs);  // tracks all PW/WC collisions Right Wall (RW) might have
	Coords_HS.WC_just_occurred = false;

	// initial insertion into CollisionEventsTable of possible Wall-Container (WC) collision
	// this is the Right Wall (RW) of the container which acts as a piston and will hit "stops" at its min/max extent
	if (CollisionEvent_WC.piston_is_moving(this.v_RW)) {
	    let ce = new CollisionEvent_WC(this.x_RW, this.v_RW, Coords_HS.s);  // Coords_HS.s == 0.0 at this point
	    this.cet.table.insert(ce);  // Coords_HS.s == 0.0 at this point
	    this.RW_cet_entries.insert(copy(ce));
	}
	
	// initial insertion into CollisionEventsTable of potential future Particle-Wall (PW) collisions
	for (let i = 0; i < Params_HS.N; i++) {
	    let ce_array = CollisionEvent_PW.get_wall_collision_event_array(this.particles[i], i, this.x_RW, this.v_RW, Coords_HS.s);  // Coords_HS.s == 0.0 at this point
	    for (let ce of ce_array) {
		if (ce != null) {
		    this.cet.table.insert(ce);
		    this.particles[i].cet_entries.insert(copy(ce));
		    if (ce.wi == Params_HS.R_W) {  // if this future PW collision is with the Right Wall (RW), keep track of it
			this.RW_cet_entries.insert(copy(ce));
		    }
		}
	    }
	}

	// initial insertion into CollisionEventsTable of potential future Particle-Particle (PP) collisions
	for (let i = 1; i < Params_HS.N; i++) {  // check each pair... NOTE starting index of i == 1
	    for (let j = 0; j < i; j++) {        //                    NOTE ending index of j == i - 1
		if (CollisionEvent_PP.will_collide(this.particles[i], this.particles[j])) {
		    this.add_collision_event_PP(j, i, Coords_HS.s);  // by convention, we have pai < pbi, so we use j,i rather than i,j
		}
	    }
	}
    }

    copy_particles_collision_structures_etc() {

	// copy each particle (particle cet_entries are copied within)
	this.particles = [];
	for (let i = 0; i < Params_HS.N; i++) {
	    this.particles.push(GasParticle_HS.copy(this.c_prev.particles[i]));
	}

	// copy the main collision event data structure
	this.cet = new CollisionEventsTable();
	for (const cei = this.c_prev.cet.table.begin(); !cei.equals(this.c_prev.cet.table.end()); cei.next()) {
	    this.cet.table.insert(copy(cei.pointer));
	}

	// copy structure that tracks all Right Wall (RW) PW/WC collisions
	this.RW_cet_entries = new OrderedSet([], CollisionEvent.compare_CEs);
	for (const cei = this.c_prev.RW_cet_entries.begin(); !cei.equals(this.c_prev.RW_cet_entries.end()); cei.next()) {
	    this.RW_cet_entries.insert(copy(cei.pointer));
	}
    }

    // PLANNED REFACTORING: tentative plan is to wrap cet_entries, RW_cet_entries in a group of related classes in either collision.js or a separate source file
    // update all relevant data structures in the "processing" of a Particle-Particle (PP) collision
    // system has been time-evolved to the exact moment of the collision when this method is called...
    update_collision_structures_PP(curr_s) {  // curr_s is current absolute time which is required argument for methods that add collision events

	// for convenience
	let pai = this.cet.table.front().pai;
	let pbi = this.cet.table.front().pbi;
	let pa = this.particles[this.cet.table.front().pai];
	let pb = this.particles[this.cet.table.front().pbi];

	CollisionEvent_PP.process_collision(pa, pb);  // update velocities via hard sphere impact equations

	// update v histogram for pa, then pb
	CU.decr_entry_OM(this.psh.hist, pa.v_hist_bi);  // decrement bin count of pa old speed value
	pa.v_hist_bi = this.psh.get_bin_indx(pa.get_speed());  // store bin index corresponding to pa new speed value
	CU.incr_entry_OM(this.psh.hist, pa.v_hist_bi);  // increment bin count of pa new speed value
	CU.decr_entry_OM(this.psh.hist, pb.v_hist_bi);  // decrement bin count of pb old speed value
	pb.v_hist_bi = this.psh.get_bin_indx(pb.get_speed());  // store bin index corresponding to pb new speed value
	CU.incr_entry_OM(this.psh.hist, pb.v_hist_bi);  // increment bin count of pb new speed value
	
	// update E histogram for pa, then pb
	CU.decr_entry_OM(this.peh.hist, pa.E_hist_bi);  // decrement bin count of pa old speed value
	pa.E_hist_bi = this.peh.get_bin_indx(pa.get_KE());  // store bin index corresponding to pa new speed value
	CU.incr_entry_OM(this.peh.hist, pa.E_hist_bi);  // increment bin count of pa new speed value
	CU.decr_entry_OM(this.peh.hist, pb.E_hist_bi);  // decrement bin count of pb old speed value
	pb.E_hist_bi = this.peh.get_bin_indx(pb.get_KE());  // store bin index corresponding to pb new speed value
	CU.incr_entry_OM(this.peh.hist, pb.E_hist_bi);  // increment bin count of pb new speed value
	
	// iterate over pa's cet_entries performing necessary deletions
	for (let cei = pa.cet_entries.begin(); !cei.equals(pa.cet_entries.end()); cei.next()) {
	    this.cet.table.eraseElementByKey(cei.pointer);  // erase entry in main table (will take care of one at this.cet.table.front() )
	    if (cei.pointer.is_PP()) {  // if it's a PP collision...
		let PP_other_i = (cei.pointer.pai == pai) ? cei.pointer.pbi : cei.pointer.pai;
		this.particles[PP_other_i].cet_entries.eraseElementByKey(cei.pointer);  // we must also erase the entry in the partner particle's cet_entries
	    } else {  // is PW
		if (cei.pointer.wi == Params_HS.R_W) {  // if this is a future PW collision with the Right Wall (RW)...
		    this.RW_cet_entries.eraseElementByKey(cei.pointer);  // we must also erase entry in RW_cet_entries
		}
	    }
	}
	pa.cet_entries.clear();  // clear this particle's cet_entries

	// iterate over pb's cet_entries performing necessary deletions
	for (let cei = pb.cet_entries.begin(); !cei.equals(pb.cet_entries.end()); cei.next()) {  // NOTE: entry for PP_ab ALREADY REMOVED from pb.cet_entries above
	    this.cet.table.eraseElementByKey(cei.pointer);  // erase entry in main table
	    if (cei.pointer.is_PP()) {  // if it's a PP collision...
		let PP_other_i = (cei.pointer.pbi == pbi) ? cei.pointer.pai : cei.pointer.pbi;
		this.particles[PP_other_i].cet_entries.eraseElementByKey(cei.pointer);  // we must also erase the entry in the partner particle's cet_entries
	    } else {  // is PW
		if (cei.pointer.wi == Params_HS.R_W) {  // if this is a future PW collision with the Right Wall (RW)...
		    this.RW_cet_entries.eraseElementByKey(cei.pointer);  // we must also erase entry in RW_cet_entries
		}
	    }
	}
	pb.cet_entries.clear();  // clear this particle's cet_entries

	// check for new PP collisions for both pa and pb
	for (let j = 0; j < Params_HS.N; j++) {
	    if ((j == pai) || (j == pbi)) continue;  // ... other than a and b...
	    if (CollisionEvent_PP.will_collide(this.particles[j], this.particles[pai])) {
		this.add_collision_event_PP(j, pai, curr_s);  // add entry
	    }
	    if (CollisionEvent_PP.will_collide(this.particles[j], this.particles[pbi])) {
		this.add_collision_event_PP(j, pbi, curr_s);  // add entry
	    }
	}

	// check for new PW collisions involving pa
	let ce_array = CollisionEvent_PW.get_wall_collision_event_array(this.particles[pai], pai, this.x_RW, this.v_RW, curr_s);
	for (let ce of ce_array) {
	    if (ce != null) {
		this.cet.table.insert(ce);
		this.particles[pai].cet_entries.insert(copy(ce));
		if (ce.wi == Params_HS.R_W) {  // if this future PW collision is with the Right Wall (RW), keep track of it
		    this.RW_cet_entries.insert(copy(ce));
		}
	    }
	}

	// check for new PW collisions involving pb
	ce_array = CollisionEvent_PW.get_wall_collision_event_array(this.particles[pbi], pbi, this.x_RW, this.v_RW, curr_s);
	for (let ce of ce_array) {
	    if (ce != null) {
		this.cet.table.insert(ce);
		this.particles[pbi].cet_entries.insert(copy(ce));
		if (ce.wi == Params_HS.R_W) {  // if this future PW collision is with the Right Wall (RW), keep track of it
		    this.RW_cet_entries.insert(copy(ce));
		}
	    }
	}
    }

    // PLANNED REFACTORING: tentative plan is to wrap cet_entries, RW_cet_entries in a group of related classes in either collision.js or a separate source file
    // update all relevant data structures in the "processing" of a Particle-Wall (PW) collision
    // system has been time-evolved to the exact moment of the collision when this method is called...
    update_collision_structures_PW(curr_s, cps, ds) {  // curr_s is current absolute time which is required argument for methods that add collision events

	// for convenience
	let pi = this.cet.table.front().pi;
	let wi = this.cet.table.front().wi;
	let prt = this.particles[this.cet.table.front().pi];  // prt = particle

	CollisionEvent_PW.process_collision(prt, wi, this.v_RW, cps, ds, this.get_Lx());  // update velocity of particle, etc.

	// if collision is with a moving right wall (RW) --- the only case that might change particle's speed/KE --- update histograms
	if ((wi == Params_HS.R_W) && (this.v_RW != 0.0)) {

	    CU.decr_entry_OM(this.psh.hist, prt.v_hist_bi);  // decrement bin count of old speed value
	    prt.v_hist_bi = this.psh.get_bin_indx(prt.get_speed());  // store bin index corresponding to new speed value
	    CU.incr_entry_OM(this.psh.hist, prt.v_hist_bi);  // increment bin count of new speed value

	    CU.decr_entry_OM(this.peh.hist, prt.E_hist_bi);  // decrement bin count of old energy value
	    prt.E_hist_bi = this.peh.get_bin_indx(prt.get_KE());  // store bin index corresponding to new energy value
	    CU.incr_entry_OM(this.peh.hist, prt.E_hist_bi);  // increment bin count of new energy value
	}

	// iterate over prt's cet_entries performing necessary deletions
	for (let cei = prt.cet_entries.begin(); !cei.equals(prt.cet_entries.end()); cei.next()) {
	    this.cet.table.eraseElementByKey(cei.pointer);  // erase entry in main table (will take care of one at this.cet.table.front() )
	    if (cei.pointer.is_PP()) {  // if it's a PP collision...
		let PP_other_i = (cei.pointer.pai == pi) ? cei.pointer.pbi : cei.pointer.pai;
		this.particles[PP_other_i].cet_entries.eraseElementByKey(cei.pointer);  // we must also erase the entry in the partner particle's cet_entries
	    } else {  // is PW
		if (cei.pointer.wi == Params_HS.R_W) {  // if this is a future PW collision with the Right Wall (RW)...
		    this.RW_cet_entries.eraseElementByKey(cei.pointer);  // we must also erase entry in RW_cet_entries
		}
	    }
	}
	prt.cet_entries.clear();  // clear this particle's cet_entries
	
	// check for new PP collisions with particle pi
	for (let j = 0; j < Params_HS.N; j++) {
	    if (j == pi) continue;  // ... other than the one just emerging from wall collision...
	    if (CollisionEvent_PP.will_collide(this.particles[j], this.particles[pi])) {
		this.add_collision_event_PP(j, pi, curr_s);  // add entry
	    }
	}

	// check for new PW collisions involving particle pi
	let ce_array = CollisionEvent_PW.get_wall_collision_event_array(this.particles[pi], pi, this.x_RW, this.v_RW, curr_s);
	for (let ce of ce_array) {
	    if (ce != null) {
		this.cet.table.insert(ce);
		this.particles[pi].cet_entries.insert(copy(ce));
		if (ce.wi == Params_HS.R_W) {  // if this future PW collision is with the Right Wall (RW), keep track of it
		    this.RW_cet_entries.insert(copy(ce));
		}
	    }
	}
    }

    // PLANNED REFACTORING: tentative plan is to wrap cet_entries, RW_cet_entries in a group of related classes in either collision.js or a separate source file
    delete_and_reenter_RW_entries(curr_s) {  // curr_s is current absolute time which is required argument for methods that add collision events

	// iterate over Right Wall's cet_entries performing necessary deletions
	for (let cei = this.RW_cet_entries.begin(); !cei.equals(this.RW_cet_entries.end()); cei.next()) {
	    this.cet.table.eraseElementByKey(cei.pointer);  // erase entry in main table (will take care of WC at this.cet.table.front() )
	    if (cei.pointer.is_PW()) {  // if it's a PW collision (all but 1 are)...
		this.particles[cei.pointer.pi].cet_entries.eraseElementByKey(cei.pointer);  // we must also erase the entry in the involved particle's cet_entries
	    }
	}
	this.RW_cet_entries.clear();

	// check for future piston-container collision
	if (CollisionEvent_WC.piston_is_moving(this.v_RW)) {
	    let ce = new CollisionEvent_WC(this.x_RW, this.v_RW, curr_s);
	    this.cet.table.insert(ce);
	    this.RW_cet_entries.insert(copy(ce));
	}

	// check for new PW collisions involving Right Wall
	for (let i = 0; i < Params_HS.N; i++) {
	    let ce_array = CollisionEvent_PW.get_wall_collision_event_array(this.particles[i], i, this.x_RW, this.v_RW, curr_s);
	    let ce = ce_array[Params_HS.R_W];  // bit wasteful to have built array for all walls, but no time to refactor now...
	    if (ce != null) {
		this.cet.table.insert(ce);
		this.particles[ce.pi].cet_entries.insert(copy(ce));
		this.RW_cet_entries.insert(copy(ce));
	    }
	}
    }
    
    // PLANNED REFACTORING: tentative plan is to wrap cet_entries, RW_cet_entries in a group of related classes in either collision.js or a separate source file
    // update all relevant data structures in the "processing" of a Wall-Container (WC) collision
    // system has been time-evolved to the exact moment of the collision when this method is called...
    update_collision_structures_WC(curr_s) {  // curr_s is current absolute time which is required argument for methods that add collision events

	// process the collision
	this.x_RW = (this.v_RW > 0.0) ? Params_HS.x_RW_max : Params_HS.x_RW_min;  // fix piston position; NOTE: v_pist positive (negative) is compression (expansion)
	this.v_RW = 0.0;  // and stop the motion of the piston

	this.delete_and_reenter_RW_entries(curr_s);  // update collision event data structures
	Coords_HS.WC_just_occurred = true;  // indicate that a Wall-Container (WC) collision just occurred -- checked in Coords_HS constructor
	this.mc.rs.params_changed = true;  // indicate to Simulator that new ParamSeg needs to be started with v_pist == 0
	// NOTE: no need to check for new WC since we know the piston is stopped after collision processing above
    }

    update_collision_structures(curr_s, cps, ds) {

	if (this.cet.table.front().is_PP()) {  // if top entry is a PP collision...
	    this.update_collision_structures_PP(curr_s);
	} else if (this.cet.table.front().is_PW()) {  // else, if top entry is PW collision...
	    this.update_collision_structures_PW(curr_s, cps, ds);
	} else {  // else, top entry is WC collision...
	    this.update_collision_structures_WC(curr_s);
	}
    }

    check_integrity_and_output(output_individual_entries) {

	check_basic_machinery_integrity_and_output();
	check_cet_table_and_entries_integrity_and_output(output_individual_entries);
    }

    check_basic_machinery_integrity_and_output() {

	console.log("INFO:   checking basic machinery integrity...");
	if ( ! ((1.0 >= Params_HS.x_RW_max) && (Params_HS.x_RW_max >= this.x_RW) && (this.x_RW >= Params_HS.x_RW_min) && (Params_HS.x_RW_min >= 0.0)) ) {
	    alert("ERROR 119962: x_RW and/or limits out of range!...");
	    console.log("1.0", Params_HS.x_RW_max, this.x_RW, Params_HS.x_RW_min, "0.0");  // was getting minor bugs tripping this ERROR, so currently trying to figure it out...
	}
    }

    // PLANNED REFACTORING: tentative plan is to wrap cet_entries, RW_cet_entries in a group of related classes in either collision.js or a separate source file
    check_cet_table_and_entries_integrity_and_output(output_individual_entries) {

	let PP_entries_main = 0;
	let PP_entries_aux = 0;
	let PW_entries_main = 0;
	let PW_entries_aux = 0;
	let PRW_entries_main = 0;  // PRW = Particle Right Wall, i.e., PW with wall being the Right one
	let PRW_entries_aux_particles = 0;
	let PRW_entries_aux_RW = 0;
	let WC_entries_main = 0;
	let WC_entries_aux = 0;
	let total_entries_main = 0;
	let total_entries_aux_particles = 0;
	let total_entries_aux_RW = 0;

	if (output_individual_entries) console.log("+------------------+");

	for (const cei = this.cet.table.begin(); !cei.equals(this.cet.table.end()); cei.next()) {
	    if (cei.pointer.is_PP()) {  // is PP
		if (output_individual_entries) console.log("**", cei.pointer.pai, cei.pointer.pbi, cei.pointer.s);
		PP_entries_main += 1;
	    } else if (cei.pointer.is_PW()) {  // else, if is PW
		if (output_individual_entries) console.log("*|", cei.pointer.pi, Params_HS.get_wi_char(cei.pointer.wi), cei.pointer.s);
		PW_entries_main += 1;
		if (cei.pointer.wi == Params_HS.R_W) PRW_entries_main += 1;
	    } else {  // else, is WC
		if (output_individual_entries) console.log("[]", Params_HS.get_wi_char(Params_HS.R_W), "C", cei.pointer.s);
		WC_entries_main += 1;
	    }
	    total_entries_main += 1;
	}

	if (output_individual_entries) console.log("--------------------");

    	for (let i = 0; i < Params_HS.N; i++) {
	    let to_check = this.particles[i].cet_entries;
	    for (const cei = to_check.begin(); !cei.equals(to_check.end()); cei.next()) {
		if (cei.pointer.is_PP()) {  // is PP
		    if (output_individual_entries) console.log("**", i, cei.pointer.pai, cei.pointer.pbi, cei.pointer.s);
		    PP_entries_aux += 1;
		} else {  // else, is PW
		    if (output_individual_entries) console.log("*|", i, cei.pointer.pi, Params_HS.get_wi_char(cei.pointer.wi), cei.pointer.s);
		    PW_entries_aux += 1;
		    if (cei.pointer.wi == Params_HS.R_W) PRW_entries_aux_particles += 1;
		}
	    }
	    total_entries_aux_particles += to_check.length;
	}

	if (output_individual_entries) console.log("--------------------");

	for (let cei = this.RW_cet_entries.begin(); !cei.equals(this.RW_cet_entries.end()); cei.next()) {
	    if (cei.pointer.is_PW()) {  // is PW
		if (output_individual_entries) console.log("*|", cei.pointer.pi, Params_HS.get_wi_char(cei.pointer.wi), cei.pointer.s);
		PRW_entries_aux_RW += 1;
	    } else {  // else, is WC
		if (output_individual_entries) console.log("[]", Params_HS.get_wi_char(Params_HS.R_W), "C", cei.pointer.s);
		WC_entries_aux += 1;
	    }
	    total_entries_aux_RW += 1;
	}

	if (output_individual_entries) console.log("--------------------");

	console.log("PP_entries_main =", PP_entries_main);
	console.log("PP_entries_aux =", PP_entries_aux);
	console.log("PW_entries_main =", PW_entries_main);
	console.log("PW_entries_aux =", PW_entries_aux);
	console.log("PRW_entries_main =", PRW_entries_main);
	console.log("PRW_entries_aux_particles =", PRW_entries_aux_particles);
	console.log("PRW_entries_aux_RW =", PRW_entries_aux_RW);
	console.log("WC_entries_main =", WC_entries_main);
	console.log("WC_entries_aux =", WC_entries_aux);
	console.log("total_entries_main =", total_entries_main, this.cet.table.size());
	console.log("total_entries_aux_particles =", total_entries_aux_particles);
	console.log("total_entries_aux_RW =", total_entries_aux_RW, this.RW_cet_entries.size());
	console.log("FYI: x_RW, v_RW =", this.x_RW, this.v_RW);
	if (output_individual_entries) console.log("+------------------+");

	if (PP_entries_aux/2 != PP_entries_main) {
	    alert("ERROR 391161: PP_entries_aux/2 != PP_entries_main");
	}
	if (PW_entries_aux != PW_entries_main) {
	    alert("ERROR 391162: PW_entries_aux != PW_entries_main");
	}
	if ( ! ((PRW_entries_main == PRW_entries_aux_particles) && (PRW_entries_main == PRW_entries_aux_RW))) {
	    alert("ERROR 391163: PRW_entries_main,aux_particles,aux_RW not all equal");
	}
	if (WC_entries_main > 1) {
	    alert("ERROR 391168: WC_entries_main > 1");
	}
	if (WC_entries_aux != WC_entries_main) {
	    alert("ERROR 391169: WC_entries_aux != WC_entries_main");
	}
    }

    time_evolve(s) {

	// update position of each particle
    	for (let i = 0; i < Params_HS.N; i++) {
	    this.particles[i].x += this.particles[i].vx * s;
	    this.particles[i].y += this.particles[i].vy * s;
	}

	// update position of Right Wall (RW)
	this.x_RW += this.v_RW * s;
    }

    update_state(ds) {

	let curr_s = Coords_HS.s;
	let new_s = Coords_HS.s + ds;

	while ((this.cet.table.size() > 0) && (this.cet.table.front().s < new_s)) {

	    let partial_ds = this.cet.table.front().s - curr_s;
	    this.time_evolve(partial_ds);
	    curr_s += partial_ds;
	    this.update_collision_structures(curr_s, this.cps, ds);
	}

	this.time_evolve(new_s - curr_s);
	this.cps.update_for_time_step(this.get_area(), Params_HS.N, this.get_kT());

	//console.log("this.cet.table.size() =", this.cet.table.size())
	//this.cet.output_info();
	//console.log("this.v,x_RW,s =", this.v_RW, this.x_RW, Coords_HS.s);/////////

	// update (continuous time) clock; (don't confuse with SSNS discrete time step t)
	Coords_HS.s = new_s;
    }

    output() {

	console.log("Coords_HS.s =", Coords_HS.s);
	console.log("this.x_RW =", this.x_RW);
	for (let i = 0; i < Params_HS.N; i++) {
	    let cp = this.particles[i];  // cp = current particle; for convenience
	    console.log("i = ", i, "x = ", cp.x, "y = ", cp.y, "vx = ", cp.vx, "vy = ", cp.vy);
	}
    }
}

class Trajectory_HS extends Trajectory {

    constructor(sim) {

	Coords_HS.s = 0.0;  // zero the official "clock" for our continuous time gas system; (don't confuse with SSNS discrete time step t)
	Params_HS.N = Params_HS.UINI_N.v;
	Params_HS.kT0 = Params_HS.UINI_kT0.v;
	Params_HS.num_particles_per_rho_val = parseInt(Math.ceil(Params_HS.N / Params_HS.num_rho_vals));

	super(sim);
    }

    gmc() {  // gmc = get ModelCalc object
	return new ModelCalc_HS(this.sim.ui, this.sim.rs);  // args are references to UserInterface and RunState objects needed within...
    }

    gp() {  // gp = get Params object
	return new Params_HS(Params_HS.UINI_v_pist.v);
    }

    gc_ic(mc) {  // gc_ic = get Coords, initial condition
	return new Coords_HS(mc, [ Params_HS.N, Params_HS.UINI_v_pist.v ]);
    }

    gc_nv(mc, p, c_prev) {  // gc_nv = get Coords, new value
	return new Coords_HS(mc, p, c_prev, [ Params_HS.N ]);
    }

    get_max_num_t_steps() {
	return Trajectory.DEFAULT_MAX_NUM_T_STEPS;
    }
}
