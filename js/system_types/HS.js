
///////////////////////////////////////////////////////////////////////////////////////////////
////////  HS = Hard Sphere Gas (from SM = Statistical Mechanics)  /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////




class GasParticle_HS extends GasParticle {

    constructor(x, y, R, mass, vx, vy, rho_val_i, rho) {

	super(x, y, R, mass, vx, vy);

	this.rho_val_i = rho_val_i;  // integer index associated with density value (will, e.g., be translated into greyscale color)
	this.rho = rho;  // particle density, which will be plotted as greyscale color
	//this.rho_greyscale_str = rho_str;  // corresponding greyscale color string for quick plotting
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
	//ngp.rho_greyscale_str = gptc.rho_greyscale_str;
	ngp.v_hist_bi = gptc.v_hist_bi;
	ngp.E_hist_bi = gptc.E_hist_bi;
	return ngp;
    }
}

class CollisionEvent {

    static compare_CEs(x, y) {

	// primary sort is by event time; applies to all types of collisions (PP, PW and WC)
	if (x.s !== y.s) {
	    return (x.s - y.s);
	}

	// if times are equal...;  start by putting WC collisions out in front
	// NOTE: there can only be one WC collision in the table at any given time, but WE NEED TO HANDLE COMPARISON OF EQUAL KEYS, e.g., for ...find()
	let x_is_WC = (!x.is_PP() && !x.is_PW());
	let y_is_WC = (!y.is_PP() && !y.is_PW());
	if (x_is_WC && y_is_WC) return 0;
	if (x_is_WC && ! y_is_WC) return -1;
	if ( ! x_is_WC && y_is_WC) return 1;

	// if times are equal and we have only PP and/or PW collision, compare "primary" particle indices (pai for PP's and pi for PW's)
	let x_pi = x.is_PP() ? x.pai : x.pi;
	let y_pi = y.is_PP() ? y.pai : y.pi;
	if (x_pi !== y_pi) {
	    return (x_pi - y_pi);
	}

	// if we still haven't "broken the tie"...
	if (x.is_PP() && y.is_PP()) {
	    return (x.pbi - y.pbi);  // for PP-PP, compare pbi's
	} else if (!x.is_PP() && !y.is_PP()) {
	    return (x.wi - y.wi);  // for PW-PW, compare wi's
	} else {
	    return (x.is_PP() ? 1 : -1);  // otherwise, it's mixed PP-PW or PW-PP and we sort PW first
	}	    
    }

    constructor(s) {

	if (!this.is_PP) throw new Error("Derived CollisionEvent must define is_PP()");
	this.s = s;
    }
}

// PP = Particle-Particle, i.e., a CollisionEvent between two particles (no wall involved)
class CollisionEvent_PP extends CollisionEvent {

    static get_Ds_closest_approach(pa, pb) {

	let Dx = pb.x - pa.x;
	let Dy = pb.y - pa.y;
	let Dvx = pb.vx - pa.vx;
	let Dvy = pb.vy - pa.vy;
	return -1.0 * ( Dx*Dvx + Dy*Dvy ) / (Dvx*Dvx + Dvy*Dvy);
    }

    static get_dist_at_Ds(pa, pb, Ds) {

	let xa = pa.x + Ds*pa.vx;
	let xb = pb.x + Ds*pb.vx;
	let Dx = xb - xa;
	let ya = pa.y + Ds*pa.vy;
	let yb = pb.y + Ds*pb.vy;
	let Dy = yb - ya;
	return Math.sqrt( Dx*Dx + Dy*Dy );
    }

    static will_collide(pa, pb) {

	let Ds = CollisionEvent_PP.get_Ds_closest_approach(pa, pb);
	if (Ds > 0.0) {
	    return ( CollisionEvent_PP.get_dist_at_Ds(pa, pb, Ds) < (pa.R + pb.R) );
	} else {
	    return false;
	}
    }

    static get_Ds_collision(pa, pb) {

	let Dx = pb.x - pa.x;
	let Dy = pb.y - pa.y;
	let Dvx = pb.vx - pa.vx;
	let Dvy = pb.vy - pa.vy;
	let sum_radii = pb.R + pa.R;
	let A = Dvx*Dvx + Dvy*Dvy;  // NOTE: A >= 0
	let B = 2.0 * ( Dx*Dvx + Dy*Dvy );
	let C = Dx*Dx + Dy*Dy - sum_radii*sum_radii;
	// NOTE: below, expression in sqrt must be positive for real solution, so entire second term T > 0 and we take negative sign for smaller root for first "impact"
	return ( -1.0*B - Math.sqrt( B*B - 4.0*A*C ) ) / (2.0*A);
    }

    static process_collision(pa, pb) {

	let Dx = pb.x - pa.x;
	let Dy = pb.y - pa.y;
	let Dvx = pb.vx - pa.vx;
	let Dvy = pb.vy - pa.vy;
	let fctr = (2.0 / (pa.m + pb.m)) * ( Dx*Dvx + Dy*Dvy ) / (Dx*Dx + Dy*Dy);

	pa.vx += pb.m * fctr * Dx;
	pa.vy += pb.m * fctr * Dy;
	pb.vx -= pa.m * fctr * Dx;
	pb.vy -= pa.m * fctr * Dy;
    }

    // get a string that will be used as a key in the CollisionEventsTable
    static get_cet_key_str(pai, pbi) {  // pai = particle a index (in the particles array)
	return ("a" + pai.toString() + "b" + pbi.toString());  //e.g., "a11b25" indicates a future collision between particles 11 and 25; we always have a < b
    }

    //  using s for time rather than t so as not to confuse with SSNS discrete time step t
    constructor(pai, pbi, s) {  // pai = particle a index (in the particles array)

	super(s);

	this.pai = (pai < pbi) ? pai : pbi;  // to maintain convention that pai < pbi
	this.pbi = (pai < pbi) ? pbi : pai;  // to maintain convention that pai < pbi
    }

    is_PP() {
	return true;
    }
}

// PW = Particle-Wall, i.e., a CollisionEvent between a particle and a wall
class CollisionEvent_Wall extends CollisionEvent {

    constructor(s) {

	super(s);

	if (!this.is_PW) throw new Error("Derived CollisionEvent must define is_PW()");
    }

    is_PP() {
	return false;  // collisions involving a Wall are definitely not Particle-Particle (PP)
    }
}

class CollisionEvent_PW extends CollisionEvent_Wall {

    // x,v_RW are position,velocity of Right Wall; s_to_add will be added to Ds_coll to give absolute time s_coll for collision event
    static get_wall_collision_event_array(p, pi, x_RW, v_RW, s_to_add) {

	let ce_array = [ null, null, null, null ];  // array of 4 values to be returned, when each will be either null or a CollisionEvent_PW 

	// check for Top Wall collision
	if (p.vy > 0.0) {  // particle moving upward...

	    let ds_intersect = (Params_HS.Ly - p.y - p.R) / p.vy;  // ...might collide with Top Wall, so locate intersection with y = Ly...
	    let x_intersect = p.x + p.vx*ds_intersect;
	    if ((x_intersect >= 0.0) && (x_intersect <= Params_HS.Lx_max)) {  // POSSIBLY CHANGE HERE TO Params_HS.Lx???
		ce_array[Params_HS.T_W] = new CollisionEvent_PW(pi, Params_HS.T_W, s_to_add + ds_intersect);
	    }
	}

	// check for Bottom Wall collision
	if (p.vy < 0.0) {  // particle moving downward...

	    let ds_intersect = -1.0 * (p.y - p.R) / p.vy;  // ...might collide with Bottom Wall, so locate intersection with y = 0...
	    let x_intersect = p.x + p.vx*ds_intersect;
	    if ((x_intersect >= 0.0) && (x_intersect <= Params_HS.Lx_max)) {  // POSSIBLY CHANGE HERE TO Params_HS.Lx???
		ce_array[Params_HS.B_W] = new CollisionEvent_PW(pi, Params_HS.B_W, s_to_add + ds_intersect);
	    }
	}

	// check for Left (stationary vertical) Wall collision
	if (p.vx < 0.0) {  // particle moving leftward...

	    let ds_intersect = -1.0 * (p.x - p.R) / p.vx;  // ...might collide with Left Wall, so locate intersection with x = 0...
	    let y_intersect = p.y + p.vy*ds_intersect;
	    if ((y_intersect >= 0.0) && (y_intersect <= Params_HS.Ly)) {
		ce_array[Params_HS.L_W] = new CollisionEvent_PW(pi, Params_HS.L_W, s_to_add + ds_intersect);
	    }
	}

	// check for Right (movable vertical) Wall collision
	let rel_vx = -1.0*v_RW - p.vx;  // relative velocity of particle and Right Wall; we flip sign of v_RW since positive for its velocity is inward

	if (rel_vx < 0.0) {  // if particle and Right Wall are approaching...

	    let rel_x = Params_HS.Lx_max - x_RW - p.x - p.R;  // get distance between them; we subtract because positive coordinate directions are aligned for the two
	    let ds_intersect = -1.0 * rel_x / rel_vx;  // locate intersection of particle path with future Right Wall location
	    let y_intersect = p.y + p.vy*ds_intersect;
	    let x_intersect = p.x + p.vx*ds_intersect;
	    ///////////console.log("rel_vx, rel_x, ds_intersect, y_intersect, x_intersect =", rel_vx, rel_x, ds_intersect, y_intersect, x_intersect);///////////
	    if ((y_intersect >= 0.0) && (y_intersect <= Params_HS.Ly) && (x_intersect >= 0.0)) {
		ce_array[Params_HS.R_W] = new CollisionEvent_PW(pi, Params_HS.R_W, s_to_add + ds_intersect);
	    }
	}

	return ce_array;
    }

    static process_collision(p, wi, v_RW) {  // v_RW is velocity of Right Wall

	switch(wi) {

	case Params_HS.T_W:
	    p.vy *= -1.0;
	    break;

	case Params_HS.L_W:
	    p.vx *= -1.0;
	    break;

	case Params_HS.B_W:
	    p.vy *= -1.0;
	    break;

	case Params_HS.R_W:
	    p.vx = -1.0*p.vx - 2.0*v_RW;  // easily derived by taking 1D elastic collision equations with M >> m; NOTE: sign of v_RW is flipped!!
	    break;
	}
    }

    //  using s for time rather than t so as not to confuse with SSNS discrete time step t
    constructor(pi, wi, s) {  // pi = particle index (in the particles array); wi = wall index

	super(s);

	this.pi = pi;
	this.wi = wi;
    }

    is_PW() {
	return true;  // PW = Particle-Wall
    }
}

// this handles the event of the Right Wall (RW), which is the only movable one, colliding/stopping at max/min compression
class CollisionEvent_WC extends CollisionEvent_Wall {

    static piston_is_moving(v_RW) {

	return (v_RW != 0.0);
    }

    //  using s for time rather than t so as not to confuse with SSNS discrete time step t
    constructor(x_RW, v_RW, s_to_add) {

	let ds_coll;
	if (v_RW > 0.0) {  // NOTE: v_RW positive is compression
	    ds_coll = (Params_HS.x_RW_max - x_RW) / v_RW;
	} else {  // v_RW < 0.0; NOTE: v_RW negative is expansion --- negative sign makes expression below positive
	    ds_coll = -1.0 * x_RW / v_RW;
	}
	let s_coll = s_to_add + ds_coll;

	super(s_coll);
    }

    is_PW() {
	return false;  // this Wall-Container (WC) CollisionEvent is definitely not of the Particle-Wall (PW) type
    }
}

class CollisionEventsTable {

    constructor() {

	this.table = new OrderedSet([], CollisionEvent.compare_CEs);
    }

    output_info() {

	let total_entries = 0;
	let PP_entries = 0;
	let PW_entries = 0;
	let WC_entries = 0;
	
	for (const cei = this.table.begin(); !cei.equals(this.table.end()); cei.next()) {
	    if (cei.pointer.is_PP()) {  // is PP
		console.log("**", cei.pointer.pai, cei.pointer.pbi, cei.pointer.s);
		PP_entries += 1;
	    } else if (cei.pointer.is_PW()) {  // else, if is PW
		console.log("*|", cei.pointer.pi, Params_HS.get_wi_char(cei.pointer.wi), cei.pointer.s);
		PW_entries += 1;
	    } else {  // else, is WC
		console.log("[]", Params_HS.get_wi_char(Params_HS.R_W), "C", cei.pointer.s);
		WC_entries += 1;
	    }
	    total_entries += 1;
	}
	console.log("table size = ", this.table.size());
	console.log("PP_entries    = ", PP_entries);
	console.log("PW_entries    = ", PW_entries);
	console.log("WC_entries    = ", WC_entries);
	console.log("total_entries = ", total_entries);
    }
}


class Cumul_Stats {

    constructor() {


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

    constructor(rs) {

	super();

	this.rs = rs;  // this is reference to RunState object this.sim.rs to access params_changed in CoordsHS constructor...
    }

    static get_rand_rho_val(rho_low, rho_hi, rv_0_1) {  // rv_0_1 = random value on [0, 1)

	return rho_low + (rho_hi - rho_low)*rv_0_1;
    }

    static get_m_from_rho_and_R(rho, R) {
	return Math.PI * R * R * rho;  // we're interpreting rho as mass/area and multiplying by area of circular cross-section of sphere (or disc)
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
    static UICI_rho;  // = new UICI(this, "UI_P_SM_HS_rho", false);  assignment occurs in UserInterface(); see discussion there
    static UICI_R;  // = new UICI(this, "UI_P_SM_HS_R", false);  assignment occurs in UserInterface(); see discussion there

    static R = 0.005;//0.001;
    static single_m_val_not_dist;
    static draw_tiny_particles_artificially_large = true;
    static m = 1.0;
    static rho_low = 1.0;
    static rho_hi = 100.0;
    static rho_dist_a = 1.001;
    static rho_dist_b = 15;
    static ds = 0.01;  // eventually use algorithm to set value?
    static Lx_min = 0.05;  // assignment occurs in Trajectory_HS constructor
    static Lx_max = 1.0;  // assignment occurs in Trajectory_HS constructor
    static Ly = 1.0;  // assignment occurs in Trajectory_HS constructor
    static x_RW_max = Params_HS.Lx_max - Params_HS.Lx_min;  // NOTE: RW piston coordinate is flipped: positive (negative) is compression (expansion)
    static m_dist_code = "c";  // dummy value; c for constant? add a sensible distribution to try?
    static R_dist_code = "c";  // dummy value; c for constant? add a sensible distribution to try?
    static IC_code = "r";  // dummy value; eventually have many options here

    static get_wi_char(i) {
	let char_arr = ["T", "L", "B", "R"];
	return char_arr[i];
    }
    
    constructor(v_pist_0) {

	super();

	this.v_pist_0 = v_pist_0;

	// summarize physical parameter values
	console.log("physical parameter value summary:");
	console.log("N     :", Params_HS.N);
	console.log("kT    :", Params_HS.kT0);
	console.log("Ly    :", Params_HS.Ly);
	console.log("Lx_min:", Params_HS.Lx_min);
	console.log("Lx_max:", Params_HS.Lx_max);
	console.log("x_RW_max:", Params_HS.x_RW_max);
	console.log("ds    :", Params_HS.ds);
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

    constructor(...args) {  // see discussion of # args at definition of abstract Coords()

	super(...args);

	if (this.constructing_init_cond) {

	    this.x_RW = 0.0;  // Params_HS.x_RW_max;  // Right Wall (RW) piston is initially fully extended, so that piston area is a square
	    this.v_RW = this.extra_args[1];  // this is basically parameter v_pist_0, passed in an awkward way since Params p is not available
	    this.gsh = new GasSpeedHistogram(0.2);
	    this.peh = new GasSpeedHistogram(0.2);  // peh = particle energy histogram
	    this.cet = new CollisionEventsTable();
	    this.particles = new Array();
	    this.initialize_particles_collision_structures_etc();

	    // initialize quantities involved in time-averaging
	    this.num_t_avg_contribs = 0;
	    this.P_x_cumul = 0.0;
	    this.P_y_cumul = 0.0;

	} else {

	    this.gsh = GasSpeedHistogram.copy(this.c_prev.gsh);
	    this.peh = GasSpeedHistogram.copy(this.c_prev.peh);  // peh = particle energy histogram
	    this.copy_particles_collision_structures_etc();

	    // determine this timestep's x_RW and v_RW initial values (actual values may change during timestep's update_state() routines)
	    this.x_RW = this.c_prev.x_RW;  // initial Right Wall (RW) piston position is always taken from previous CoordsHS
	    if (this.mc.rs.params_changed) {  // value of initial Right Wall (RW) piston velocity depends on various things...

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
		    let attempting_overexpand = ((requested_v_pist_0 < 0) && (this.x_RW <= 0.0));  // can't expand beyond expansion limit
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

	    // copy over quantities involved in time-averaging
	    this.num_t_avg_contribs = this.c_prev.num_t_avg_contribs;
	    this.P_x_cumul = this.c_prev.P_x_cumul;
	    this.P_y_cumul = this.c_prev.P_y_cumul;

	    this.update_state(Params_HS.ds);
	}
	//this.check_cet_table_and_entries_integrity_and_output(true);
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

    initialize_particles_on_grid() {

	let new_p;
	let vc = {x: 0.0, y: 0.0};  // vc = velocity components (useful for passing into methods that set both)
	//let rx = this.mc.mbde.get_rand_x();  // random x position
	//let ry = this.mc.mbde.get_rand_y();  // random y position

	// determine grid_size ("size" of grid, meaning the number of particles per row or column)
	let grid_size = 1;
	while (Params_HS.N > grid_size*grid_size) {
	    grid_size += 1;
	}
	let grid_seg_length = 1.0 / (grid_size + 1);

	for (let i = 0; i < Params_HS.N; i++) {

	    let ci = grid_size - 1 - parseInt(Math.floor(i/grid_size));
	    let ri = i % grid_size;
	    let x = (ri + 1) * grid_seg_length;
	    let y = (ci + 1) * grid_seg_length;

	    // determine new particle density, mass, etc.
	    let beta_dist_val = this.mc.beta_rng(Params_HS.rho_dist_a, Params_HS.rho_dist_b);
	    let rho_val = ModelCalc_HS.get_rand_rho_val(Params_HS.rho_low, Params_HS.rho_hi, beta_dist_val);
	    //let rho_greyscale_str = PlotTypeCV_HS.get_rho_greyscale_str_from_0_1_val(beta_dist_val);
	    let rho_greyscale_str = "rgba(50, 50, 50";

	    let mass;// = ModelCalc_HS.get_m_from_rho_and_R(rho_val, Params_HS.R);
	    mass = Params_HS.m;
	    /*
	    let num_in_block = parseInt(Math.ceil(Params_HS.N / 4.0));
	    if (i < num_in_block) {
		mass = Params_HS.m;
		rho_greyscale_str = "rgba(200, 200, 200";
	    } else if (i < 2*num_in_block) {
		mass = 2*Params_HS.m;
		rho_greyscale_str = "rgba(150, 150, 150";
	    } else if (i < 3*num_in_block) {
		mass = 5*Params_HS.m;
		rho_greyscale_str = "rgba(100, 100, 100";
	    } else { // (i < 4*num_in_block) {
		mass = 10*Params_HS.m;
		rho_greyscale_str = "rgba(50, 50, 50";
	    }
	    */

	    ///////this.mc.mbde.load_vc_MBD_v_comps(vc, Params_HS.kT0, Params_HS.m);
	    /////this.mc.mbde.load_vc_MBD_v_comps(vc, Params_HS.kT0, mass);
	    //this.mc.mbde.load_vc_spec_v_rand_dir(vc, Math.sqrt(2.0));
	    this.mc.mbde.load_vc_spec_v_rand_dir(vc, this.mc.mbde.get_BD_v(Params_HS.kT0, mass));
	    let vx = vc.x;
	    let vy = vc.y;

	    let radius;
	    radius = Params_HS.R;
	    
	    // create new particle object
	    //new_p = new GasParticle_HS(x, y, Params_HS.R, mass, vx, vy, );
	    //new_p = new GasParticle_HS(x, y, Params_HS.R, mass, vx, vy, rho_val, rho_greyscale_str);
	    new_p = new GasParticle_HS(x, y, radius, mass, vx, vy, rho_val, rho_greyscale_str);
	    //new_p = new GasParticle_HS(x, y, Params_HS.R, Params_HS.m, 1, 0.1);//////////

	    // store quantity histogram bin indices and update respective histograms
	    new_p.v_hist_bi = this.gsh.get_bin_indx(new_p.get_speed());
	    CU.incr_entry_OM(this.gsh.hist, new_p.v_hist_bi);  // increment bin count
	    new_p.E_hist_bi = this.peh.get_bin_indx(new_p.get_KE());
	    CU.incr_entry_OM(this.peh.hist, new_p.E_hist_bi);  // increment bin count

	    this.particles.push(new_p);
	}
    }

    initialize_particles_collision_structures_etc() {

	this.initialize_particles_on_grid();
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
	CU.decr_entry_OM(this.gsh.hist, pa.v_hist_bi);  // decrement bin count of pa old speed value
	pa.v_hist_bi = this.gsh.get_bin_indx(pa.get_speed());  // store bin index corresponding to pa new speed value
	CU.incr_entry_OM(this.gsh.hist, pa.v_hist_bi);  // increment bin count of pa new speed value
	CU.decr_entry_OM(this.gsh.hist, pb.v_hist_bi);  // decrement bin count of pb old speed value
	pb.v_hist_bi = this.gsh.get_bin_indx(pb.get_speed());  // store bin index corresponding to pb new speed value
	CU.incr_entry_OM(this.gsh.hist, pb.v_hist_bi);  // increment bin count of pb new speed value
	
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

    // update all relevant data structures in the "processing" of a Particle-Wall (PW) collision
    // system has been time-evolved to the exact moment of the collision when this method is called...
    update_collision_structures_PW(curr_s) {  // curr_s is current absolute time which is required argument for methods that add collision events

	// for convenience
	let pi = this.cet.table.front().pi;
	let wi = this.cet.table.front().wi;
	let prt = this.particles[this.cet.table.front().pi];  // prt = particle

	CollisionEvent_PW.process_collision(prt, wi, this.v_RW);  // update velocity of particle

	// if collision is with a moving right wall (RW) --- the only case that might change particle's speed/KE --- update histograms
	if ((wi == Params_HS.R_W) && (this.v_RW != 0.0)) {

	    CU.decr_entry_OM(this.gsh.hist, prt.v_hist_bi);  // decrement bin count of old speed value
	    prt.v_hist_bi = this.gsh.get_bin_indx(prt.get_speed());  // store bin index corresponding to new speed value
	    CU.incr_entry_OM(this.gsh.hist, prt.v_hist_bi);  // increment bin count of new speed value

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
    
    // update all relevant data structures in the "processing" of a Wall-Container (WC) collision
    // system has been time-evolved to the exact moment of the collision when this method is called...
    update_collision_structures_WC(curr_s) {  // curr_s is current absolute time which is required argument for methods that add collision events

	// process the collision
	this.x_RW = (this.v_RW > 0.0) ? Params_HS.x_RW_max : 0.0;  // fix piston position; NOTE: v_pist positive (negative) is compression (expansion)
	this.v_RW = 0.0;  // and stop the motion of the piston

	this.delete_and_reenter_RW_entries(curr_s);  // update collision event data structures
	Coords_HS.WC_just_occurred = true;  // indicate that a Wall-Container (WC) collision just occurred -- checked in Coords_HS constructor
	this.mc.rs.params_changed = true;  // indicate to Simulator that new ParamSeg needs to be started with v_pist == 0
	// NOTE: no need to check for new WC since we know the piston is stopped after collision processing above
    }

    update_collision_structures(curr_s) {

	if (this.cet.table.front().is_PP()) {  // if top entry is a PP collision...
	    this.update_collision_structures_PP(curr_s);
	} else if (this.cet.table.front().is_PW()) {  // else, if top entry is PW collision...
	    this.update_collision_structures_PW(curr_s);
	} else {  // else, top entry is WC collision...
	    this.update_collision_structures_WC(curr_s);
	}
    }

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

    get_V() {
	return Params_HS.Ly * (Params_HS.Lx_max - this.x_RW);
    }

    get_total_KE() {

	let total_KE = 0.0;
    	for (let i = 0; i < Params_HS.N; i++) {
	    total_KE += this.particles[i].get_KE();
	}
	return total_KE;
    }

    get_avg_KE() {
	return this.get_total_KE() / Params_HS.N;
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

	this.num_x_collisions = 0;
	this.num_y_collisions = 0;
	this.P_x = 0.0;
	this.P_y = 0.0;

	let curr_s = Coords_HS.s;
	let new_s = Coords_HS.s + ds;

	while ((this.cet.table.size() > 0) && (this.cet.table.front().s < new_s)) {

	    let partial_ds = this.cet.table.front().s - curr_s;
	    this.time_evolve(partial_ds);
	    curr_s += partial_ds;
	    this.update_collision_structures(curr_s);
	}

	this.time_evolve(new_s - curr_s);

	// update x-direction position and quantities	    
	//this.num_x_collisions += this.gpud.num_collisions;  // ...then grab calculated values
	//this.P_x += 2.0 * this.gpud.num_collisions * this.particles[i].m * Math.abs(this.particles[i].vx) / (2 * Params_HS.Ly * ds);  // 2*Ly in denominator converts force to pressure

	let avg_KE = this.get_avg_KE();
	let VT_constant = this.get_V() * avg_KE;
	//console.log("total_KE =", total_KE);/////////
	///console.log("avg_KE =", avg_KE);/////////
	//console.log("VT_constant =", avg_KE, VT_constant);/////////
	//console.log("this.cet.table.size() =", this.cet.table.size())
	//this.cet.output_info();

	// update time-averaged quantities
	this.num_t_avg_contribs += 1;
	this.P_x_cumul += this.P_x;
	this.P_y_cumul += this.P_y;
	this.P_x_t_avg = this.P_x_cumul / this.num_t_avg_contribs;
	this.P_y_t_avg = this.P_y_cumul / this.num_t_avg_contribs;
	//this.PVoNkT_x_t_avg = this.P_x_t_avg * Params_HS.V / (Params_HS.N * Params_HS.kT0);
	//this.PVoNkT_y_t_avg = this.P_y_t_avg * Params_HS.V / (Params_HS.N * Params_HS.kT0);

	// update (continuous time) clock; (don't confuse with SSNS discrete time step t)
	Coords_HS.s = new_s;
	//console.log("this.cet.table.size() = ", this.cet.table.size());//////////
	//console.log("this.v,x_RW,s =", this.v_RW, this.x_RW, Coords_HS.s);/////////
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
	Params_HS.single_m_val_not_dist = false;

	super(sim);
    }

    gmc() {  // gmc = get ModelCalc object
	return new ModelCalc_HS(this.sim.rs);  // arg is reference to RunState object this.sim.rs to access params_changed in CoordsHS constructor...
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
	return Trajectory.DEFAULT_MAX_NUM_T_STEPS
    }
}
