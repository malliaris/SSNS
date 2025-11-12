//
// Help Viewer (HV) System
//
// files: help_viewer.js, network_structure.js, node_data.js
//
// * help_viewer.js contains HelpViewerNode and HelpViewer classes and all non-trivial code
// * network_structure.js contains individual nodes (HelpViewerNode constructors with corresponding id_str names) and HV network hierarchical structure
// * node_data.js contains HelpViewerNode data (header_txt and md_txt_html)
//
// this file: help_viewer.js
//
// * a HelpViewerNode has an id_str name; this used to correspond to the id attribute of a div in SSNS.html, but now is just a unique identifier
// * a HelpViewerNode has a child_arr array of children HelpViewerNode's; several routines rely on recursion
// * static members HelpViewer.hvn_network and HelpViewer.hvn_lookup_map "declared" here but defined in network_structure.js; they must be static
//   since the (single instance) HelpViewer object will not even exist when the assignments and populating in the other two files take place
//

// helper class that represents a single node in the hierarchy of help pages
class HelpViewerNode {

    static breadcrumbs_pre = '<span style="white-space: nowrap; "><i class="fas fa-xs fa-angles-right px-2"></i>';
    static breadcrumbs_post = '</span><wbr>';

    constructor(id_str, child_arr) {

	this.id_str = id_str;
	this.child_arr = child_arr;
	this.header_txt;  // "declaration"; will be filled as data in node_data.js is processed
	this.md_txt_html;  // "declaration"; will be filled as data in node_data.js is processed
	this.header_html;  // "declaration"; will be filled in recurse_and_generate_header_breadcrumbs_html()
	this.header_html_as_link;  // "declaration"; will be filled in recurse_and_generate_header_breadcrumbs_html()
	this.header_html_as_curr_page;  // "declaration"; will be filled in recurse_and_generate_header_breadcrumbs_html()
	this.breadcrumbs_html;  // "declaration"; will be filled in recurse_and_generate_header_breadcrumbs_html()
	this.is_param_node = (this.id_str.substr(0, 5) == "HV_P_");  // id_str for a node/view corresponding to a system parameter begins "HV_P_..."
	this.is_ST_node = (this.id_str.substr(0, 6) == "HV_ST_");  // id_str for a node/view corresponding to a system type begins "HV_ST_..."
    }

    get_link_str(str_to_wrap) {
	return String.raw`<a class="hv_link" onclick="window.sim.ui.hv.show_view('` + this.id_str + String.raw`'); ">` + str_to_wrap + String.raw`</a>`;
    }

    // all are links except the last one which is the current node, i.e., the one being viewed
    get_breadcrumbs_html_frm_arr(breadcrumbs_arr) {
	let arr_to_iter = breadcrumbs_arr.concat(this.header_html_as_curr_page);  // append html for current page
	arr_to_iter = arr_to_iter.slice(1);  // trim first element, which is root node Home (handled separately)
	let result_html = "";
	for (let node_html of arr_to_iter.values()) {
	    result_html += HelpViewerNode.breadcrumbs_pre + node_html + HelpViewerNode.breadcrumbs_post;
	}
	return result_html;
    }

    get_all_child_links() {
	let child_links_html = "";
	for (let cn of this.child_arr.values()) {  // cn = child node
	    child_links_html += cn.header_html_as_link + "<br/>\n";
	}
	return child_links_html;
    }

    recurse_to_create_lookup_map(hvn_map) {

	hvn_map[this.id_str] = this;  // add this node to the map of nodes that will be used by HelpViewer
	for (let cn of this.child_arr.values()) {  // cn = child node
	    cn.recurse_to_create_lookup_map(hvn_map);
	}
    }

    recurse_and_generate_header_breadcrumbs_html(breadcrumbs_arr) {

	// create header html
	if (this.is_param_node) {  // nodes that represent system parameters are represented as LaTeX'd variables
	    this.header_html = katex.renderToString(this.header_txt, {throwOnError: false});
	} else {  // plain text for all others
	    this.header_html = this.header_txt;
	}
	this.header_html_as_link = this.get_link_str(this.header_html);
	this.header_html_as_curr_page = '<span class="hv_curr_page">' + this.header_html + '</span>';
	if (this.is_ST_node) {  // if it's a node corresponding to a system type (ST), add ability to click icon that closes viewer and loads that ST
	    let ST_abbrev = this.id_str.substr(6, 7);  // e.g., "LM" for Logistic Map
	    this.header_html_as_curr_page += String.raw`<a class="hv_link" onclick="window.sim.ui.close_HV_load_ST('` + ST_abbrev + String.raw`'); ">`;
	    this.header_html_as_curr_page += '<i class="fas fa-fw fa-sm fa-up-right-from-square" data-fa-transform="right-3 down-2"></i></a>';
	}

	// create breadcrumbs html
	this.breadcrumbs_html = this.get_breadcrumbs_html_frm_arr(breadcrumbs_arr);
	breadcrumbs_arr.push(this.header_html_as_link);  // append link to this node to breadcrumbs array
	for (let cn of this.child_arr.values()) {  // cn = child node
	    cn.recurse_and_generate_header_breadcrumbs_html(breadcrumbs_arr);
	}
	breadcrumbs_arr.pop();  // remove this node's link now that recursion involving this node is complete
    }
}




// helper class to coordinate storage and display of help pages
//
// * single instance exists within UserInterface object
// * the (very rudimentary) back button utilizes a page history of length 1, i.e., just the previously visited page;
//   note that this means two consecutive presses, and you're already "bouncing" between the same two pages!
class HelpViewer {

    static hvn_network;  // see notes at top of this file
    static hvn_lookup_map;  // see notes at top of this file
    
    constructor(sim, bsvs) {

	// basic/miscellaneous settings
	this.sim = sim;
	this.initial_view = "HV_GAS_THEORY_COMPARISON";// GAS_THEORY_COMPARISON GAS_MODELS CONCEPTS _P_SM_HS_v_pist";//    // default setting
	this.curr_view = "";
	this.prev_view = "";
	this.show_on_load = false;  // whether to show HelpViewer on app loading
	$("#md_container").on("hidden.bs.modal", function ()   { this.deployed = false;  });
	$("#md_container").on("shown.bs.modal", function ()   { this.deployed = true;  });

	// now that recurse_to_create_lookup_map() in network_structure.js and header_txt insertions in node_data.js are complete, we can generate the derived html bits...
	HelpViewer.hvn_network.recurse_and_generate_header_breadcrumbs_html([]);

	// set image widths, first for all full width "fw", then the single screenshot; ALL LENGTHS ARE IN px UNLESS STATED OTHERWISE
	let fw_max_width = parseInt($("#hv_fw_img_max_width_px").val());  // read in max value, which is about width of mobile viewport
	let suggested_fw_width_based_on_viewport = roundn(0.90 * $(window).width(), 0);  // % of viewport width, rounded to integer # px
	this.fw_width = Math.min(fw_max_width, suggested_fw_width_based_on_viewport);  // fill screen on smaller devices only
	let hv_ssns_screenshot_min_width = parseInt($("#hv_ssns_screenshot_min_width_px").val());  // read in screenshot min width val and...
	this.hv_ssns_screenshot_width = (bsvs <= 3) ? hv_ssns_screenshot_min_width : this.fw_width;  // use it on xs, sm, and md viewports only

	if (this.show_on_load) {  // if indicated, show HelpViewer on app loading
	    this.show_view(this.initial_view);
	}
    }

    help_btn_pressed() {  // remember last shown view, or show Home

	if (this.curr_view == "") {
	    this.show_view('HV_HOME');
	} else {
	    $("#md_container").modal("show");
	}
    }

    show_view(v) {

	this.sim.rs.set_NR();  // exit from any running mode while using help viewer

	// hide outgoing view if it is showing
	if (this.curr_view != "") {
	    $("#" + this.curr_view).hide();
	}
	$('#md_container').modal('handleUpdate');  // reload modal to "scroll to top" of page about to be shown
	
	// update appearance/behavior of Home icon
	if (v == "HV_HOME") {
	    $("#hv_home_icon").removeClass("hv_link");
	    $("#hv_home_icon").addClass("hv_home_curr");
	} else {
	    $("#hv_home_icon").removeClass("hv_home_curr");
	    $("#hv_home_icon").addClass("hv_link");
	}

	// show incoming view (and modal, if it's hidden)
	let hvn = HelpViewer.hvn_lookup_map[v];
	CU.sh("md_breadcrumbs", hvn.breadcrumbs_html);
	$("#md_txt").html(hvn.md_txt_html);
	renderMathInElement(document.getElementById("md_txt"), {delimiters: [{left: "$$", right: "$$", display: false}, {left: "%%", right: "%%", display: true}]});  // similar to call in <script> tag at top of SSNS.html
	$(".hv_fw_img").css("width", this.fw_width);  // set width of any image in inserted modal html
	$("#hv_ssns_screenshot").css("width", this.hv_ssns_screenshot_width);  // set width of any image in inserted modal html
	if ( ! this.deployed) $("#md_container").modal("show");

	// if we're about to gain our one step of "history," enable back button (a one-time transition)
	if ((this.prev_view == "") && (this.curr_view != "")) {
	    $("#hv_back_btn_link").removeClass("hv_disabled_link");
	    $("#hv_back_btn_link").addClass("hv_link");
	}

	// update view variables and back button link
	this.prev_view = this.curr_view;  // save outgoing view to update back button
	this.curr_view = v;  // save incoming view
	if (this.prev_view != "") {  // update back button
	    $("#hv_back_btn_link").attr("onclick", "window.sim.ui.hv.show_view('" + this.prev_view + "'); ");
	}
    }
}
