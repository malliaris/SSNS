
///////////////////////////////////////////////////////////////////////////////////////////////
////////  PlotTypeXT_*  ///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

class PlotTypeXT extends PlotType {

    static a_R_MIN = 2;  // value NOT adjustable from UI; should be small, e.g., 2
    static a_L_MIN = 1;  // value NOT adjustable from UI; should be small, e.g., 1
    static f_R = 0.1;   // value NOT adjustable from UI; should be < 0.3
    static f_L = 0.15;   // value NOT adjustable from UI; should be < 0.2, so that (f_R + f_L) < 0.5
    // NOTE: "#UI_CTRL_window_size" --> win_size has min="10", so there should be >= (f_R + f_L)*win_size ~=5 sites where t can "run"

    static flot_traj_seg_color_cycle = [ "#ff0000", "#00ff00", "#0000ff" ];
    static flot_t_symb_opts = { points: {show: true, radius: 6, fillColor: "#000000"}, color: "#000000" };  // will be plotted "behind" all other data
    static flot_partial_seg_opts = { lines: {show: true}, points: {show: true, fillColor: "purple"}, color: "purple" }; // purple just a placeholder
    static flot_seg_connector_opts = { lines: {show: true}, color: "purple" };  // purple just a placeholder... will be overwritten
    static flot_initial_gen_opts_XT = { xaxis: {tickDecimals: 0} };
    static window_size;  // = new UINI_int(this, "UI_CTRL_window_size", false);  assignment occurs in UserInterface(); see discussion there
    
    constructor() {

	super();

	if (!this.get_flot_data_series) throw new Error("Derived PlotTypeXT must define get_flot_data_series()");
	if (!this.get_flot_gen_opts) throw new Error("Derived PlotTypeXT must define get_flot_gen_opts()");	

	// this.t_L, this.t_i, this.t_f this.t_R;  "declaration"... these will be set in update_window() and used in plot()
    }

    get_html_targ_id_str() {
	return "plot_flot";
    }

    get_plot_width() {
	return PlotType.non_square_plot_width;
    }

    get_plot_height() {
	return PlotType.non_square_plot_height;
    }

    get_a_R(tl, ws) {  // args are trajectory length and window size
	let min_tl_ws = Math.min(tl, ws);
	let val_from_frac_formula = Math.floor(PlotTypeXT.f_R * min_tl_ws);
	return Math.max(PlotTypeXT.a_R_MIN, val_from_frac_formula);  // a_R should be at least PlotTypeXT.a_R_MIN ~= 2
    }

    get_a_L(tl, ws) {  // args are trajectory length and window size
	let min_tl_ws = Math.min(tl, ws);
	let val_from_frac_formula = Math.floor(PlotTypeXT.f_L * min_tl_ws);
	return Math.max(PlotTypeXT.a_L_MIN, val_from_frac_formula);  // a_L should be at least PlotTypeXT.a_L_MIN ~= 1
    }

    update_window() {  // update_window(), etc. not currently set up to handle arbitrary t (that could be arg to plot(t))

	let t_0 = this.trj.t_0;  // for convenience
	let t = this.trj.t;  // for convenience
	let t_e = this.trj.t_edge;  // for convenience
	let ws = PlotTypeXT.window_size.v;  // for convenience

	let traj_len = t_e - t_0;  // total length of trajectory
	let a_R = this.get_a_R(traj_len, ws);  // ideal amount of padding on R side of window
	let a_L = this.get_a_L(traj_len, ws);  // ideal amount of padding on L side of window

	//console.log("AaAaAa 1", this.t_L, this.t_i, this.t_f, this.t_R, ws, a_L, a_R);//////////

	// determine values for t_L,i,f,R using lots of conditionals
	if (traj_len < (ws - a_R)) {  // if entire traj can fit in displayable space, display it all

	    this.t_R = this.trj.t_edge + a_R;
	    this.t_L = this.trj.t_0;

	} else {  // else, we'll need to "trim" some traj from one or both ends

	    // values can be undefined if traj is "grown" past window size using another plot type, then switched to XY...
	    let win_t_vals_undef = ((this.t_R == undefined) || (this.t_L == undefined));
	    if (win_t_vals_undef) {  // for such an "initial" XT display, we choose to anchor closer to t_R

		this.t_R = t + a_R;
		this.t_L = Math.max(t_0, this.t_R - ws);

	    } else {  // previous t_* vals defined...

		let ws_unchanged = ((this.t_L + ws) == this.t_R);  // whether window size has NOT changed
		if (ws_unchanged) {  // if window size hasn't changed, it is easy to take previous t_L,R into account

		    if (t > (this.t_R - a_R)) {  // if t has moved too far right, push t_R right
			this.t_R = t + a_R;
			this.t_L = Math.max(t_0, this.t_R - ws);
		    } else if (t < (this.t_L + a_L)) {  // else, if t has moved too far left, push t_L left
			this.t_L = Math.max(t_0, t - a_L);
			this.t_R = this.t_L + ws;
		    }  // else, t is in the middle of the window, and we can leave t_* unchanged

		} else {  // else, window size has changed

		    let old_ws = this.t_R - this.t_L;
		    let prev_frac_L = (t - this.t_L) / old_ws;  // previous fraction of window to the L of t

		    if (ws > old_ws) {  // if window size is increasing

			for (let i = 0; i < (ws - old_ws); i++) {  // do it one-by-one
			    let curr_frac_L = (t - this.t_L) / (this.t_R - this.t_L);  // current fraction of window to the L of t

			    if (this.t_L == 0) {
				this.t_R++;
			    } else if ((this.t_R - t_e) >= a_R) {
				this.t_L--;
			    } else {
				if (curr_frac_L < 0.5) {
				    this.t_L--;
				} else {
				    this.t_R++;
				}
			    }
			}

		    } else {  // if window size is decreasing

			for (let i = 0; i < (old_ws - ws); i++) {  // do it one-by-one
			    let curr_frac_L = (t - this.t_L) / (this.t_R - this.t_L);  // current fraction of window to the L of t

			    if ((this.t_R - t_e) > a_R) {
				this.t_R--;
			    } else if ((t - this.t_L) <= a_L) {
				this.t_R--;
			    } else if ((this.t_R - t_e) >= 0) {
				this.t_L++;
			    } else {
				if (curr_frac_L > 0.5) {
				    this.t_L++;
				} else {
				    this.t_R--;
				}
			    }
			}
		    }
		}
	    }
	}
	this.t_f = Math.min(t_e, this.t_R);  // works for all cases
	this.t_i = this.t_L;  // works for all cases
	//console.log("AaAaAa 2", this.t_L, this.t_i, this.t_f, this.t_R, ws, a_L, a_R);//////////
    }

    update_x_axis_flot(flot_gen_opts, L, R, edge) {
	this.set_xlim_flot(flot_gen_opts, L, R);  // this.t_L/R define x range on plot
	this.set_xticks_intgr_flot(flot_gen_opts, L, R);  // sensible ticks at every integer (flot seems to auto-hide some labels... ok for now)
	this.remove_vert_horiz_lines_flot(flot_gen_opts);  // prep for possible addition
	if ((L <= edge) && (edge <= R)) {  // if t_edge is within window, add a thick, vertical line there to guide the eye
	    this.add_vert_line_flot(flot_gen_opts, edge, 4, "#999999");  // line width, color are last two args
	}
    }
    
    get_t_symb_obj_to_plot(t_symb_data) {  // return flot-plottable obj indicating (with a circle) current value of t
	let t_symb_obj = copy(PlotTypeXT.flot_t_symb_opts);
	t_symb_obj["data"] = t_symb_data;  // insert data and return
	return t_symb_obj;
    }
    
    get_partial_seg_obj_to_plot(si, partial_seg_data) {  // points and lines for a traj seg (or partial traj seg if window clips it)
	let partial_seg_obj = copy(PlotTypeXT.flot_partial_seg_opts);
	partial_seg_obj["color"] = this.get_tsccc_flot(si);  // set line color based on segment index si
	partial_seg_obj["points"]["fillColor"] = this.get_tsccc_flot(si);  // set point color based on segment index si
	partial_seg_obj["data"] = partial_seg_data;
	return partial_seg_obj;
    }
    
    get_seg_connector_obj_to_plot(si, seg_connector_data) {  // line only (no points) connecting end of one partial seg to beginning of next
	let seg_connector_obj = copy(PlotTypeXT.flot_seg_connector_opts);
	seg_connector_obj["color"] = this.get_tsccc_flot(si);  // set color based on segment index si
	seg_connector_obj["data"] = seg_connector_data;
	return seg_connector_obj;
    }
    
    get_data_t_range(fxn_of_t, t_i, t_f) {  // MOVE UP TO PlotType WHEN READY    get a basic array of data plottable by the flot library

	let data = [];
	for (let t = t_i; t <= t_f; t++) {
	    data.push( [ t, fxn_of_t(t) ] );  // flot requires format [ [x0, y0], [x1, y1], ... ]
	}
	return data;
    }

    assemble_data_by_seg(arr_of_objs_to_plot, fxn_of_t, t_i, t_f) {  // FILL IN

	// symbol(s) indicating the "current" time t; add this to array first so it's "behind" everything else
	let t_symb_data = this.get_data_t_range(fxn_of_t, this.trj.t, this.trj.t);  // [t,t] gives a single point
	arr_of_objs_to_plot.push(this.get_t_symb_obj_to_plot(t_symb_data));

	// determine range of segment indices and iterate over them
	let si_i = this.trj.get_si(t_i);  // determine si_i = segment index, initial
	let si_f = this.trj.get_si(t_f);  // determine si_f = segment index, final
	for (let si = si_i; si <= si_f; si++) {

	    // the segments themselves (partial since a segment end will be "clipped" if extends outside t_i or t_f)
	    let partial_seg_t_i = Math.max(t_i, this.trj.segs[si].t_first);
	    let partial_seg_t_f = Math.min(t_f, this.trj.segs[si].t_last);
	    let partial_seg_data = this.get_data_t_range(fxn_of_t, partial_seg_t_i, partial_seg_t_f);
	    arr_of_objs_to_plot.push(this.get_partial_seg_obj_to_plot(si, partial_seg_data));

	    // the segment "connectors" -- each is a Delta t == 1 line prepended to the corresponding segment
	    let seg_connector_t_i = Math.max(t_i, this.trj.segs[si].t_first - 1);
	    let seg_connector_t_f = this.trj.segs[si].t_first;
	    if (seg_connector_t_f - seg_connector_t_i >= 1) {
		let seg_connector_data = this.get_data_t_range(fxn_of_t, seg_connector_t_i, seg_connector_t_f);
		arr_of_objs_to_plot.push(this.get_seg_connector_obj_to_plot(si, seg_connector_data));
	    }
	}
    }

    get_ext_x_axis_lbl_str() {
	return "\\phantom{00} \\mathrm{time \\; step} \\; t";
    }

    get_tsccc_flot(i) {  // tsccc = traj seg color from color cycle
	return PlotTypeXT.flot_traj_seg_color_cycle[ i % PlotTypeXT.flot_traj_seg_color_cycle.length ];
    }

    // some ST's, e.g., IG, HS, plot multiple quantities, so we overwrite/ride default coloration and use color to identify **quantity** and, e.g., vertical lines to indicate **TrajSeg boundaries**
    overwrite_line_color(flot_arr, new_color_str) {  // operates on arrays returned from assemble_data_by_seg()

	for (let i = 0; i < (flot_arr.length - 1); i++) {  // skip first entry (which is black open circle representing current time)
	    flot_arr.at(i + 1).color = new_color_str;
	    if ("points" in flot_arr.at(i + 1)) {
		flot_arr.at(i + 1).points.fillColor = new_color_str;
	    }
	}
    }

    plot(t) {
	$.plot($("#" + this.get_html_targ_id_str()), this.get_flot_data_series(t), this.get_flot_gen_opts(t));
    }
}

/* OBSOLETE???  CONSIDER DELETING
class PlotTypeXT_custom extends PlotTypeXT {

    constructor(trj, html_targ, pw, ph, fgo) {

	super();
	this.trj = trj;
	this.html_targ_id_str = html_targ;
	this.plot_width = pw;
	this.plot_height = ph;
	this.flot_gen_opts = fgo;
    }

    get_html_targ_id_str() {
	return this.html_targ_id_str
    }

    get_plot_width() {
	return this.plot_width;
    }

    get_plot_height() {
	return this.plot_height;
    }

    get_ext_y_axis_lbl_str() {
	return "\\mathrm{ \\# \\; of \\; als}";
    }

    get_flot_data_series(t) {
	this.update_window();  // updates values of this.t_L/i/f/R; consider small class to encapsulate window t's and return it from call
	this.update_x_axis_flot(this.flot_gen_opts, this.t_L, this.t_R, this.trj.t_edge);
	let ytarr = [[0, "0"], [1, "1"], [2, "2"], [3, "3"], [4, "4"], [5, ""]];
	this.flot_gen_opts["yaxis"]["ticks"] = ytarr;//Array.from(Array(6), (e,i) => [i, ""]);// see set_xticks_intgr_flot()
	if (this.html_targ_id_str == "plot_flot_TEMP_3") {
	    this.flot_gen_opts["xaxis"]["ticks"] = Array.from(Array(26), (e,i) => [i, (((i % 2) == 0) ? ("" + i) : "")]);// see set_xticks_intgr_flot()
	} else {
	    this.flot_gen_opts["xaxis"]["ticks"] = Array.from(Array(26), (e,i) => [i, ""]);// see set_xticks_intgr_flot()
	}
	let fxn_obj = t => {return this.trj.get_x(t).x_indiv.get(0); };
	let fds = [];  // fds = flot_data_series
	this.assemble_data_by_seg(fds, fxn_obj, this.t_i, this.t_f);
	return fds;
    }

    get_flot_gen_opts(t) {
	return this.flot_gen_opts;
    }
}
*/

class PlotTypeXT_SP extends PlotTypeXT {

    constructor() {
	super();
    }

    get_flot_data_series(t) {

	this.update_window();  // updates values of this.t_L/i/f/R; consider small class to encapsulate window t's and return it from call
	this.update_x_axis_flot(this.flot_gen_opts, this.t_L, this.t_R, this.trj.t_edge);

	let fds = [];  // fds = flot_data_series; will be assembled over multiple calls to assemble_data_by_seg(), one per IEM
	for (let EMi = 0; EMi < Coords_SP.num_IEM.v; EMi++) {
	    let fxn_obj = t => {return this.trj.get_x(t).x_indiv.get(EMi); };
	    this.assemble_data_by_seg(fds, fxn_obj, this.t_i, this.t_f);
	}
	return fds;
    }

    get_flot_gen_opts(t) {
	return this.flot_gen_opts;
    }
}

class PlotTypeXT_SP_finite extends PlotTypeXT_SP {

    constructor(trj) {

	super();
	this.trj = trj;
	this.flot_gen_opts = copy(PlotTypeXT.flot_initial_gen_opts_XT);
	let y_min = (this.trj.mc.N >= 10) ? -1 : 0;  // if N is 10 or greater, push the y limits out by 1 for visual clarity
	let y_max = (this.trj.mc.N >= 10) ? this.trj.mc.N + 1 : this.trj.mc.N;  // if N is 10 or greater, push the y limits out by 1 for visual clarity
	this.set_ylim_flot(this.flot_gen_opts, y_min, y_max);
	//this.set_yticks_intgr_flot(this.flot_gen_opts, y_min, y_max);  // COMMENT OUT except for small N
	this.flot_gen_opts["yaxis"]["tickDecimals"] = 0;  // NOTE: yaxis only exists from previous commands
    }
}

class PlotTypeXT_SP_semiinf extends PlotTypeXT_SP {

    constructor(trj) {

	super();
	this.trj = trj;
	this.flot_gen_opts = copy(PlotTypeXT.flot_initial_gen_opts_XT);
	this.flot_gen_opts["yaxis"] = {};
	this.flot_gen_opts["yaxis"]["tickDecimals"] = 0;  // NOTE: the tick labeling may be a bit funky for the first few steps before there is spread/travel in ensemble
    }
}

class PlotTypeXT_RW extends PlotTypeXT_SP_finite {

    constructor(trj) {
	super(trj);
    }

    get_ext_y_axis_lbl_str() {
	return "\\mathrm{position} \\; \\; x(t)";
    }
}

class PlotTypeXT_MN extends PlotTypeXT_SP_finite {

    constructor(trj) {
	super(trj);
    }

    get_ext_y_axis_lbl_str() {
	return "\\mathrm{ \\# \\; individuals} \\; \\; x(t)";
    }
}

class PlotTypeXT_CH extends PlotTypeXT_SP_semiinf {

    constructor(trj) {
	super(trj);
    }

    get_ext_y_axis_lbl_str() {
	return "\\mathrm{ \\# \\; particles} \\; \\; x(t)";
    }
}

class PlotTypeXT_Gas extends PlotTypeXT {

    constructor() {

	super();

	this.T_T0_color = "#fabb00";
	this.eta_color = "#00aa00";
	this.Z_x_color = "#ff00ff";
	this.Z_y_color = "#00bbff";
	this.Z_color = "#0000ff";
	this.Z_SHY_color = "#ff0000";
    }

    // PlotTypeXT_Gas classes IG and HS generally require plotting multiple quantities, so we use color to identify **quantity** and vertical lines to indicate **TrajSeg boundaries**
    get_arr_seg_boundary_locs() {

	let loc_arr = [];
	let si_i = this.trj.get_si(this.t_i);  // determine si_i = segment index, initial
	let si_f = this.trj.get_si(this.t_f);  // determine si_f = segment index, final
	for (let si = si_i; si < si_f; si++) {
	    loc_arr.push(this.trj.segs[si].t_last + 0.5);
	}
	return loc_arr;
    }
}

class PlotTypeXT_IG extends PlotTypeXT_Gas {

    constructor(trj) {

	super();
	this.trj = trj;
	this.flot_gen_opts = copy(PlotTypeXT.flot_initial_gen_opts_XT);
	this.set_ylim_flot(this.flot_gen_opts, 0, 2);
    }

    get_ext_y_axis_lbl_str() {
	return "\\textcolor{" + this.T_T0_color + "}{ T / T_0 } \\, , \\; \\textcolor{" + this.Z_color + "}{Z}_{\\textcolor{" + this.Z_x_color + "}{x},\\textcolor{" + this.Z_y_color + "}{y}}";
    }

    get_flot_data_series(t) {

	this.update_window();  // updates values of this.t_L/i/f/R; consider small class to encapsulate window t's and return it from call
	this.update_x_axis_flot(this.flot_gen_opts, this.t_L, this.t_R, this.trj.t_edge);

	let fds = [];  // fds = flot_data_series

	// plot T / T_0
	let fxn_obj = t => {return this.trj.get_x(t).get_kT() / Params_IG.kT0; };
	let curr_arr = [];
	this.assemble_data_by_seg(curr_arr, fxn_obj, this.t_i, this.t_f);
	this.overwrite_line_color(curr_arr, this.T_T0_color);
	fds = fds.concat(curr_arr);

	// plot Z_x = P_x A / N <E>
	fxn_obj = t => {return this.trj.get_x(t).cps.Z_x_t_avg; };
	curr_arr = [];
	this.assemble_data_by_seg(curr_arr, fxn_obj, this.t_i, this.t_f);
	this.overwrite_line_color(curr_arr, this.Z_x_color);
	fds = fds.concat(curr_arr);

	// plot Z_y = P_y A / N <E>
	fxn_obj = t => {return this.trj.get_x(t).cps.Z_y_t_avg; };
	curr_arr = [];
	this.assemble_data_by_seg(curr_arr, fxn_obj, this.t_i, this.t_f);
	this.overwrite_line_color(curr_arr, this.Z_y_color);
	fds = fds.concat(curr_arr);

	// plot Z = (Z_x + Z_y) / 2
	fxn_obj = t => {return this.trj.get_x(t).cps.Z_t_avg; };
	curr_arr = [];
	this.assemble_data_by_seg(curr_arr, fxn_obj, this.t_i, this.t_f);
	this.overwrite_line_color(curr_arr, this.Z_color);
	fds = fds.concat(curr_arr);

	return fds;
    }

    get_flot_gen_opts(t) {
	return this.flot_gen_opts;
    }
}

class PlotTypeXT_HS extends PlotTypeXT_Gas {

    constructor(trj) {

	super();
	this.trj = trj;
	this.flot_gen_opts = copy(PlotTypeXT.flot_initial_gen_opts_XT);
	this.set_ylim_flot(this.flot_gen_opts, 0, 2.0);
    }

    get_ext_y_axis_lbl_str() {
	return "\\textcolor{" + this.T_T0_color + "}{ T / T_0 } \\, , \\; \\textcolor{" + this.eta_color + "}{{\\large \\eta}} \\, , \\; \\textcolor{" + this.Z_color + "}{Z}_{\\textcolor{" + this.Z_x_color + "}{x},\\textcolor{" + this.Z_y_color + "}{y}} \\, , \\; \\textcolor{" + this.Z_SHY_color + "}{Z / Z_{\\mathrm{SHY}}}";
    }

    get_flot_data_series(t) {

	this.update_window();  // updates values of this.t_L/i/f/R; consider small class to encapsulate window t's and return it from call
	this.update_x_axis_flot(this.flot_gen_opts, this.t_L, this.t_R, this.trj.t_edge);

	let fds = [];  // fds = flot_data_series

	// plot area fraction eta
	let fxn_obj = t => {return this.trj.get_x(t).get_area_frac(); };
	//let fxn_obj = t => {return this.trj.get_x(t).get_area(); };
	let curr_arr = [];  // used to manipulate smaller array pieces as they're added to fds
	this.assemble_data_by_seg(curr_arr, fxn_obj, this.t_i, this.t_f);
	this.overwrite_line_color(curr_arr, this.eta_color);
	fds = fds.concat(curr_arr);

	// plot T / T_0
	fxn_obj = t => {return this.trj.get_x(t).get_kT() / Params_HS.kT0; };
	curr_arr = [];
	this.assemble_data_by_seg(curr_arr, fxn_obj, this.t_i, this.t_f);
	this.overwrite_line_color(curr_arr, this.T_T0_color);
	fds = fds.concat(curr_arr);

	// plot Z_x = P_x A / N <E>
	fxn_obj = t => {return this.trj.get_x(t).cps.Z_x_t_avg; };
	curr_arr = [];
	this.assemble_data_by_seg(curr_arr, fxn_obj, this.t_i, this.t_f);
	this.overwrite_line_color(curr_arr, this.Z_x_color);
	fds = fds.concat(curr_arr);

	// plot Z_y = P_y A / N <E>
	fxn_obj = t => {return this.trj.get_x(t).cps.Z_y_t_avg; };
	curr_arr = [];
	this.assemble_data_by_seg(curr_arr, fxn_obj, this.t_i, this.t_f);
	this.overwrite_line_color(curr_arr, this.Z_y_color);
	fds = fds.concat(curr_arr);

	// plot Z = (Z_x + Z_y) / 2
	fxn_obj = t => {return this.trj.get_x(t).cps.Z_t_avg; };
	curr_arr = [];
	this.assemble_data_by_seg(curr_arr, fxn_obj, this.t_i, this.t_f);
	this.overwrite_line_color(curr_arr, this.Z_color);
	fds = fds.concat(curr_arr);

	// plot Z / Z_SHY
	fxn_obj = t => {return this.trj.get_x(t).cps.get_Z_SHY_t_avg(); };
	curr_arr = [];
	this.assemble_data_by_seg(curr_arr, fxn_obj, this.t_i, this.t_f);
	this.overwrite_line_color(curr_arr, this.Z_SHY_color);
	fds = fds.concat(curr_arr);

	return fds;
    }

    get_flot_gen_opts(t) {
	let opts = copy(this.flot_gen_opts);
	let seg_boundary_locs = this.get_arr_seg_boundary_locs();
	for (let i = 0; i < seg_boundary_locs.length; i++) {
	    this.add_vert_line_flot(opts, seg_boundary_locs[i], 10, "#dddddd");
	}
	return opts;
    }
}

class PlotTypeXT_LM extends PlotTypeXT {

    constructor(trj) {

	super();
	this.trj = trj;
	this.flot_gen_opts = copy(PlotTypeXT.flot_initial_gen_opts_XT);
	this.set_ylim_flot(this.flot_gen_opts, 0, 1);
    }

    get_ext_y_axis_lbl_str() {
	return "\\mathrm{fraction \\; of \\; pop. \\; capacity}";
    }

    get_flot_data_series(t) {
	this.update_window();  // updates values of this.t_L/i/f/R; consider small class to encapsulate window t's and return it from call
	this.update_x_axis_flot(this.flot_gen_opts, this.t_L, this.t_R, this.trj.t_edge);
	let fxn_obj = t => {return this.trj.get_x(t).x; };
	let fds = [];  // fds = flot_data_series
	this.assemble_data_by_seg(fds, fxn_obj, this.t_i, this.t_f);
	return fds;
    }

    get_flot_gen_opts(t) {

	let opts = copy(this.flot_gen_opts);  // copy from this.flot_gen_opts to retain y limits, etc.
	let curr_r = this.trj.segs[this.trj.get_si(t)].p.r;
	if (curr_r > 1.0) {
	    let r_osc_2 = 1.0 + Math.sqrt(6.0);  // ~= 3.44949
	    if (curr_r < r_osc_2) {  // if 3 < r < 3.44949, we plot horizontal lines for the two values that x will oscillate between
		let root_term = Math.sqrt((curr_r - 3.0) * (curr_r + 1.0));
		let curr_x_fixed_upper = 0.5 * (curr_r + 1.0 + root_term) / curr_r;
		let curr_x_fixed_lower = 0.5 * (curr_r + 1.0 - root_term) / curr_r;
		this.add_horiz_line_flot(opts, curr_x_fixed_upper, 1, "yellow");
		this.add_horiz_line_flot(opts, curr_x_fixed_lower, 1, "yellow");
	    }
	    let curr_x_fixed = (curr_r - 1.0) / curr_r;
	    this.add_horiz_line_flot(opts, curr_x_fixed, 1, "cyan");
	}
	return opts;
    }
}

class PlotTypeXT_GM extends PlotTypeXT {

    constructor(trj) {

	super();
	this.trj = trj;
	this.flot_gen_opts = copy(PlotTypeXT.flot_initial_gen_opts_XT);
	this.set_ylim_flot(this.flot_gen_opts, -4, 10);
	this.x_color = "#f07714";
	this.y_color = "#0044ff";
    }

    get_ext_y_axis_lbl_str() {
	return "\\textcolor{" + this.x_color + "}{ x(t) } , \\; \\; \\textcolor{" + this.y_color + "}{ y(t) }";
    }

    get_flot_data_series(t) {

	this.update_window();  // updates values of this.t_L/i/f/R; consider small class to encapsulate window t's and return it from call
	this.update_x_axis_flot(this.flot_gen_opts, this.t_L, this.t_R, this.trj.t_edge);

	let fds = [];  // fds = flot_data_series

	// plot x(t)
	let fxn_obj = t => {return this.trj.get_x(t).x; };
	let curr_arr = [];  // used to manipulate smaller array pieces as they're added to fds
	this.assemble_data_by_seg(curr_arr, fxn_obj, this.t_i, this.t_f);
	this.overwrite_line_color(curr_arr, this.x_color);
	fds = fds.concat(curr_arr);

	// plot y(t)
	fxn_obj = t => {return this.trj.get_x(t).y; };
	curr_arr = [];  // used to manipulate smaller array pieces as they're added to fds
	this.assemble_data_by_seg(curr_arr, fxn_obj, this.t_i, this.t_f);
	this.overwrite_line_color(curr_arr, this.y_color);
	fds = fds.concat(curr_arr);

	return fds;
    }

    get_flot_gen_opts(t) {
	return this.flot_gen_opts;
    }
}

