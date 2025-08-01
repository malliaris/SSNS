
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
    static flot_data_opts_theory_plot = {
	color: "rgba(240, 120, 20, 1.0)",
	lines: {
	    show: true,
	    lineWidth: 2,
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
	$.plot($("#" + this.get_html_targ_id_str()), this.get_flot_data_series(t), this.get_flot_gen_opts());
    }
}

class PlotTypeHX_Gas extends PlotTypeHX {

    constructor(trj) {

	super();

	this.trj = trj;
	this.flot_data_opts_hist = copy(PlotTypeHX.flot_data_opts_histogram);
	this.flot_data_opts_theory = copy(PlotTypeHX.flot_data_opts_theory_plot);
    }

    get_ext_y_axis_lbl_str() {
	return "\\mathrm{ \\# \\; particles}";
    }

    get_ext_x_axis_lbl_str() {
	return "\\mathrm{ particle \\; speed}";
    }

    get_flot_data_series(t) {

	let data_series = [];
	let curr_gsh = this.trj.get_x(t).gsh;  // current gas speed histogram object, from which we will draw all data

	// load histogram data
	let hist_data = curr_gsh.get_flot_hist_data();  // flot library does not have histograms, so we must create data ("anchor" gaps, etc.)
	this.flot_data_opts_hist["data"] = hist_data;
	data_series.push(this.flot_data_opts_hist);
	
	// load theoretical functional form over-plot (2D Maxwell-Boltzmann speed distribution)
	let vL = 0.0;  //curr_gsh.get_x_val_min();
	let vR = curr_gsh.get_x_val_max();
	let mult_fctr = GasSpeedHistogram.bin_width * this.trj.N;  // multiply pdf by bin width to get a probability, and by N to get expected num particles
	let theory_data = this.trj.mc.mbde.get_flot_MBD_pdf(vL, vR, 100, this.trj.T, this.trj.m, mult_fctr);
	this.flot_data_opts_theory["data"] = theory_data;
	data_series.push(this.flot_data_opts_theory);

	return data_series;
    }

    get_flot_gen_opts() { return {}; }
}

class PlotTypeHX_IG extends PlotTypeHX_Gas {

    constructor(trj) {
	super(trj);
    }
}

class PlotTypeHX_HS extends PlotTypeHX_Gas {

    constructor(trj) {
	super(trj);
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

    get_flot_gen_opts() { return {}; }
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
