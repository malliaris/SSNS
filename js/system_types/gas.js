
///////////////////////////////////////////////////////////////////////////////////////////////
////////  gas-related classes shared by Ideal Gas (IG) and Hard Sphere (HS) system types  /////
///////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////
//////// GasParticle class  ///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
//
// * represents position, velocity, and properties of a single gas particle
// * particle assumed to be "monatomic" so that no orientation information is needed/stored
// * "container" assumed to be the unit square, so that 0 <= x, y <= 1
//
class GasParticle {

    constructor(x, y, R, m, vx, vy) {
	this.x = x;
	this.y = y;
	this.R = R;
	this.m = m;
	this.vx = vx;
	this.vy = vy;
	this.v_hist_bi;  // bi = bin index (in GasSpeedHistogram)
    }

    get_speed() {
	return Math.sqrt( this.vx*this.vx + this.vy*this.vy );
    }

    get_KE() {
	let v = this.get_speed();
	return 0.5 * this.m * v * v;
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
class GasSpeedHistogram {

    static bin_width = 0.01;

    static get_bin_indx(v) {
	return parseInt(modf(v / GasSpeedHistogram.bin_width)[0]);
    }

    static get_x_bin_start(bi) {
	return bi * GasSpeedHistogram.bin_width;
    }

    constructor() {

	this.hist = new OrderedMap();
    }

    static copy(gsh_to_cpy) {  // "copy constructor"
	
	let new_gsh = new GasSpeedHistogram();
	new_gsh.hist = new OrderedMap(gsh_to_cpy.hist);  // NOTE: I think this "copy constructor" happens to work, but shouldn't be counted on generally!!
	return new_gsh;
    }

    get_x_val_min() {
	return (this.hist.front()[0] + 0.5) * GasSpeedHistogram.bin_width;
    }

    get_x_val_max() {
	return (this.hist.back()[0] + 0.5) * GasSpeedHistogram.bin_width;
    }

    // needed since flot library does not natively support histogram plotting, but rather line plots in a "step" style
    get_flot_hist_data() {

	let data = [];
	let most_recent_i = this.hist.front()[0];  // initialize
	this.hist.forEach((element, index) => {

	    let i = element[0];
	    let H_i = element[1];
	    if (i > most_recent_i + 1) {  // if there is a "gap" we add an artificial data point at its left side and with y-value 0 for correct histogram
		data.push( [ GasSpeedHistogram.get_x_bin_start(most_recent_i + 1), 0 ] );
	    }
	    data.push( [ GasSpeedHistogram.get_x_bin_start(i), H_i ] );  // flot requires format [ [x0, y0], [x1, y1], ... ]
	    most_recent_i = i;
	});

	let extra_pair = [ data.at(-1)[0] + GasSpeedHistogram.bin_width, data.at(-1)[1] ];  // add extra pair to "terminate" the histogram at right edge
	data.push(extra_pair);
	
	return data;
    }

    output_info() {

	this.hist.forEach((element, index) => {
	    let i = element[0];
	    let H_i = element[1];
	    console.log(i, ":", H_i);
	});
    }
}

//
// formulae for 2D Maxwell-Boltzmann distribution, etc.
// (taken from wikipedia page section for n-D results with n = 2)
// https://en.wikipedia.org/wiki/Maxwell%E2%80%93Boltzmann_distribution#In_n-dimensional_space
//
class MaxBoltzDistEtc {

    constructor(mc) {
	this.mc = mc;
    }

    get_rand_x() {
	return (Params_IG.Lx * this.mc.unif01_rng());
    }

    get_rand_y() {
	return (Params_IG.Ly * this.mc.unif01_rng());
    }

    get_rand_angle() {
	return (2 * Math.PI * this.mc.unif01_rng());
    }

    get_MBD_v_comp(kT, m) {
	return (this.mc.normal_rng(0.0, Math.sqrt(kT / m)));
    }

    get_MBD_v_chi(kT, m) {
	let xi_chi = this.get_draw_chi_dist_2_dof();  // xi is the chi-distributed variable
	return Math.sqrt(kT / m) * xi_chi;
    }

    get_MBD_v_avg(kT, m) {
	return Math.sqrt(0.5 * Math.PI * kT / m);
    }
    
    get_MBD_v_rms(kT, m) {
	return Math.sqrt(2.0 * kT / m);
    }
    
    get_MBD_v_mode(kT, m) {
	return Math.sqrt(kT / m);
    }
    
    get_draw_chi_dist_2_dof() {
	return this.mc.chi_rng(2);
    }

    load_vc_spec_v_rand_dir(vc, v) {
	let rand_angle = this.get_rand_angle();
	vc.x = v * Math.cos(rand_angle);
	vc.y = v * Math.sin(rand_angle);
    }

    load_vc_MBD_v_comps(vc, kT, m) {
	//console.log("vc =", vc);///////
	vc.x = this.get_MBD_v_comp(kT, m);
	//console.log("vc =", vc);///////
	vc.y = this.get_MBD_v_comp(kT, m);
	//console.log("vc =", vc);///////
    }

    get_MBD_pdf(kT, m, v) {  // this is a normalized pdf, i.e., a density; use mult_fctr in get_flot_MBD_pdf() to get probabilities, expected particles numbers, etc.
	return (m / kT) * v * Math.exp( - 0.5 * m * v * v / kT );
    }

    get_flot_MBD_pdf(vL, vR, num_points, kT, m, mult_fctr) {  // use mult_fctr to get probabilities, expected particles numbers, etc.

	let arr_to_return = [];
	let v_vals = linspace(vL, vR, num_points);
	for (let i = 0; i < num_points; i++) {

	    let v = v_vals[i];
	    let P_v = mult_fctr * this.get_MBD_pdf(kT, m, v);
	    arr_to_return.push( [ v, P_v ] );  // flot requires format [ [x0, y0], [x1, y1], ... ]
	}
	return arr_to_return;
    }
}

class ModelCalc_Gas extends ModelCalc {

    constructor() {

	super();

	this.mbde = new MaxBoltzDistEtc(this);
	this.unif01_rng = randu.factory({'seed': ModelCalc_Stoch.rng_seed.v });
	this.normal_rng = normal.factory({'seed': ModelCalc_Stoch.rng_seed.v });
	this.chi_rng = chi.factory({'seed': ModelCalc_Stoch.rng_seed.v });
	this.chi_squared_rng = chisquare.factory({'seed': ModelCalc_Stoch.rng_seed.v });  // NOTE: "chisquare", i.e., library class has no 'd' at end
	console.log("INFO:\tusing PRNG algorithm Mersenne Twister 19937 (the default) on all:", this.unif01_rng.PRNG.NAME, this.chi_rng.PRNG.NAME, this.chi_squared_rng.PRNG.NAME);
	console.log("INFO:\tusing seed value = " + ModelCalc_Stoch.rng_seed.v);
	console.log("INFO:\tNOTE: ModelCalc_HS **does not** extend ModelCalc_Stoch!  While PRNGs are used for initial condition, all time evolution is deterministic!");
    }

    model_is_stoch() {return false; }  // model considered non-stochastic since time evolution is non-stochastic (even though initial condition might be randomly generated)
}
