//
// Help Viewer (HV) System
//
// files: help_viewer.js, network_structure.js, node_data.js
//
// * help_viewer.js contains HelpViewerNode and HelpViewer classes and all non-trivial code
// * network_structure.js contains individual nodes (HelpViewerNode constructors with corresponding id_str names) and HV network hierarchical structure
// * node_data.js contains HelpViewerNode data (header_txt and md_txt_html)
//
// this file: network_structure.js
//
// * static members HelpViewer.hvn_network and HelpViewer.hvn_lookup_map "declared" in help_viewer.js but defined here
// * HelpViewer.hvn_network defined here as the root node of the HV network
// * HelpViewer.hvn_lookup_map defined and populated in 2 lines at bottom of the file
//

HelpViewer.hvn_network =

new HelpViewerNode("HV_HOME", [

    new HelpViewerNode("HV_USING", [

	new HelpViewerNode("HV_PLOT_AREA", []),
	new HelpViewerNode("HV_MAIN_PANEL", []),
	new HelpViewerNode("HV_C_CONTINUOUS_CMDS", []),
	new HelpViewerNode("HV_PRMS_DROPDOWN", []),
	new HelpViewerNode("HV_CTRL_DROPDOWN", [

	    new HelpViewerNode("HV_C_ONE_STEP_CMDS", []),
	    new HelpViewerNode("HV_C_PLOT_TYPES", []),
	    new HelpViewerNode("HV_C_T_DT_JUMP", []),
	    new HelpViewerNode("HV_C_DELAY_WINDOW", []),
	    new HelpViewerNode("HV_C_T_0_MAX_STOP", []),
	    new HelpViewerNode("HV_C_RNG_RECR_TRAJ", []),
	    new HelpViewerNode("HV_C_SP_ENSEMBLE", []),
	    new HelpViewerNode("HV_C_RELOAD_CMDS", []),

	]),

	new HelpViewerNode("HV_SYS_DROPDOWN", []),
	new HelpViewerNode("HV_HELP_VIEWER", []),

    ]),

    new HelpViewerNode("HV_COMPUTATION", [

	new HelpViewerNode("HV_CODE_DESIGN", []),
	new HelpViewerNode("HV_CODE_ORGANIZATION", []),
	new HelpViewerNode("HV_CODE_DEPENDENCIES", []),
	new HelpViewerNode("HV_CODE_IO", []),
	new HelpViewerNode("HV_CODE_FUTURE", []),
	new HelpViewerNode("HV_E_T_MAX_REACHED", []),
	new HelpViewerNode("HV_E_NOT_IMPLEMENTED", []),

    ]),

    new HelpViewerNode("HV_CONCEPTS", [

	new HelpViewerNode("HV_ENSEMBLES", []),
	new HelpViewerNode("HV_MARKOV_ONE_STEP", []),
	new HelpViewerNode("HV_SPIN_SYSTEMS", []),
	new HelpViewerNode("HV_PHASE_TRANSITIONS", []),
	new HelpViewerNode("HV_GAS_MODELS", []),
	new HelpViewerNode("HV_GAS_THEORY_COMPARISON", []),

	new HelpViewerNode("HV_SA_SP", [

	    new HelpViewerNode("HV_ST_RW", [

		new HelpViewerNode("HV_P_SP_RW_l_r", []),
		new HelpViewerNode("HV_P_SP_RW_N", []),
		new HelpViewerNode("HV_P_SP_RW_x_0", []),

	    ]),

	    new HelpViewerNode("HV_ST_MN", [

		new HelpViewerNode("HV_P_SP_MN_mu", []),
		new HelpViewerNode("HV_P_SP_MN_s", []),
		new HelpViewerNode("HV_P_SP_MN_N", []),
		new HelpViewerNode("HV_P_SP_MN_x_0", []),

	    ]),

	    new HelpViewerNode("HV_ST_CH", [

		new HelpViewerNode("HV_P_SP_CH_alpha", []),
		new HelpViewerNode("HV_P_SP_CH_beta", []),
		new HelpViewerNode("HV_P_SP_CH_x_0", []),

	    ]),

	]),

	new HelpViewerNode("HV_SA_SM", [

	    new HelpViewerNode("HV_ST_IG", [

		new HelpViewerNode("HV_P_SM_IG_N", []),
		new HelpViewerNode("HV_P_SM_IG_V", []),
		new HelpViewerNode("HV_P_SM_IG_kT0", []),
		new HelpViewerNode("HV_P_SM_IG_BC", []),

	    ]),

	    new HelpViewerNode("HV_ST_HS", [

		new HelpViewerNode("HV_P_SM_HS_N", []),
		new HelpViewerNode("HV_P_SM_HS_IC", []),
		new HelpViewerNode("HV_P_SM_HS_rho", []),
		new HelpViewerNode("HV_P_SM_HS_R", []),
		new HelpViewerNode("HV_P_SM_HS_kT0", []),
		new HelpViewerNode("HV_P_SM_HS_v_pist", []),

	    ]),

	    new HelpViewerNode("HV_ST_IS", [

		new HelpViewerNode("HV_P_SM_IS_T", []),
		new HelpViewerNode("HV_P_SM_IS_h", []),
		new HelpViewerNode("HV_P_SM_IS_N", []),

	    ]),

	    new HelpViewerNode("HV_ST_XY", [

		new HelpViewerNode("HV_P_SM_XY_T", []),
		new HelpViewerNode("HV_P_SM_XY_h", []),
		new HelpViewerNode("HV_P_SM_XY_N", []),

	    ]),

	]),

	new HelpViewerNode("HV_SA_ND", [

	    new HelpViewerNode("HV_ST_LZ", []),
	    new HelpViewerNode("HV_ST_LM", [

		new HelpViewerNode("HV_P_ND_LM_IC", []),
		new HelpViewerNode("HV_P_ND_LM_r", []),
		new HelpViewerNode("HV_P_ND_LM_x_0", []),

	    ]),

	    new HelpViewerNode("HV_ST_GM", [

		new HelpViewerNode("HV_P_ND_GM_IC", []),
		new HelpViewerNode("HV_P_ND_GM_x_0", []),
		new HelpViewerNode("HV_P_ND_GM_y_0", []),

	    ]),

	]),

	new HelpViewerNode("HV_SA_FD", [

	    new HelpViewerNode("HV_ST_SH", [

		new HelpViewerNode("HV_P_FD_SH_N", []),
		new HelpViewerNode("HV_P_FD_SH_rho", []),
		new HelpViewerNode("HV_P_FD_SH_p", []),

	    ]),

	    new HelpViewerNode("HV_ST_PF", [

		new HelpViewerNode("HV_P_FD_PF_Dpol", []),
		new HelpViewerNode("HV_P_FD_PF_Ut", []),
		new HelpViewerNode("HV_P_FD_PF_Ub", []),
		new HelpViewerNode("HV_P_FD_PF_mu", []),
		new HelpViewerNode("HV_P_FD_PF_Ds", []),
		new HelpViewerNode("HV_P_FD_PF_N", []),

	    ]),

	]),
    ]),

]);

HelpViewer.hvn_lookup_map = {};
HelpViewer.hvn_network.recurse_to_create_lookup_map(HelpViewer.hvn_lookup_map);
