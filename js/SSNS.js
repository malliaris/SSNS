///////////////////////////////////////////////////////////////////////////////////////////////
////////  SSNS          ///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
////////  Javascript code for Simple Stochastic and Nonlinear Simulator (SSNS)  ///////////////
///////////////////////////////////////////////////////////////////////////////////////////////








///////////////////////////////////////////////////////////////////////////////////////////////
////////  "LEAF NODE" DERIVED CLASSES  ////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
////////  these are instantiated, are never inherited from, and are generally model-specific  /
///////////////////////////////////////////////////////////////////////////////////////////////






///////////////////////////////////////////////////////////////////////////////////////////////
////////  PLOTTING CLASS HIERARCHY  ///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
////////  At hierarchy root is abstract class PlotType, from which an abstract class  /////////
////////  for each of four plot type categories (XT, HX, HM, and PP) inherit, from    /////////
////////  which ST-specific derived classes inherit, e.g., PlotTypeHM_IS              /////////
///////////////////////////////////////////////////////////////////////////////////////////////





///////////////////////////////////////////////////////////////////////////////////////////////
////////  GENERAL AND CONTAINER CLASSES  //////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
////////  these do not involve inheritance, are **not** model-specific, and are often /////////
////////  single-instance (overall or per Trajectory, at least)                       /////////
///////////////////////////////////////////////////////////////////////////////////////////////



	////////////////////////////  TESTING AREA -- EMPTY WHEN DONE TESTING!  ///////////////////////////////
	//let tempMCS = new ModelCalc_Stoch();
	//tempMCS.test_rngs();
	/*
	let fgo = {
	    xaxis: {
		tickDecimals: 0,
	    },
	    yaxis: {
		tickDecimals: 0,
	    },
	    grid: {
		labelMargin: 15,
	    },
	};

	//let temp_trj = new Trajectory_LM(this);

	let xd  = [0, 1, 2, 1, 0, 0, 0, 1, 1, 2, 3, 2, 3, 4, 4, 3, 2, 2, 1, 0, 0, 0];
	let temp_trj = new Trajectory_MN(this);
	let ts0 = temp_trj.segs[0];
	ts0.cv[0].x_indiv.set(0, 0);
	for (let x of xd.values()) {
	    let c_obj = new Coords_MN(ts0.mc, temp_trj.mc.N);
	    c_obj.x_indiv.set(0, x);
	    ts0.cv.push(c_obj);
	    ts0.t_last += 1;
	}
	temp_trj.t_edge = ts0.t_last;
	temp_trj.check_integrity();

	//$("#plot_flot").hide();
	//$("#plot_x_axis_lbl").hide();
	//$("#plot_y_axis_lbl").hide();
	
	temp_trj.t = 22;
	let temp_PT_1 = new PlotTypeXT_custom(temp_trj, "plot_flot_TEMP_1", 350, 150, fgo);
	temp_PT_1.apply_plot_dims_to_targ_css();
	temp_PT_1.plot(temp_trj.t);
	$("#plot_flot_TEMP_1").show();

	temp_trj.t = 10;
	let temp_PT_2 = new PlotTypeXT_custom(temp_trj, "plot_flot_TEMP_2", 350, 150, fgo);
	temp_PT_2.apply_plot_dims_to_targ_css();
	temp_PT_2.plot(temp_trj.t);
	$("#plot_flot_TEMP_2").show();

	let xd2 = [0, 1, 2, 1, 0, 0, 0, 1, 1, 2, 2, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0];
	ts0.cv = ts0.cv.slice(0, 1);
	for (let x of xd2.values()) {
	    let c_obj = new Coords_MN(ts0.mc, temp_trj.mc.N);
	    c_obj.x_indiv.set(0, x);
	    ts0.cv.push(c_obj);
	}
	temp_trj.check_integrity();

	temp_trj.t = 22;
	let temp_PT_3 = new PlotTypeXT_custom(temp_trj, "plot_flot_TEMP_3", 350, 150, fgo);
	temp_PT_3.apply_plot_dims_to_targ_css();
	temp_PT_3.plot(temp_trj.t);
	$("#plot_flot_TEMP_3").show();
	*/
	//console.log("WwWwWw", temp_PT.get_flot_gen_opts());///
	/*
	let tttt = new Trajectory_GM(this);/////////////
	tttt.check_integrity();///////////
	tttt.output_curr_vals();//////
	tttt.step_forward_and_record();
	tttt.step_forward_and_record();
	tttt.check_integrity();///////////
	tttt.output_curr_vals();//////
	*/
