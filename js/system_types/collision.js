
//////////////////////////////////////////////////////////////////////////////////////////////////////
////////  Collision* helper classes to help HS = Hard Sphere Gas (from SM = Statistical Mechanics)  //
//////////////////////////////////////////////////////////////////////////////////////////////////////

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

    static get_dist(pa, pb) {

	let Dx = pb.x - pa.x;
	let Dy = pb.y - pa.y;
	return Math.sqrt( Dx*Dx + Dy*Dy );
    }

    static are_overlapping(pa, pb) {

	let dist = CollisionEvent_PP.get_dist(pa, pb);
	let sum_of_radii = pa.R + pb.R;
	return (dist <= sum_of_radii);  // == may be ok on paper, but we'll never create a situation where they're touching for simplicity, so treat it as an error
    }

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

    static process_collision(p, wi, v_RW, cps, ds, Lx) {  // v_RW is velocity of Right Wall

	switch(wi) {

	case Params_HS.T_W:
	    p.vy *= -1.0;
	    cps.num_y_collisions += 1;
	    cps.P_y += 2.0 * p.m * Math.abs(p.vy) / (2 * Lx * ds);  // 2*Lx in denominator converts force to pressure
	    break;

	case Params_HS.L_W:
	    p.vx *= -1.0;
	    cps.num_x_collisions += 1;
	    cps.P_x += 2.0 * p.m * Math.abs(p.vx) / (2 * Params_HS.Ly * ds);  // 2*Ly in denominator converts force to pressure
	    break;

	case Params_HS.B_W:
	    p.vy *= -1.0;
	    cps.num_y_collisions += 1;
	    cps.P_y += 2.0 * p.m * Math.abs(p.vy) / (2 * Lx * ds);  // 2*Lx in denominator converts force to pressure
	    break;

	case Params_HS.R_W:
	    let new_vx = -1.0*p.vx - 2.0*v_RW;  // easily derived by taking 1D elastic collision equations with M >> m; NOTE: sign of v_RW is flipped!!
	    let Delta_vx = -2.0*p.vx - 2.0*v_RW;  // new value above minus old value of vx
	    p.vx = new_vx;
	    cps.num_x_collisions += 1;
	    cps.P_x += p.m * Math.abs(Delta_vx) / (2 * Params_HS.Ly * ds);  // 2*Ly in denominator converts force to pressure; NOTE: formula different from L_W version above!
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
	    ds_coll = -1.0 * (x_RW - Params_HS.x_RW_min) / v_RW;
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

// tracks number of collisions, instantaneous pressure, and cumulative quantities to track average pressure, in both x and y for all
// NOTE: we use the compressibility factor Z = p V / N k T, in terms of area fraction eta, to gauge deviation of HD fluid from ideality
class CollisionPressureStats {

    constructor(ui) {

	this.ui = ui;  // needed for aux_ctr communication, etc.
	this.reset_accumulators();
	this.prepare_for_time_step();
	this.Z_x_t_avg = 0;  // not a terribly meaningful value (since no collisions have occurred yet) but makes plotting easier
	this.Z_y_t_avg = 0;  // not a terribly meaningful value (since no collisions have occurred yet) but makes plotting easier
	this.Z_t_avg = 0;  // not a terribly meaningful value (since no collisions have occurred yet) but makes plotting easier
    }

    static copy(cpstc) {  // "copy constructor"; cpstc = CollisionPressureStats to copy

	let ncps;
	if (cpstc instanceof CollisionPressureStats_HS) {
	    ncps = new CollisionPressureStats_HS();
	} else {
	    ncps = new CollisionPressureStats_IG();
	}

	ncps.ui = cpstc.ui;
	ncps.num_t_avg_contribs = cpstc.num_t_avg_contribs;
	ncps.P_x_cumul = cpstc.P_x_cumul;
	ncps.P_y_cumul = cpstc.P_y_cumul;
	ncps.num_x_collisions_cumul = cpstc.num_x_collisions_cumul;
	ncps.num_y_collisions_cumul = cpstc.num_y_collisions_cumul;
	return ncps;
    }

    reset_accumulators() {

	this.num_t_avg_contribs = 0;
	this.num_x_collisions_cumul = 0;
	this.num_y_collisions_cumul = 0;
	this.P_x_cumul = 0.0;
	this.P_y_cumul = 0.0;
    }

    prepare_for_time_step() {

	this.num_x_collisions = 0;
	this.num_y_collisions = 0;
	this.P_x = 0.0;
	this.P_y = 0.0;
	// could track other things, like types of collisions, etc.
    }

    calc_quantities(area, N, kT) {

	this.num_t_avg_contribs += 1;
	this.num_x_collisions_cumul += this.num_x_collisions;
	this.num_y_collisions_cumul += this.num_y_collisions;
	this.P_x_cumul += this.P_x;
	this.P_y_cumul += this.P_y;
	this.P_x_t_avg = this.P_x_cumul / this.num_t_avg_contribs;
	this.P_y_t_avg = this.P_y_cumul / this.num_t_avg_contribs;
	this.Z_x_t_avg = this.P_x_t_avg * area / (N * kT);
	this.Z_y_t_avg = this.P_y_t_avg * area / (N * kT);
	this.Z_t_avg = 0.5 * ( this.Z_x_t_avg + this.Z_y_t_avg );
    }

    update_for_time_step(area, N, kT) {

	if (this.ui.pos_within_data_pt == 2) {
	    this.reset_accumulators();
	    console.log("INFO:   CollisionPressureStats accumulators reset...");
	}
	this.calc_quantities(area, N, kT);
	this.prepare_for_time_step();
    }
}

class CollisionPressureStats_IG extends CollisionPressureStats {}

class CollisionPressureStats_HS extends CollisionPressureStats {

    get_Z_SHY_t_avg() {

	return ( (this.num_t_avg_contribs == 0) ? 0.0 : (this.Z_t_avg / ModelCalc_HS.Z_SHY) );  // 0 not terribly meaningful (since no collisions have occurred) but makes plotting easier
    }
}
