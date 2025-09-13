
///////////////////////////////////////////////////////////////////////////////////////////////
////////  IG = Ideal Gas (from SM = Statistical Mechanics)  /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

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
class GasParticleUpdate {

    set_inputs(z, vz, Lz, BC_refl, dt) {

	this.num_collisions = 0;
	this.new_z = z;  // will likely be updated below...
	this.new_vz = vz;  // will likely be updated below...

	if ( ! ((this.new_vz === 0) || (dt === 0))) {  // if there is motion, we need to update quantities...

	    let tot_path_len = Math.abs(this.new_vz * dt);
	    let modf_parts = modf(tot_path_len / Lz);
	    let num_half_laps = parseInt(modf_parts[0]);  // each lap is an "up-and-back"; each half lap is an "up" or a "back"
	    let remainder = modf_parts[1] * Lz;  // total path's partial half lap "remainder", scaled back to correct for division by Lz above
	    
	    if (BC_refl) {  // if boundary is reflecting...

		// first, update quantities for the integer number of half laps
		this.num_collisions += num_half_laps;
		if (num_half_laps % 2 == 1) {
		    this.new_z = Lz - this.new_z;  // an odd number of half laps flips both position...
		    this.new_vz *= -1.0;  // ... and velocity
		}

		// second, update quantities for the "remainder"
		let proposed_z = this.new_z + Math.sign(this.new_vz)*remainder;  // value of proposed_z will be checked against boundaries [0, Lz]
		if (proposed_z < 0.0) {  // if to the left of boundary at 0...
		    this.num_collisions += 1;
		    this.new_z = -1.0 * proposed_z;  // flip z and...
		    this.new_vz *= -1.0;  // ... flip vz
		} else if (proposed_z > Lz) {  // if to the right of boundary at Lz...
		    this.num_collisions += 1;
		    this.new_z = Lz - 2.0*(proposed_z - Lz);  // flip z around value Lz and...
		    this.new_vz *= -1.0;  // ... flip vz
		} else {  // no adjustments needed
		    this.new_z = proposed_z;
		}

	    } else {  // else, boundary is periodic, and we

		this.new_z = (this.new_z + this.new_vz*dt + Lz) % Lz;  // wrap (no need for wall proximity check)
	    }
	}
    }
}

// NOTE: T is measured in energy units, i.e., it could be called tau = k_B T
class ModelCalc_IG extends ModelCalc_Gas {

    constructor() {
	super();
    }
}

// NOTE: T is measured in energy units, i.e., it could be called tau = k_B T
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
	    new_p.v_hist_bi = this.gsh.get_bin_indx(new_p.get_speed());
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
