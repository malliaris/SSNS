
// helper class that represents a single node in the hierarchy of help pages
class HelpViewerNode {

    static breadcrumbs_pre = '<span style="white-space: nowrap; "><i class="fas fa-xs fa-angles-right px-2"></i>';
    static breadcrumbs_post = '</span><wbr>';

    constructor(id_str, child_arr) {

	this.id_str = id_str;
	this.child_arr = child_arr;
	this.breadcrumbs_html = "";  // will be filled during recursion
	this.header_txtNEW = ``;  // "declaration"; will be filled as data in node_data.js is processed
	this.md_txt_html = ``;  // "declaration"; will be filled as data in node_data.js is processed
	this.is_param_node = (this.id_str.substr(0, 5) == "HV_P_");  // id_str for a node/view corresponding to a system parameter begins "HV_P_..."
	this.is_ST_node = (this.id_str.substr(0, 6) == "HV_ST_");  // id_str for a node/view corresponding to a system type begins "HV_ST_..."
	//let header_txt = $("#" + this.id_str).attr('data-hvmh');  // grab stored text in custom data-hvmh attribute; hvmh = helper view modal header
	if (this.is_param_node) {  // nodes that represent system parameters are represented as LaTeX'd variables
	    this.header_html = katex.renderToString(this.header_txtNEW, {throwOnError: false});
	    /////////////console.log("NsNsNsNsNs", this.header_html);////////////
	} else {  // plain text for all others
	    this.header_html = this.header_txtNEW;
	}
	this.header_html_as_link = this.get_link_str(this.header_html);
	this.header_html_as_curr_page = '<span class="hv_curr_page">' + this.header_html + '</span>';
	if (this.is_ST_node) {  // if it's a node corresponding to a system type (ST), add ability to click icon that closes viewer and loads that ST
	    let ST_abbrev = this.id_str.substr(6, 7);  // e.g., "LM" for Logistic Map
	    this.header_html_as_curr_page += String.raw`<a class="hv_link" onclick="window.sim.ui.close_HV_load_ST('` + ST_abbrev + String.raw`'); ">`;
	    this.header_html_as_curr_page += '<i class="fas fa-fw fa-sm fa-up-right-from-square" data-fa-transform="right-3 down-2"></i></a>';
	}
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

    recurse_and_fill_data(hvn_map, breadcrumbs_arr) {

	//console.log("visiting", this.id_str);////////////
	hvn_map[this.id_str] = this;  // add this node to the map of nodes that will be used by HelpViewer
	this.breadcrumbs_html = this.get_breadcrumbs_html_frm_arr(breadcrumbs_arr);
	breadcrumbs_arr.push(this.header_html_as_link);  // append link to this node to breadcrumbs array
	if (this.child_arr.length > 0) {
	    for (let cn of this.child_arr.values()) {  // cn = child node
		cn.recurse_and_fill_data(hvn_map, breadcrumbs_arr);
	    }
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

    // this is "declared" here, but defined in network_structure.js; each new help viewer entry requires
    // (1) id_str and position in network specified in network_structure.js
    // (2) hvmh and html contents specified in node_data.js
    // anything else?
    static hvn_network;
    static hvn_lookup_mapNEW;
    
    constructor(sim, bsvs) {

	// basic/miscellaneous settings
	this.sim = sim;
	this.initial_view = "HV_P_ND_GM_y_0";// GAS_THEORY_COMPARISON GAS_MODELS CONCEPTS _P_SM_HS_v_pist";//    // default setting
	this.curr_view = "";
	this.prev_view = "";
	this.show_on_load = true;  // whether to show HelpViewer on app loading
	$("#md_container").on("hidden.bs.modal", function ()   { this.deployed = false;  });
	$("#md_container").on("shown.bs.modal", function ()   { this.deployed = true;  });

	// set image widths, first for all full width "fw", then the single screenshot; ALL LENGTHS ARE IN px UNLESS STATED OTHERWISE
	let fw_max_width = parseInt($("#hv_fw_img_max_width_px").val());  // read in max value, which is about width of mobile viewport
	let suggested_fw_width_based_on_viewport = roundn(0.90 * $(window).width(), 0);  // % of viewport width, rounded to integer # px
	let fw_width = Math.min(fw_max_width, suggested_fw_width_based_on_viewport);  // fill screen on smaller devices only
	$(".hv_fw_img").css("width", fw_width);
	let hv_ssns_screenshot_min_width = parseInt($("#hv_ssns_screenshot_min_width_px").val());  // read in screenshot min width val and...
	let hv_ssns_screenshot_width = (bsvs <= 3) ? hv_ssns_screenshot_min_width : fw_width;  // use it on xs, sm, and md viewports only
	$("#hv_ssns_screenshot").css("width", hv_ssns_screenshot_width);

	// use HelpViewer.hvn_network structure to recursively fill data fields, create map, etc.
	this.hvn_map = {};
	HelpViewer.hvn_network.recurse_and_fill_data(this.hvn_map, []);  // HelpViewer.hvn_network structure is assigned in network_structure.js (see note above)
	//console.log(this.hvn_map);///////////	
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
	let hvn = this.hvn_map[v];
	CU.sh("md_breadcrumbs", hvn.breadcrumbs_html);

	$("#md_txtNEW").html(hvn.md_txt_html);
	renderMathInElement(document.getElementById("md_txtNEW"), {delimiters: [{left: "$$", right: "$$", display: false}, {left: "%%", right: "%%", display: true}]});  // similar to call in <script> tag at top of SSNS.html


	//	console.log("RIRIRE", hvn.id_str, hvn.md_txt_html);  ////////////////
	//<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js" onload='renderMathInElement(document.body, {delimiters: [{left: "$$", right: "$$", display: false}, {left: "%%", right: "%%", display: true}]}); '>
	//static sk(str_id, tex_str) {katex.render(tex_str, document.getElementById(str_id), {throwOnError: false});}
	// renderMathInElement(document.body, {delimiters: [{left: "$$", right: "$$", display: false}, {left: "%%", right: "%%", display: true}]});


	//CU.sk("md_txtNEW", hvn.md_txt_html);
	//$("#md_txtNEW").html(katex.renderToString(hvn.md_txt_html, {throwOnError: false}));
	//$("#" + v).show();
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

	//console.log(hvn.get_all_child_links());  ////////////////
    }
}
