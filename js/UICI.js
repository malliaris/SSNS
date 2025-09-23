
// UICI: User Interface Cycle Input
// helper class that connects a button in the UI with an internal parameter (in Params classes, etc.);
// each press of the button cycles the parameter to the next of a fixed sequence of values;
// e.g., a 2 value cycle UICI would just be a toggle button
class UICI {

    constructor(ui, vals, id_str_stem, img_pre, img_post, indicate_params_changed) {

	//if (!this.yields_valid_value) throw new Error("Derived UICI must define yields_valid_value()");
	this.ui = ui;  // needed for this.ui.indicate_new_param_vals_ready_to_pull_UI_to_traj();
	this.vals = vals;
	this.id_str_stem = id_str_stem;
	this.val_id_str = this.id_str_stem + "_UICI_val";
	this.img_id_str = this.id_str_stem + "_UICI_img";
	this.img_pre = img_pre;
	this.img_post = img_post;
	this.indicate_params_changed = indicate_params_changed;

	this.v;  // holds the current value as an array index
	this.sv(0);  // the default value is the 0th, and the UICI cycles from there, e.g., 0 --> 1 --> 2 --> 0 ...
    }

    sv(val) {  // sv = set value method sets both internal variable and interface variable, thus keeping the two in sync

	this.v = val;
	CU.sk(this.val_id_str, this.vals[this.v]);
	let img_num_str = (this.v + 1).toString();  // v is 0-based, but image filenames are 1-based
	let img_path_str = this.img_pre + img_num_str + this.img_post;
	$("#" + this.img_id_str).attr("src", img_path_str);
    }

    cycle() {  // called, e.g., by "onClick()" in HTML button element

	let new_v = (this.v + 1) % this.vals.length;
	this.sv(new_v);

	//console.log("INFO:\t" + this.id_str + " try_update() failed to parse a valid number... restoring previous valid value to UI...");
    }

    push_to_UI(val) {  // take an already validated value (perhaps from a Params_*) and push to UI input
	this.sv(val);
    }
}

//class UICI_int extends UICI {
