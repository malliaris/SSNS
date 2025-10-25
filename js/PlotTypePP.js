
///////////////////////////////////////////////////////////////////////////////////////////////
////////  PlotTypePP_*  ///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

// PlotTypePP = plot type Phase Portrait (loosely interpreted)
class PlotTypePP extends PlotType {

    constructor() {
	
	super();

	if (!this.get_flot_data_series) throw new Error("Derived PlotTypePP must define get_flot_data_series()");
	if (!this.get_flot_gen_opts) throw new Error("Derived PlotTypePP must define get_flot_gen_opts()");
    }

    get_html_targ_id_str() {
	return "plot_flot";  // PP for any ST can be done with flot library on this shared div
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

// a crude version of the LM bifurcation diagram can be outlined by varying r (not quite a phase portrait -- I know)
class PlotTypePP_Select extends PlotTypePP {

    static max_num_data_pts = 500;

    constructor(trj) {

	super();

	if (!this.append_data_pt) throw new Error("Derived PlotTypePP_Select must define append_data_pt()");

	this.trj = trj;
	this.select_data = [];

	// flot plot options -- actual data written into property "flot_data_obj['data']" in plot() method
	this.flot_data_opts_reg = {  // for regular points
	    color: "blue",
	    points: {
		fillColor: "blue",//"rgba(40, 40, 200, 0.2)",
		show: true,
		radius: 2,
	    },
	};
    }

    get_plot_data_reg(t) {  // returns what flot documentation call "rawdata" which has format [ [x0, y0], [x1, y1], ... ]

	if (this.trj.sim.ui.aux_toggle_ctrl_just_turned_off) {  // aux_toggle_ctrl_just_turned_off used as a signal that a single data point should be collected (**every other** button press)

	    if (this.select_data.length < PlotTypePP_Select.max_num_data_pts) {

		this.append_data_pt(t, this.select_data);
		console.log("INFO:   data point", this.select_data.at(-1), " collected and appended.");

	    } else {
		console.log("INFO:   unable to append another data point as PlotTypePP_Select.max_num_data_pts has been reached (", PlotTypePP_Select.max_num_data_pts, ")...");
	    }
	}
	return this.select_data;
    }

    get_flot_gen_opts() {
	return this.flot_gen_opts;
    }
}

class PlotTypePP_HS extends PlotTypePP_Select {

    constructor(trj) {

	super(trj);

	this.flot_gen_opts = {};
	let curr_kT = this.trj.get_x(0).get_kT();
	let NkT = Params_HS.N * curr_kT;
	let VR = 1.0;
	let p_min = 0.9 * NkT / VR;  // ideally, we'd autocalculate upper/lower bounds for p based on other parameter values...
	let p_max = 50.0;  // ideally, we'd autocalculate upper/lower bounds for p based on other parameter values...
	let VL_isotherms = NkT / p_max;
	this.set_xlim_flot(this.flot_gen_opts, 0.0, 1.0);
	this.set_ylim_flot(this.flot_gen_opts, p_min, p_max);
	let isotherm_data = this.trj.mc.mbde.get_flot_IG_isotherm(VL_isotherms, VR, 1000, NkT);
	this.flot_data_opts_theory = copy(PlotType.flot_data_opts_theory_curve);
	this.flot_data_opts_theory["data"] = isotherm_data;
    }

    get_ext_x_axis_lbl_str() {
	return "V";
    }

    get_ext_y_axis_lbl_str() {
	return "p";
    }
    
    append_data_pt(t, arr) {

	let V_val = this.trj.get_x(t).get_area();
	let p_val = 0.5 * (this.trj.get_x(t).cps.P_x_t_avg + this.trj.get_x(t).cps.P_y_t_avg);
	let kT_val = this.trj.get_x(t).get_kT();
	arr.push( [ V_val, p_val ] );
    }

    get_flot_data_series(t) {
	let data_series = [];
	data_series.push(this.flot_data_opts_theory);
	this.flot_data_opts_reg["data"] = this.get_plot_data_reg(t);
	data_series.push(this.flot_data_opts_reg);
	return data_series;
    }
}

class PlotTypePP_LM extends PlotTypePP_Select {

    constructor(trj) {

	super(trj);

	this.flot_gen_opts = {};
	this.set_xlim_flot(this.flot_gen_opts, 0.0, 4.0);
	this.set_ylim_flot(this.flot_gen_opts, 0.0, 1.0);
    }

    get_ext_x_axis_lbl_str() {
	return "r";
    }

    get_ext_y_axis_lbl_str() {
	return "x";
    }

    append_data_pt(t, arr) {

	let curr_r_val = this.trj.segs[this.trj.get_si(t)].p.r;
	arr.push( [ curr_r_val, this.trj.get_x(t).x ] );
    }

    get_flot_data_series(t) {
	let data_series = [];
	this.flot_data_opts_reg["data"] = this.get_plot_data_reg(t);
	data_series.push(this.flot_data_opts_reg);
	return data_series;
    }
}

class PlotTypePP_All extends PlotTypePP {

    constructor(trj) {

	super();
	this.trj = trj;

	// flot plot options -- actual data written into property "flot_data_obj['data']" in plot() method
	this.flot_data_opts_reg = {  // for regular points
	    color: "#c7894e",
	    points: {
		fillColor: "#c7894e",
		show: true,
		radius: 2,
	    },
	};

	this.flot_data_opts_curr_t = {  // additional outline circle to indicate current t
	    color: "#000000",
	    points: {
		show: true,
		radius: 6,
		fill: 0.3,
		fillColor: null,
	    },
	};
    }

    get_plot_data_reg(t) {  // returns what flot documentation call "rawdata" which has format [ [x0, y0], [x1, y1], ... ]

	let max_num_data_pts = 500;
	let num_data_pts_up_to_t = t - this.trj.t_0 + 1;  // how much past trajectory is there to possibly plot?
	let num_data_pts = Math.min(max_num_data_pts, num_data_pts_up_to_t);  // determine how much we will actually plot
	let t_i = t - num_data_pts + 1;
	let data = [];
	for (let s = t_i; s <= t; s++) {
	    data.push( [ this.trj.get_x(s).x, this.trj.get_x(s).y ] );
	}
	return data;
    }

    get_plot_data_curr_t(t) {  // returns what flot documentation call "rawdata" which has format [ [x0, y0], [x1, y1], ... ]

	return [ [ this.trj.get_x(t).x, this.trj.get_x(t).y ] ];
    }

    get_flot_data_series(t) {
	let data_series = [];
	this.flot_data_opts_reg["data"] = this.get_plot_data_reg(t);
	data_series.push(this.flot_data_opts_reg);
	this.flot_data_opts_curr_t["data"] = this.get_plot_data_curr_t(t);
	data_series.push(this.flot_data_opts_curr_t);
	return data_series;
    }

    get_flot_gen_opts() {
	return this.flot_gen_opts;
    }
}

class PlotTypePP_GM extends PlotTypePP_All {

    constructor(trj) {

	super(trj);

	this.flot_gen_opts = {};
	this.set_xlim_flot(this.flot_gen_opts, -4.0, 10.0);
	this.set_ylim_flot(this.flot_gen_opts, -4.0, 10.0);
	this.flot_gen_opts["xaxis"]["transform"] = function (v) { return -v; };  // make the gingerbread-man easier to recognize by flipping axis
	this.flot_gen_opts["yaxis"]["transform"] = function (v) { return -v; };  // make the gingerbread-man easier to recognize by flipping axis
    }

    get_ext_x_axis_lbl_str() {
	return "\\xleftarrow{\\hspace*{1.0cm}} x";
    }

    get_ext_y_axis_lbl_str() {
	return "\\xleftarrow{\\hspace*{1.0cm}} y";
    }
}
