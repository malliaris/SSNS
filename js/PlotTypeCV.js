
///////////////////////////////////////////////////////////////////////////////////////////////
////////  PlotTypeCV_*  ///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
////////  a PlotType that is built on the HTML Canvas "CV" element using basic shapes, etc.  //
///////////////////////////////////////////////////////////////////////////////////////////////

class PlotTypeCV extends PlotType {

    constructor() {

	super();

	this.canv_dim = undefined;  // "declaration" (set within)
    }

    get_plot_width() {
	return this.canv_dim;
    }

    get_plot_height() {
	return this.canv_dim;
    }

    setup_canvas() {
	//this.cc = document.getElementById(this.get_html_targ_id_str()).getContext("2d", { alpha: false });  // NOTE: not sure why "{ alpha: false }" was present...copied from internet?...was causing unwanted black background!
	this.cc = document.getElementById(this.get_html_targ_id_str()).getContext("2d");  // cc = canvas context, for plotting calls
	$("#" + this.get_html_targ_id_str()).attr("width", this.canv_dim);   // NOTE: CV canvas plot_targets use **attr* not *css* for h/w
	$("#" + this.get_html_targ_id_str()).attr("height", this.canv_dim);  // NOTE: CV canvas plot_targets use **attr* not *css* for h/w
    }

    clear_canvas() {
	this.cc.clearRect(0, 0, this.canv_dim, this.canv_dim);
    }

    // take x, y coordinates and radius R -- all in relative units, i.e., on the unit square -- and draw corresponding circle on canvas
    draw_circle(x, y, R, filled, color) {

	let xc = this.rtoa(x);
	let yc = this.fyc(this.rtoa(y));
	let Rc = this.rtoa(R);

	this.cc.beginPath();
	this.cc.arc(xc, yc, Rc, 0, 2*Math.PI);
	if (filled) {
	    this.cc.fillStyle = color;
	    this.cc.fill();
	} else {  // outlined
	    this.cc.strokeStyle = color;
	    this.cc.stroke();
	}
    }

    draw_circleNEW(x, y, R) {

	let xc = this.rtoa(x);
	let yc = this.fyc(this.rtoa(y));
	let Rc = this.rtoa(R);

	this.cc.beginPath();
	this.cc.arc(xc, yc, Rc, 0, 2*Math.PI);
	this.cc.fill();
    }

    // take x coordinate and width w -- all in relative units, i.e., on the unit square -- and draw corresponding vertical line on canvas
    draw_vertical_line(x, w, color) {

	let xc = this.rtoa(x);
	let wc = this.rtoa(w);

	this.cc.beginPath();
	this.cc.moveTo(xc, this.rtoa(0));  // line at xc from y == 0 (bottom of container)...
	this.cc.lineTo(xc, this.rtoa(1));  // to y == 1 (top of container)
	this.cc.lineWidth = wc;
	this.cc.strokeStyle = color;
	this.cc.stroke();
    }

    // rtoa = relative to absolute; utility to transform coordinate from value on [0, 1] to [0, canvas_size]
    rtoa(rc) {
	return this.canv_dim * rc;
    }

    // ator = absolute to relative; utility to transform coordinate from value on [0, canvas_size] to [0, 1]
    ator(ac) {
	return ac / this.canv_dim;
    }

    // fyc = flip y coordinate; utility to transform (absolute) y coordinate so that the origin for x,y is lower left corner
    fyc(yc) {
	return this.canv_dim - yc;
    }
}

class PlotTypeCV_Gas extends PlotTypeCV {

    constructor(trj) {

	super();

	this.trj = trj;
	this.canv_dim = PlotType.square_plot_width;
	this.setup_canvas();
    }

    get_ext_x_axis_lbl_str() {
	return "x";
    }

    get_ext_y_axis_lbl_str() {
	return "y";
    }

    get_html_targ_id_str() {
	return "plot_CV_Gas";
    }

    plot(t) {
	this.update_canvas(t);
    }
}

class PlotTypeCV_IG extends PlotTypeCV_Gas {

    constructor(trj) {
	super(trj);
    }

    update_canvas(t) {

	this.clear_canvas();
	for (let i = 0; i < this.trj.get_x(t).particles.length; i++) {

	    let cp = this.trj.get_x(t).particles[i];  // cp = current particle
	    this.draw_circle(cp.x, cp.y, cp.R, true, "black");
	}
    }
}

class PlotTypeCV_HS extends PlotTypeCV_Gas {

    constructor(trj) {
	super(trj);
    }

    static get_rho_greyscale_str_from_0_1_val(v) {
	let vstr = (roundn(255.0 * (1.0 - v), 0)).toString();
	//return "rgba(" + vstr + ", " + vstr + ", " + vstr + ", 1)";  // 4th argument is opacity?
	return "rgb(" + vstr + ", " + vstr + ", " + vstr + ")";
    }

    update_canvas(t) {

	this.clear_canvas();
	let curr_rho_val_i;  // to track changing of density values (and, therefore, colors) in loop below
	for (let i = 0; i < this.trj.get_x(t).particles.length; i++) {

	    let cp = this.trj.get_x(t).particles[i];  // cp = current particle

	    if (Params_HS.draw_tiny_particles_artificially_large && (Params_HS.R < 0.002)) {

		this.draw_circle(cp.x, cp.y, 0.01, false, "black");

	    } else {

		// determine particle fill color
		// NOTE: the SSNS HS code is organized so that the number of different particle colors is ~1, and so that all particles of a given color are drawn in succession,
		//       thus limiting calls to set fillStyle for efficiency; we tried a different color for each particle, and it's **really** slow for large N!
		if (cp.rho_val_i != curr_rho_val_i) {  // if we've just started a new block of density values...
		    this.cc.fillStyle = Params_HS.rho_greyscale_val_strs[cp.rho_val_i];
		    curr_rho_val_i = cp.rho_val_i;  // store the new rho_val_i
		}  // else, no need to change fillStyle color (see note above)

		if ((i == 0) && Params_HS.color_tracker_particle) {  // the one exception is the tracker particle, if enabled
		    this.cc.fillStyle = "red";  // in which we overwrite color...
		}

		this.draw_circleNEW(cp.x, cp.y, cp.R);
		//this.draw_circle(cp.x, cp.y, cp.R, true, "black");

		if ((i == 0) && Params_HS.color_tracker_particle) {  // ... and change it back
		    this.cc.fillStyle = Params_HS.rho_greyscale_val_strs[cp.rho_val_i];
		}
	    }
	}
	let x_piston = 1.0 - this.trj.get_x(t).x_RW;  // subtract since piston's coordinate system has origin at zero compression
	this.draw_vertical_line(x_piston, 0.001, "black");  // WHY is line appearing grey when thickness is very small??
    }
}

// NOTE: heatmaps are rendered on an html canvas and maintain state, so their get_html_targ_id_str() must be ST-dependent... explain this a bit more
class PlotTypeCV_Spin extends PlotTypeCV {

    constructor(trj) {

	super();

	this.trj = trj;
	if (!this.get_color_from_spin_val) throw new Error("Derived PlotTypeCV must define get_color_from_spin_val()");
	this.tile_dim = undefined;  // "declaration" (set within)
	this.determine_tile_canv_dims(this.trj.mc.N);
    }

    determine_tile_canv_dims(N) {
	let rough_tile_dim = Math.floor(PlotType.square_plot_width / N);  // "target" a plot dim that is just under PlotType.square_plot_width
	this.tile_dim = parseInt(Math.max(rough_tile_dim, 1.0));  // require at least 1 pixel per tile (which may put plot dim above target!)
	this.canv_dim = this.tile_dim * N;
    }

    set_pixel(x, y, v) {

	let xc = y * this.tile_dim;  // xc = x on canvas; NOTE THE TRANSPOSE OPERATION y --> xc and x --> yc
	let yc = x * this.tile_dim;  // yc = y on canvas; NOTE THE TRANSPOSE OPERATION y --> xc and x --> yc
	this.cc.fillStyle = this.get_color_from_spin_val(v);
	this.cc.fillRect(xc, yc, this.tile_dim, this.tile_dim);
    }

    draw_entire_canv_from_spin_arr(sa) {

	for (let x = 0; x < sa.shape[0]; x++) {
	    for (let y = 0; y < sa.shape[1]; y++) {
		this.set_pixel(x, y, sa.get(x, y));
	    }
	}
    }

    setup_spin_array() {
	let init_sa = this.trj.get_x(this.trj.t_0).spins;  // spin array associated with initial time step t_0 used to initialize canvas
	this.draw_entire_canv_from_spin_arr(init_sa);
	this.last_t_displayed = this.trj.t_0;
    }
    
    update_canvas(t) {

	let moving_fwd = (this.last_t_displayed < t);
	if (moving_fwd) {
	    for (let s = this.last_t_displayed; s < t; s++) {
		let nt = this.trj.get_x(s).next_trans;  // nt = next transition object (for coords at time s)
		if (nt.move_occurred) {
		    this.set_pixel(nt.x, nt.y, nt.new_val);
		}
	    }
	} else {  // moving backward (or at t == this.last_t_displayed, in which case for loop will execute 0 times)
	    for (let s = this.last_t_displayed; s > t; s--) {
		let pt = this.trj.get_x(s).prev_trans;  // pt = previous transition object (for coords at time s)
		if (pt.move_occurred) {
		    this.set_pixel(pt.x, pt.y, pt.old_val);
		}
	    }
	}
	this.last_t_displayed = t;  // update for next call
    }

    get_ext_x_axis_lbl_str() {
	return "\\mathrm{spin} \\hspace{0.4em} x \\hspace{0.4em} \\mathrm{index}";
    }

    get_ext_y_axis_lbl_str() {
	return "\\mathrm{spin} \\hspace{0.4em} y \\hspace{0.4em} \\mathrm{index}";
    }

    plot(t) {
	this.update_canvas(t);
    }
}

class PlotTypeCV_IS extends PlotTypeCV_Spin {

    constructor(trj) {

	super(trj);

	this.trj = trj;
	this.setup_canvas();
	this.setup_spin_array();
    }

    get_html_targ_id_str() {
	return "plot_CV_IS";  // heatmaps are rendered on an html canvas and maintain state, so must be ST-dependent
    }

    get_color_from_spin_val(v) {  // translates a numeric spin value into an html color string

	return ((v == 0) ? "hsl(29, 85%, 44%)" : "hsl(52, 100%, 51%)");  // dark orange hsl(29, 85%, 44%), bright yellow hsl(52, 100%, 51%)
    }
}

class PlotTypeCV_XY extends PlotTypeCV_Spin {

    constructor(trj) {

	super(trj);

	this.trj = trj;
	this.setup_canvas();
	this.setup_spin_array();
    }

    get_html_targ_id_str() {
	return "plot_CV_XY";  // heatmaps are rendered on an html canvas and maintain state, so must be ST-dependent
    }

    get_color_from_spin_val(v) {  // translates a numeric spin value into an html color string

	let hue_val = v * 360.0;  // convert fraction of revolution --> degrees
	let hsl_str = "hsl(" + hue_val + ", 55%, 50%)";
	return hsl_str;
    }
}

class PlotTypeCV_PF extends PlotTypeCV {

    constructor(trj) {

	super();

	this.trj = trj;
	this.canv_dim = PlotType.square_plot_width;
	this.setup_canvas();
	this.determine_slab_height_and_lineWidth();
    }

    determine_slab_height_and_lineWidth() {
	let rough_slab_height = parseInt(Math.floor(PlotType.square_plot_width / Params_PF.v_dim));
	this.slab_height = parseInt(Math.max(rough_slab_height, 3));  // require at least 3 pixels per slab (which may put plot dim above target!)
	let rough_lineWidth = parseInt(Math.floor(0.4 * this.slab_height));
	this.cc.lineWidth = parseInt(Math.min(rough_lineWidth, this.slab_height - 2));  // require at least 3 pixels per slab
	//console.log("slab_height, lineWidth, plot-width =", this.slab_height, this.cc.lineWidth, PlotType.square_plot_width);
    }

    get_ext_x_axis_lbl_str() {
	return "\\mathrm{ slab \\; position } \\; x \\; \\mathrm{(m)}";
    }

    get_ext_y_axis_lbl_str() {
	return "y \\; \\mathrm{(m)}";
    }

    get_html_targ_id_str() {
	return "plot_CV_PF";
    }

    update_canvas(t) {

	this.clear_canvas();

	for (let i = 0; i < Params_PF.v_dim; i++) {

	    //this.add_horiz_line_flot(opts, 0.0, 3, "#777777");
	    let slab_color; let dash_color;  // set below
	    // dark orange hsl(29, 85%, 44%), bright yellow hsl(52, 100%, 51%)
	    if ((i % 2) == 0) {
		slab_color = "hsl(29, 85%, 44%)";
	    } else {
		slab_color = "hsl(52, 100%, 51%)";
	    }
	    if ((i == 0) || (i == Params_PF.v_dim - 1)) {
		dash_color = "hsl(0, 0%, 30%)";  // grey dashes for the boundary slabs
	    } else {
		dash_color = "hsl(0, 0%, 100%)";  // white dashes for the system slabs
	    }

	    let y_line = (i + 0.5)*this.slab_height;  // 0.5 since lineTo needs **center** of line as coordinate

	    this.cc.fillStyle = slab_color;
	    this.cc.fillRect(0.0, i*this.slab_height, PlotType.square_plot_width, this.slab_height);  // fillRect needs **corner/width/height** coordinates

	    // dashed line drawn **by specifying/drawing white/grey stretches**, not the color stretches
	    this.cc.strokeStyle = dash_color;

	    let curr_slab_x = this.trj.get_x(t).xs.get(i) % 60;  // x position of the ith slab, "wrapped" modulo 60 = 33 + 7 + 3 + 7 + 3 + 7
	    //this.cc.setLineDash([33, 7, 3, 7, 3, 7]);  // from when we drew in slab_color
	    this.cc.setLineDash([0, 33, 7, 3, 7, 3, 7, 0]);  // draw FORWARD in white, with slab_color showing in between from fillRect()
	    this.cc.beginPath();
	    this.cc.moveTo(curr_slab_x, y_line);  // from curr_slab_x...
	    this.cc.lineTo(PlotType.square_plot_width, y_line);  // ... to the right edge
	    this.cc.stroke();

	    this.cc.setLineDash([7, 3, 7, 3, 7, 33]);  // draw BACKWARD in white, with slab_color showing in between from fillRect()
	    this.cc.beginPath();
	    this.cc.moveTo(curr_slab_x, y_line);  // from curr_slab_x...
	    this.cc.lineTo(0, y_line);  // ... to the left edge (with REVERSED dash pattern)
	    this.cc.stroke();
	}
    }

    plot(t) {
	this.update_canvas(t);
    }
}

