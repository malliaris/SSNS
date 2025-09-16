
///////////////////////////////////////////////////////////////////////////////////////////////
////////  PlotTypeHX_*  ///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

class PlotTypeHX extends PlotType {

    static flot_data_opts_histogram = {
	color: "rgba(40, 40, 200, 0.2)",
	lines: {
	    show: true,
	    lineWidth: 4,
	    steps: true,
	    fill: true,
	    fillColor: "rgba(50, 50, 255, 0.5)"
	}
    };
    static flot_data_opts_line_plot = {
	color: "rgba(40, 40, 200, 0.2)",
	lines: {
	    show: true,
	    lineWidth: 4,
	    steps: false,
	    fill: true,
	    fillColor: "rgba(50, 50, 255, 0.5)"
	}
    };
    static flot_data_opts_theory_curve = {
	color: "rgba(240, 120, 20, 1.0)",
	lines: {
	    show: true,
	    lineWidth: 2,
	}
    };
    static flot_data_opts_theory_points = {
	color: "rgba(240, 120, 20, 1.0)",
	points: {
	    show: true,
	    radius: 4,
	    fill: 0.8,
	    fillColor: null,
	}
    };

    constructor() {

	super();

	if (!this.get_flot_data_series) throw new Error("Derived PlotTypeHX must define get_flot_data_series()");
	if (!this.get_flot_gen_opts) throw new Error("Derived PlotTypeHX must define get_flot_gen_opts()");	
    }

    get_html_targ_id_str() {
	return "plot_flot";  // H(x) for any ST can be done with flot library on this shared div
    }

    get_plot_width() {
	return PlotType.square_plot_width;
    }

    get_plot_height() {
	return PlotType.square_plot_height;
    }

    plot(t) {
	$.plot($("#" + this.get_html_targ_id_str()), this.get_flot_data_series(t), this.get_flot_gen_opts(t));
    }
}

class PlotTypeHX_Gas extends PlotTypeHX {

    constructor(trj) {

	super();

	this.trj = trj;
	this.flot_data_opts_hist = copy(PlotTypeHX.flot_data_opts_histogram);
	this.flot_data_opts_theory = copy(PlotTypeHX.flot_data_opts_theory_curve);
    }

    get_ext_y_axis_lbl_str() {
	return "\\mathrm{ \\# \\; particles}";
    }

    get_ext_x_axis_lbl_str() {
	return "\\mathrm{ particle \\; speed}";
    }

    get_flot_gen_opts(t) { return {}; }
}

class PlotTypeHX_IG extends PlotTypeHX_Gas {

    constructor(trj) {
	super(trj);
    }

    get_flot_data_series(t) {

	let data_series = [];
	let curr_gsh = this.trj.get_x(t).gsh;  // current gas speed histogram object, from which we will draw all data

	// load histogram data
	let hist_data = curr_gsh.get_flot_hist_data(1.0);  // 1.0 is multiplicative factor for returned data (not used, here)
	this.flot_data_opts_hist["data"] = hist_data;
	data_series.push(this.flot_data_opts_hist);
	
	// load theoretical functional form over-plot (2D Maxwell-Boltzmann speed distribution)
	let vL = 0.0;  //curr_gsh.get_x_val_min();
	let vR = curr_gsh.get_x_val_max();
	let mult_fctr = curr_gsh.bin_width * Params_IG.N;  // multiply pdf by bin width to get a probability, and by N to get expected num particles
	let theory_data = this.trj.mc.mbde.get_flot_MBD_pdf(vL, vR, 100, Params_IG.kT, Params_IG.m, mult_fctr);
	this.flot_data_opts_theory["data"] = theory_data;
	data_series.push(this.flot_data_opts_theory);

	return data_series;
    }
}

class PlotTypeHX_HS extends PlotTypeHX_Gas {

    constructor(trj) {

	super(trj);

	this.flot_data_opts_Boltz_PRELIM = {
	    color: "rgba(255, 0, 0, 1.0)",
	    lines: {
		show: true,
		lineWidth: 3,
	    }
	};
    }

    get_flot_data_series(t) {

	let data_series = [];
	let curr_gsh = this.trj.get_x(t).gsh;  // current gas speed histogram object, from which we will draw all data
	let curr_peh = this.trj.get_x(t).peh;  // current particle energy histogram object, from which we will draw data

	let avg_KE = this.trj.get_x(t).get_avg_KE();
	let avg_ish_v = Math.sqrt(2.0 * avg_KE / Params_HS.m);
	
	// load v histogram data
	let v_hist_data = curr_gsh.get_flot_hist_data(1.0 / Params_HS.N);  // returned data will be multiplied by (1.0 / Params_HS.N) to give a fraction
	this.flot_data_opts_hist["data"] = v_hist_data;
	data_series.push(this.flot_data_opts_hist);
	
	// load E histogram data
	let E_hist_data = curr_peh.get_flot_semilog_point_data(1.0);  // 1.0 is multiplicative factor for returned data (not used, here)
	this.flot_data_opts_Boltz_PRELIM["data"] = E_hist_data;
	////data_series.push(this.flot_data_opts_Boltz_PRELIM);
	
	// load theoretical functional form over-plot (2D Maxwell-Boltzmann speed distribution)
	let vL = 0.0 / avg_ish_v;  //curr_gsh.get_x_val_min();
	let vR = curr_gsh.get_x_val_max() / avg_ish_v;
	let mult_fctr = curr_gsh.bin_width;  // multiply pdf by bin width to get a probability
	let theory_data = this.trj.mc.mbde.get_flot_MBD_pdf(vL, vR, 100, Params_HS.kT0, Params_HS.m, mult_fctr);
	this.flot_data_opts_theory["data"] = theory_data;
	data_series.push(this.flot_data_opts_theory);

	return data_series;
    }
}

class PlotTypeHX_SP extends PlotTypeHX {

    constructor() {
	super();
	this.flot_data_opts = copy(PlotTypeHX.flot_data_opts_histogram);
    }

    get_ext_y_axis_lbl_str() {
	return "\\mathrm{ \\# \\; ensemble \\; members}";
    }

    get_flot_data_series(t) {

	let data_series = [];
	this.flot_data_opts["data"] = this.get_plot_data(t);
	data_series.push(this.flot_data_opts);
	/*
	let pd = new poisson.Poisson(100);
	let temp_data = [];
	for (let x = 50; x < 151; x++) {
	    temp_data.push( [ x, 10000*pd.pmf(x) ] );  // flot requires format [ [x0, y0], [x1, y1], ... ]
	}
	let temp_obj = {};
	temp_obj["data"] = temp_data;
	data_series.push(temp_obj);
	*/
	return data_series;
    }

    get_flot_gen_opts(t) { return {}; }
}

class PlotTypeHX_SP_finite extends PlotTypeHX_SP {

    get_plot_data(t) {  // returns what flot documentation call "rawdata" which has format [ [x0, y0], [x1, y1], ... ]

	let H_x_data = this.trj.get_x(t).H_x_group;  // for convenience
	let data = [];
	for (let x = 0; x < H_x_data.length; x++) {
	    data.push( [ x, Math.log(H_x_data.get(x)) ] );  // flot requires format [ [x0, y0], [x1, y1], ... ]
	}
	let hist_data = this.get_hist_data_flot(data);
	return hist_data;
    }
}

class PlotTypeHX_SP_semiinf extends PlotTypeHX_SP {

    get_plot_data(t) {  // returns what flot documentation call "rawdata" which has format [ [x0, y0], [x1, y1], ... ]

	let data = [];
	this.trj.get_x(t).H_x_group.forEach((element, index) => {
	    let x = element[0];
	    let H_x = element[1];
	    data.push( [ x, H_x ] );  // flot requires format [ [x0, y0], [x1, y1], ... ]
	});
	let hist_data = this.get_hist_data_flot(data);
	return hist_data;
    }
}

class PlotTypeHX_RW extends PlotTypeHX_SP_finite {

    constructor(trj) {
	super();
	this.trj = trj;
    }

    get_ext_x_axis_lbl_str() {
	return "\\mathrm{ position } \\; x";
    }
}

class PlotTypeHX_MN extends PlotTypeHX_SP_finite {

    constructor(trj) {
	super();
	this.trj = trj;
    }

    get_ext_x_axis_lbl_str() {
	return "\\mathrm{ \\# \\; of \\; individuals}";
    }
}

class PlotTypeHX_CH extends PlotTypeHX_SP_semiinf {

    constructor(trj) {
	super();
	this.trj = trj;
    }

    get_ext_x_axis_lbl_str() {
	return "\\mathrm{ \\# \\; of \\; particles}";
    }
}

class PlotTypeHX_SH extends PlotTypeHX {

    static flot_data_opts_curve = {
	lines: {
	    show: true,
	    lineWidth: 2,
	}
    };

    constructor(trj) {

	super();

	this.trj = trj;
	this.flot_data_opts_rho_x = copy(PlotTypeHX_SH.flot_data_opts_curve);
	this.flot_data_opts_rho_x.color = "rgba(240, 120, 20, 1.0)";
	this.flot_data_opts_p_x = copy(PlotTypeHX_SH.flot_data_opts_curve);
	this.flot_data_opts_p_x.color = "rgba(0, 0, 255, 1.0)";
	this.flot_data_opts_u_x = copy(PlotTypeHX_SH.flot_data_opts_curve);
	this.flot_data_opts_u_x.color = "rgba(255, 0, 0, 1.0)";
	this.flot_data_opts_m_x = copy(PlotTypeHX_SH.flot_data_opts_curve);
	this.flot_data_opts_m_x.color = "rgba(0, 255, 0, 1.0)";
    }

    get_ext_y_axis_lbl_str() {
	return "\\textcolor{#f07814}{\\rho/\\rho_L} \\, , \\; \\textcolor{#0000ff}{p/p_L} \\, , \\; \\textcolor{#ff0000}{u/c_L} \\, , \\; \\textcolor{#00ff00}{\\mathrm{Ma}}";
    }

    get_ext_x_axis_lbl_str() {
	return "x";
    }

    get_flot_data_series(t) {

	let data_series = [];
	let N = Params_SH.N;
	let rho_data = [];
	let p_data = [];
	let u_data = [];
	let m_data = [];
	let coords = this.trj.get_x(t);
	this.trj.mc.load_derived_vectors_pcum(coords.rho, coords.rhou, coords.rhoe);
	for (let i = 0; i < N; i++) {
	    let x_val = this.trj.mc.x.get(i);
	    rho_data.push( [ x_val, (coords.rho.get(i) / Params_SH.rhoL) ] );  // flot requires format [ [x0, y0], [x1, y1], ... ]
	    p_data.push( [ x_val, (this.trj.mc.p.get(i) / Params_SH.pL) ] );  // flot requires format [ [x0, y0], [x1, y1], ... ]
	    u_data.push( [ x_val, (this.trj.mc.u.get(i) / ModelCalc_SH.cL) ] );  // flot requires format [ [x0, y0], [x1, y1], ... ]
	    m_data.push( [ x_val, this.trj.mc.m.get(i) ] );  // flot requires format [ [x0, y0], [x1, y1], ... ]
	}
	this.flot_data_opts_rho_x["data"] = rho_data;
	data_series.push(this.flot_data_opts_rho_x);
	this.flot_data_opts_p_x["data"] = p_data;
	data_series.push(this.flot_data_opts_p_x);
	this.flot_data_opts_u_x["data"] = u_data;
	data_series.push(this.flot_data_opts_u_x);
	this.flot_data_opts_m_x["data"] = m_data;
	data_series.push(this.flot_data_opts_m_x);


	
	return data_series;
    }

    get_flot_gen_opts(t) {
	let opts = {};
	this.set_ylim_flot(opts, -0.05, 1.05);
	this.add_horiz_line_flot(opts, ModelCalc_SH.p2/Params_SH.pL, 1, "#444444");  // fyi, p2 == p3
	this.add_horiz_line_flot(opts, ModelCalc_SH.rho2/Params_SH.rhoL, 1, "#444444");
	this.add_horiz_line_flot(opts, ModelCalc_SH.rho3/Params_SH.rhoL, 1, "#444444");
	this.add_horiz_line_flot(opts, ModelCalc_SH.u2/ModelCalc_SH.cL, 1, "#444444");  // fyi, u2 == u3
	this.add_horiz_line_flot(opts, ModelCalc_SH.u2/ModelCalc_SH.c2, 1, "#444444");
	this.add_horiz_line_flot(opts, ModelCalc_SH.u3/ModelCalc_SH.c3, 1, "#444444");
	this.add_vert_line_flot(opts, Params_SH.L_x / 2, 1, "#444444");
	this.add_vert_line_flot(opts, this.trj.get_x(t).x_contact_discont_analyt, 1, "#444444");
	this.add_vert_line_flot(opts, this.trj.get_x(t).x_shock_analyt, 1, "#444444");
	return opts;
    }
}

class PlotTypeHX_PF extends PlotTypeHX {

    constructor(trj) {

	super();

	this.trj = trj;
	this.flot_data_opts_hist = {
	    color: "rgba(40, 40, 200, 0.2)",
	    points: {
		show: true,
		radius: 3,
		fill: true,
		color: "rgba(0, 5, 120, 1)",
		fillColor: "rgba(0, 5, 120, 1)",
	    },
	    bars: {
		show: true,
		horizontal: true,
		barWidth: 0.95,
		align: "center"
	    }
	};
	this.flot_data_opts_analyt_ss_points = copy(PlotTypeHX.flot_data_opts_theory_points);
	this.flot_data_opts_true_fluid_curve = copy(PlotTypeHX.flot_data_opts_theory_curve);
    }

    get_ext_y_axis_lbl_str() {
	return "y \\; \\mathrm{(m)}";
    }

    get_ext_x_axis_lbl_str() {
	return "\\mathrm{ slab \\; velocity} \\; v \\; \\mathrm{(m/s)}";
    }

    get_flot_data_series(t) {

	let data_series = [];
	let curr_params = this.trj.segs[this.trj.get_si(t)].p;
	let Dpol = curr_params.Dpol;
	let Ut = curr_params.Ut;
	let Ub = curr_params.Ub;
	let mu = curr_params.mu;
	let alpha = curr_params.alpha;
	let N = Params_PF.N;

	// plot the individual slab velocities in histogram form
	let curr_v_vect = this.trj.get_x(t).vs;  // vector vs has N + 2 entries, with first and last being movable boundaries
	let hist_data = [];
	let spacing = 1.0/N;  // N + 2 entries will run from -1/N to 1 + 1/N
	for (let i = 0; i < curr_v_vect.shape[0]; i++) {
	    let v_val = curr_v_vect.get(curr_v_vect.length - 1 - i);  // i --> curr_v_vect.length - 1 - i to flip top-to-bottom
	    hist_data.push( [ v_val, (i - 0.5)*spacing ] );  // flot requires format [ [x0, y0], [x1, y1], ... ]
	}
	this.flot_data_opts_hist["data"] = hist_data;
	data_series.push(this.flot_data_opts_hist);

	// plot analytical steady-state points
	let theory_data_1 = this.trj.mc.get_analytical_steady_state_thr_vect(alpha, Ut, Ub, N, mu, 0);
	this.flot_data_opts_analyt_ss_points["data"] = theory_data_1;
	data_series.push(this.flot_data_opts_analyt_ss_points);

	// plot theoretical steady-state curve for true fluid system
	let theory_data_2 = this.trj.mc.get_fluid_planar_flow_thr_curve(Ut, Ub, 1.0, mu, Dpol, 100);
	this.flot_data_opts_true_fluid_curve["data"] = theory_data_2;
	data_series.push(this.flot_data_opts_true_fluid_curve);

	// WORKAROUND: this single, practically invisible dummy point on the v = 0 axis makes it so that the full bar height is always shown
	let dummy_point = {points: {show: true, radius: 0.0001}, data: [[0, 0.5]]};
	data_series.push(dummy_point);

	return data_series;
    }

    get_flot_gen_opts(t) {
	let opts = {};
	let spacing = 1.0/Params_PF.N;  // N + 2 entries will run from -1/N to 1 + 1/N
	this.set_ylim_flot(opts, -1.2*spacing, 1.0 + 1.2*spacing);  // the 0.2 leaves a little white space
	this.add_horiz_line_flot(opts, 0.0, 3, "#777777");
	this.add_horiz_line_flot(opts, 1.0, 3, "#777777");
	return opts;
    }
}
