//
// Help Viewer (HV) System
//
// files: help_viewer.js, network_structure.js, node_data.js
//
// * help_viewer.js contains HelpViewerNode and HelpViewer classes and all non-trivial code
// * network_structure.js contains individual nodes (HelpViewerNode constructors with corresponding id_str names) and HV network hierarchical structure
// * node_data.js contains HelpViewerNode data (header_txt and md_txt_html)
//
// this file: node_data.js
//
// * this file is basically a large chunk of html removed from SSNS.html since it is logically separate from the bulk of the UI html
// * each HV node gets two assignments: one for header_txt and the other for md_txt_html
// * HelpViewer.hvn_lookup_map["NODE_NAME"].header_txt is the "title" of the HV node found at the far right of the breadcrumbs
// * HelpViewer.hvn_lookup_map["NODE_NAME"].md_txt_html is the main html content of the HV node that appears in the body of the modal window
// * note that HelpViewer.hvn_lookup_map["NODE_NAME"].md_txt_html uses javascript String.raw``
// * the individual node entries are grouped by category and are listed in the same order as in network_structure.js; the categories are:
// -----  HelpViewer HIGH LEVEL PAGES  -------------------------------------------------------------
// -----  HelpViewer SA = SYSTEM AREA PAGES  -------------------------------------------------------
// -----  HelpViewer ST = SYSTEM TYPE PAGES  -------------------------------------------------------
// -----  HelpViewer P = PARAMETER PAGES  ----------------------------------------------------------
// -----  HelpViewer C = CONTROLS PAGES  -----------------------------------------------------------
//







// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -----  HelpViewer HIGH LEVEL PAGES  -------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------

HelpViewer.hvn_lookup_map["HV_HOME"].header_txt = String.raw``;  // empty since root node is represented by an icon outside the breadcrumbs_html
HelpViewer.hvn_lookup_map["HV_HOME"].md_txt_html = String.raw`

<p><strong>SSNS</strong>, which stands for <strong>S</strong>imple, <strong>S</strong>tochastic and <strong>N</strong>onlinear <strong>S</strong>imulator, is a web app that offers interactive exploration of examples from various <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Science,_technology,_engineering,_and_mathematics">STEM</a> fields.  Welcome!</p>

<p><strong>Quick Start:</strong> press <i class="fas fa-xl fa-xmark hv_close_btn"></i> above and then <button type="button" class="btn btn-ssns-demo btn-sm px-1 py-0"><i class="fas fa-lg fa-video"></i></button></p>

<p>The <i class="fas fa-fw fa-house"></i> above represents the top of the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_HELP_VIEWER'); ">help viewer</a> hierarchy.  Within-help links are in <a class="hv_link" style="cursor: text; ">this blue</a>.  Outbound links (mostly to <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/">Wikipedia</a>) are in <a class="hv_ext_link">this blue</a>.  The hierarchy branches from here:</p>

<ul><li><a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_USING'); ">How to use</a></li>
<li><a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_COMPUTATION'); ">Computation</a></li>
<li><a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_CONCEPTS'); ">Concepts</a></li></ul>

<p>If words like <em>stochasticity</em> and <em>nonlinearity</em> are unfamiliar to you, no problem.  This app aims to be accessible!  If, on the other hand, you are a <em>guru</em>, hopefully some interactive exploration proves enjoyable &mdash; like seeing an old friend.</p>


`;



HelpViewer.hvn_lookup_map["HV_USING"].header_txt = String.raw`How to use`;
HelpViewer.hvn_lookup_map["HV_USING"].md_txt_html = String.raw`

<img id="hv_ssns_screenshot" src="/static/images/SSNS/hv_interface_pics/using_-_LM_example.png">
<p>At right is a screenshot of <strong>SSNS</strong> in action.  The <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_PLOT_AREA'); ">plot area</a> occupies the upper part of the screen.  Below that is the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_MAIN_PANEL'); ">main panel</a> which contains one button bar with <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_CONTINUOUS_CMDS'); ">continuous-action navigation</a> commands and another with 3 toggle-able dropdown areas: <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_CTRL_DROPDOWN'); "><samp>CTRL</samp></a> <button type="button" class="btn btn-ssns-demo btn-sm px-1 py-0"><i class="fas fa-fw fa-lg fa-calculator"></i></button>, <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_PRMS_DROPDOWN'); "><samp>PRMS</samp></a> <button type="button" class="btn btn-ssns-demo btn-sm px-1 py-0"><i class="fas fa-fw fa-lg fa-sliders"></i></button>, and <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SYS_DROPDOWN'); "><samp>SYS</samp></a> <button type="button" class="btn btn-ssns-demo btn-sm" style="padding: 0 0.35rem; ">$$ \texttt{AB} $$</i></button>.</p>

<p>The <strong>SSNS</strong> app is like an audio recorder in that <strong><em>playback can only occur after some data is recorded</em></strong>.  In the screenshot, the currently loaded <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SYS_DROPDOWN'); ">system type</a> is <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_LM'); ">$$ \texttt{LM} $$</a>, 12 time steps have been recorded, and the current time is $$t = 9$$.</p>

<!--
text-align: center; vertical-align: middle !important; 
<td class="hv_emulated_btn_td"></td>
-->



`;



HelpViewer.hvn_lookup_map["HV_PLOT_AREA"].header_txt = String.raw`Plots`;
HelpViewer.hvn_lookup_map["HV_PLOT_AREA"].md_txt_html = String.raw`


<p><strong>SSNS</strong> has four different <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_PLOT_TYPES'); ">plot types</a>, each filling a different visualization "niche."  The <button type="button" class="btn btn-ssns-demo btn-sm px-1 py-0"><i class="fas fa-fw fa-lg fa-arrow-trend-up"></i></button> plot type (the app's "flagship") is great for exploring <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Dynamical_system">time-dependent</a> behavior like the approach to a <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Steady_state">steady</a> or <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/List_of_types_of_equilibrium">equilibrium</a> state.  Here it is in action:</p>

<img class="hv_fw_img" src="/static/images/SSNS/hv_interface_pics/TrajSeg_illustrated.png">

<p>The black circle follows the current time ($$t = 57$$, here) and matches the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_CONTINUOUS_CMDS'); ">main panel</a>'s time indicator.  The grey vertical band (at $$78$$, here) indicates $$ t_{\mathrm{edge}} $$, the end of the <em>recorded</em> trajectory ($$ t_{\mathrm{edge}} \le \; $$<a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_T_0_MAX_STOP'); ">$$ t_{\mathrm{max}} $$</a>).  <strong>SSNS</strong> trajectories are sequences of <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_CODE_ORGANIZATION'); ">$$\texttt{TrajSeg}$$ objects</a>.  A change of <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_PRMS_DROPDOWN'); ">parameter values</a> generates a new $$\texttt{TrajSeg}$$ segment and cycles the plot color.  The screenshot above shows 4 of them: red, green, blue, and red again.</p>


`;



HelpViewer.hvn_lookup_map["HV_MAIN_PANEL"].header_txt = String.raw`Main Panel`;
HelpViewer.hvn_lookup_map["HV_MAIN_PANEL"].md_txt_html = String.raw`

<p>The <strong>SSNS</strong> main panel contains two button bars.  The first contains the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_CONTINUOUS_CMDS'); ">continuous-action commands</a> with the (non-clickable) time-step indicator on the right.  The second bar's buttons are, from left to right: <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_CTRL_DROPDOWN'); "><samp>CTRL</samp></a> <button type="button" class="btn btn-ssns-demo btn-sm px-1 py-0"><i class="fas fa-fw fa-lg fa-calculator"></i></button> for general inputs, <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_PRMS_DROPDOWN'); "><samp>PRMS</samp></a> <button type="button" class="btn btn-ssns-demo btn-sm px-1 py-0"><i class="fas fa-fw fa-lg fa-sliders"></i></button> for system-type-specific inputs, <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SYS_DROPDOWN'); "><samp>SYS</samp></a> <button type="button" class="btn btn-ssns-demo btn-sm" style="padding: 0 0.35rem; ">$$ \texttt{AB} $$</i></button> for choosing the system type, and <button type="button" class="btn btn-sm emulated_help_btn"><img height="15" width="10" src="/static/images/SSNS/question_mark.svg"></button> for this <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_HELP_VIEWER'); ">help viewer</a>.</p>

<p><strong>SSNS</strong> uses <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/JavaScript">JavaScript</a> and the Bootstrap <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_CODE_DEPENDENCIES'); ">library</a> to <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Responsive_web_design">adapt</a> the app interface to different screen widths across <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Mobile_device">devices</a>.  "Responsive" behaviors include:</p>

<ul><li>main panel button bars stack on mobile, but spread horizontally on desktop</li>
<li>same for controls in each dropdown area</li>
<li>dropdown buttons on mobile show icons (e.g., <button type="button" class="btn btn-ssns-demo btn-sm px-1 py-0" style="margin-right: 1px; "><i class="fas fa-fw fa-lg fa-sliders"></i></button>) but not labels (e.g., <samp>PRMS</samp>)</li>
<li>one dropdown shown at once on mobile</li>
<li><a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_RNG_RECR_TRAJ'); ">random number settings</a> only present if the system is stochastic</li>
<li><a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_SP_ENSEMBLE'); ">ensemble settings</a> only present for <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SA_SP'); ">stochastic processes</a></li></ul>

`;



HelpViewer.hvn_lookup_map["HV_PRMS_DROPDOWN"].header_txt = String.raw`PRMS Dropdown`;
HelpViewer.hvn_lookup_map["HV_PRMS_DROPDOWN"].md_txt_html = String.raw`

<p>When a <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SYS_DROPDOWN'); ">system type</a> is selected, its <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Parameter_space">parameters</a> populate the <samp>PRMS</samp> <button type="button" class="btn btn-ssns-demo btn-sm px-1 py-0"><i class="fas fa-fw fa-lg fa-sliders"></i></button> dropdown area.  A parameter could be, say, a <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SP_MN_mu'); ">mutation rate</a> in a biological model, or <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_IS_T'); ">temperature</a> in a physical model, like so:</p>
<img class="hv_fw_img" src="/static/images/SSNS/hv_interface_pics/PRMS_example_-_T_parameter.png">

<p>The input field includes the current value ($$1.2$$, here) and, on the left, the parameter's symbol ($$T$$) on a colored background.  The color indicates when a changed value takes effect &mdash; <span class="ctrl_eff_immed px-2 py-0 mr-1">blue</span><strong>:</strong> immediately, or at next recorded step; <span class="ctrl_eff_reload px-2 py-0 mr-1">green</span><strong>:</strong> a <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_RELOAD_CMDS'); ">reload</a> is needed.  <strong><em>Any of the colored symbol backgrounds in the</em></strong> <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_PRMS_DROPDOWN'); "><samp>PRMS</samp></a> <em><strong>and</em></strong> <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_CTRL_DROPDOWN'); "><samp>CTRL</samp></a> <em><strong>dropdown areas can be clicked to view the corresponding quantity's help page</em></strong>.</p>

<p>A system type might also have one or more <span class="ctrl_precip_reload px-2 py-0 mr-1">grey</span> "meta-parameter" buttons.  They generally handle "settings" that are more complicated than parameter values.  For instance, the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_HS'); ">hard sphere gas</a> has an <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Initial_condition">initial condition</a> ($$\mathrm{IC}$$) button that determines the initial positions and velocities of all gas particles.  As it's clicked, each "meta-parameter" button cycles through a fixed number of options and displays description / indicator / icon like so: $$\mathrm{description}$$ <span><img height="30" width="6" src="/static/images/SSNS/UICI/cycle_indicator_5_2.svg">&#128070;</span></p>

<p>On load, each input field in the app has a sensible default value.  Further, JavaScript $$\texttt{onChange}$$ <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Event_(computing)#Event_handler">listeners</a> and a layer of <strong>SSNS</strong> <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_CODE_IO'); ">$$\texttt{UINI}$$ objects</a> mean <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Data_validation">out-of-range values</a> will never reach the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_CODE_ORGANIZATION'); ">$$\texttt{Trajectory}$$</a> machinery.</p>


`;



HelpViewer.hvn_lookup_map["HV_SYS_DROPDOWN"].header_txt = String.raw`SYS Dropdown`;
HelpViewer.hvn_lookup_map["HV_SYS_DROPDOWN"].md_txt_html = String.raw`

<p>Use the <samp>SYS</samp> dropdown area to select an <strong>SSNS</strong> system type.  There are two sets of <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Radio_button">radio buttons</a>: one orange, one yellow.  Upon selecting a <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Science,_technology,_engineering,_and_mathematics">STEM</a> category in the orange one, the yellow one updates to show the system types from that category.  The four categories are described <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_CONCEPTS'); ">here</a>.</p>

<p>Each yellow system type entry gives both the name (e.g., Logistic Map) and a two-letter abbreviation ($$ \texttt{LM} $$).  Since the <samp>SYS</samp> dropdown may be collapsed, its button always displays the abbreviation of the currently loaded system type for reference (<button type="button" class="btn btn-ssns-demo btn-sm" style="padding: 0 0.35rem; margin: 0 1px; ">$$ \texttt{LM} $$</i></button>).</p>

<p>When a system type selection is made, the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_PLOT_AREA'); ">plot area</a> updates to show the corresponding trajectory.  Previously recorded trajectory data and choice of <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_PLOT_TYPES'); ">plot type</a> are "remembered" from previous exploration.  Such stored data can always be erased by <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_RELOAD_CMDS'); ">reloading</a>.</p>

`;



HelpViewer.hvn_lookup_map["HV_HELP_VIEWER"].header_txt = String.raw`Help Viewer`;
HelpViewer.hvn_lookup_map["HV_HELP_VIEWER"].md_txt_html = String.raw`

<p>This help viewer is a <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Tree_structure">hierarchical</a> network of pages that "floats" above the <strong>SSNS</strong> interface.  The top of the hierarchy is represented by <a class="hv_link" style="cursor: text; "><i class="fas fa-fw fa-house"></i></a> ("home").  All other pages have names, e.g., <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_COMPUTATION'); ">Computation</a>.  The current page's name is <span class="hv_curr_page">boxed</span> in the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Breadcrumb_navigation">breadcrumbs</a> above to show its place in the hierarchy.</p>

<p>Navigation within the help viewer is done via <a class="hv_link" style="cursor: text; ">light blue links</a>.  They are present in page text, the breadcrumbs, and a rudimentary back button <a class="hv_link" style="cursor: text; "><i class="fas fa-fw fa-arrow-left"></i></a>.  External links (usually to Wikipedia) are in <a class="hv_ext_link">this shade of blue</a>.</p>

Launching the help viewer with <button type="button" class="btn btn-sm emulated_help_btn"><img height="15" width="10" src="/static/images/SSNS/question_mark.svg"></button> shows the last displayed page.  Alternatively, clicking a colored symbol background in the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_CTRL_DROPDOWN'); "><samp>CTRL</samp></a> or <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_PRMS_DROPDOWN'); "><samp>PRMS</samp></a> dropdown areas opens the corresponding quantity's page.  The viewer can always be closed with <i class="fas fa-xl fa-xmark hv_close_btn"></i>.  Also, if viewing the page for a system type, click the <a class="hv_link" style="cursor: text; "><i class="fa-solid fa-up-right-from-square"></i></a> next to its name to close the viewer and load it in the main interface.</p>

`;



HelpViewer.hvn_lookup_map["HV_COMPUTATION"].header_txt = String.raw`Computation`;
HelpViewer.hvn_lookup_map["HV_COMPUTATION"].md_txt_html = String.raw`

<p>
<strong>SSNS</strong> code and computation are described in detail in the <a target="_blank" class="hv_ext_link" href="//github.com/malliaris/SSNS/blob/main/README.md">GitHub README <i class="fa-brands fa-github" style="color: black; "></i></a>.  These help viewer pages touch on many of the same topics, but at a less technical level.

<ul><li><a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_CODE_DESIGN'); ">code design</a>, and why JavaScript was the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Programming_language">language</a> for the job</li>
<li>how the code is <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_CODE_ORGANIZATION'); ">organized</a> using design ideas like <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Encapsulation_(computer_programming)">encapsulation</a></li>
<li><a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_CODE_DEPENDENCIES'); ">external libraries</a> that <strong>SSNS</strong> relies on for things like <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/User_interface">user interface</a></li>
<li>how the code accommodates invalid <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_CODE_IO'); ">user input</a> and tries to minimize interrupting with <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Error_message">error messages</a></li>
<li><a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_CODE_FUTURE'); ">future additions/improvements</a>: system types to try, and taking full advantage of the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Graphics_processing_unit">GPU</a></li></ul>

`;



HelpViewer.hvn_lookup_map["HV_CODE_DESIGN"].header_txt = String.raw`Code Design`;
HelpViewer.hvn_lookup_map["HV_CODE_DESIGN"].md_txt_html = String.raw`


<p>Here are a few of the factors considered in designing <strong>SSNS</strong>.  (Details on <a target="_blank" href="//github.com/malliaris/SSNS/blob/main/README.md#code-design">GitHub <i class="fa-brands fa-github" style="color: black; "></i></a>.)</p>

<p>The <strong>SSNS</strong> app would need to live on the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/World_Wide_Web">web</a> and have a quick turnaround: from <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/User_interface">user input</a>, to <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Computational_science">computation</a>, to <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Plot_(graphics)">plot output</a>.  Considering these requirements, the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/JavaScript">JavaScript language</a>, plus supporting <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_CODE_DEPENDENCIES'); ">libraries</a>, was the natural choice.</p>

<p>In the <strong>SSNS</strong> code, a $$\texttt{Trajectory}$$ <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Object_(computer_science)">object</a> contains everything needed to generate output (via the appropriate set of <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Discrete_time_and_continuous_time">continuous or discrete</a> <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Time_evolution"> update equations</a>) and store it for playback.  Its <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Composition_over_inheritance">composition</a> from "smaller" classes and <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Inheritance_(object-oriented_programming)">specialization</a> for each system type are discussed <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_CODE_ORGANIZATION'); ">here</a>.</p>

<p>There are perks to being a <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Client–server_model">client-side</a> web app like <strong>SSNS</strong>.  For one, there's nothing to install or update!  Also, for those interested learning more, <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Source_code">source</a> can be viewed <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/View-source_URI_scheme">right in the browser</a>, and <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Logging_(computing)">execution info</a> can be viewed in the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Web_development_tools#JavaScript_debugging">developer tools console</a>.</p>

`;



HelpViewer.hvn_lookup_map["HV_CODE_ORGANIZATION"].header_txt = String.raw`Code Organization`;
HelpViewer.hvn_lookup_map["HV_CODE_ORGANIZATION"].md_txt_html = String.raw`

<p>The collection of all <strong>SSNS</strong> <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SYS_DROPDOWN'); ">system types</a> can be grouped in many different ways &mdash; think of <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Venn_diagram">Venn diagrams</a>.  This suggests the use of <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Object-oriented_programming">classes</a> and <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Inheritance_(object-oriented_programming)">inheritance</a> in structuring the <strong>SSNS</strong> code.  Here is the inheritance <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Tree_structure">hierarchy</a> for the $$\texttt{Trajectory}$$ class:</p>

<a target="_blank" href="//tedm.us/static/images/SSNS/Trajectory_inheritance.svg"><img class="hv_fw_img" src="/static/images/SSNS/Trajectory_inheritance_-_no_section_label.svg"></a>

<p>Similar hierarchies exist for the $$\texttt{Params}$$, $$\texttt{Coords}$$, $$\texttt{ModelCalc}$$, and $$\texttt{PlotType}$$ classes.</p>

<p>We can also consider class <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Composition_over_inheritance">composition</a>.  Each $$\texttt{Trajectory}$$ is composed of a $$\texttt{ModelCalc}$$ object (to perform all system-type-specific calculations) and one or more $$\texttt{TrajSeg}$$ objects.  A $$\texttt{TrajSeg}$$ represents the segment of a trajectory evolved with a specific set of <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Parameter_space">parameters values</a>.  It contains a single $$\texttt{Params}$$ and one or more $$\texttt{Coords}$$ objects, as shown here:</p>

<a target="_blank" href="//tedm.us/static/images/SSNS/TrajSeg_composition.svg"><img class="hv_fw_img" src="/static/images/SSNS/TrajSeg_composition_-_no_section_label.svg"></a>

<p>Finally, each $$\texttt{Coords}$$ object holds all <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Dependent_and_independent_variables">dependent variable</a> data for a single time step &mdash; it could be, e.g., a single scalar value, or a large 2D matrix of values.  See GitHub <i class="fa-brands fa-github" style="color: black; "></i> for more <a target="_blank" class="hv_ext_link" href="//github.com/malliaris/SSNS/tree/main/docs/class_diagrams">class diagrams</a>, <a target="_blank" class="hv_ext_link" href="//github.com/malliaris/SSNS/blob/main/README.md#abbreviations-labels-etc">abbreviation info</a>, etc.</p>

`;



HelpViewer.hvn_lookup_map["HV_CODE_DEPENDENCIES"].header_txt = String.raw`Code Dependencies`;
HelpViewer.hvn_lookup_map["HV_CODE_DEPENDENCIES"].md_txt_html = String.raw`

<p><strong>SSNS</strong> <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Library_(computing)">library dependencies</a> include:</p>

<ul><li><a target="_blank" href="//stdlib.io/">stdlib.js</a> for data structures, statistics, and <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Pseudorandom_number_generator">random number generation</a></li>
<li><a target="_blank" href="//www.flotcharts.org/">flot</a> for <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Plot_(graphics)">plotting</a> (except for <samp>PlotTypeCV</samp>, which uses HTML <samp>&lt;canvas&gt;</samp>)</li>
<li><a target="_blank" href="//getbootstrap.com/">Bootstrap</a> for a <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Responsive_web_design">responsive</a> interface</li>
<li><a target="_blank" href="//www.katex.org/">KaTeX</a> for web <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Typesetting#TeX_and_LaTeX">typesetting</a></li>
<li><a target="_blank" href="//jquery.com/">jQuery</a> for interacting with the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Document_Object_Model">DOM</a></li>
<li><a target="_blank" href="//fontawesome.com/">Font Awesome</a> for nifty icons <i class="fas fa-font-awesome"></i></li></ul>

<p>See <a target="_blank" href="//github.com/malliaris/SSNS/blob/main/README.md#external-libraries-dependencies">GitHub <i class="fa-brands fa-github" style="color: black; "></i></a> for more info and related <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/CSS">CSS stylesheet</a> files.  There is also a <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Minification_(programming)">minified</a> bundle of the above JavaScript dependencies.  The head of that file contains <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Software_versioning">version</a> info.</p>


`;



HelpViewer.hvn_lookup_map["HV_CODE_IO"].header_txt = String.raw`Input/Output`;
HelpViewer.hvn_lookup_map["HV_CODE_IO"].md_txt_html = String.raw`


<p>The <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/User_interface">user interface</a>, or "UI," facilitates all forms of interaction with the app, including:</p>

<ul>
<li>plot output, discussed, e.g., <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_PLOT_AREA'); ">here</a></li>
<li>indicator output, e.g., of <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_CONTINUOUS_CMDS'); ">$$t$$ value</a></li>
<li>button input, discussed e.g., <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_ONE_STEP_CMDS'); ">here</a></li>
<li>numerical input, via <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_PRMS_DROPDOWN'); ">input fields</a>; each is managed by a $$\texttt{UINI}$$ object which stores an "official" value; input from the UI is <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Data_validation">validated</a>, and sometimes <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Autocorrection">auto-corrected</a>; during "playback," <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_CODE_ORGANIZATION'); "><samp>TrajSeg</samp></a> values flow <strong><em>to the UI</em></strong>; see <a target="_blank" href="//github.com/malliaris/SSNS/blob/main/README.md#inputoutput">GitHub <i class="fa-brands fa-github" style="color: black; "></i></a> for details</li>
<li>handling of <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Exception_handling">error conditions</a>; good <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_CODE_DESIGN'); ">design</a> hopefully prevents most; <samp>INFO</samp> messages are sent to the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Web_development_tools#JavaScript_debugging">JavaScript console</a>; limitless recording, however, is <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Out_of_memory">not possible</a>, so we <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_E_T_MAX_REACHED'); ">intervene</a></li></ul>

<p><a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Hard_disk_drive">Saving</a> of $$\texttt{Trajectory}$$ data is not implemented.  However, the project is <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Open-source_software">open</a>, so someone might add it!  Screenshots are always allowed, of course &#x1F603;.</p>

`;



HelpViewer.hvn_lookup_map["HV_CODE_FUTURE"].header_txt = String.raw`Looking Forward`;
HelpViewer.hvn_lookup_map["HV_CODE_FUTURE"].md_txt_html = String.raw`


<p>Here is an abbreviated list of possible additions/directions for <strong>SSNS</strong>:</p>

<ul><li>System types that are disabled in the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SYS_DROPDOWN'); "><samp>SYS</samp></a> dropdown are either under maintenance or not yet written.  The <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/M/M/1_queue">M/M/1 queue</a> already has a slot in the UI, so please <a target="_blank" class="hv_ext_link" href="//github.com/malliaris/SSNS/issues">get in touch</a> if you want to implement it!</li>

<li>The <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_CODE_ORGANIZATION'); "><samp>Coords</samp></a> <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Computer_memory">memory footprint</a> for most <strong>SSNS</strong> system types is small.  As <a target="_blank" class="hv_ext_link" href="//github.com/malliaris/SSNS/tree/main/README.md#general-timeenergyvisualizationcomputation-considerations">this discussion</a> on GitHub points out, this is not the case for the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SA_SM'); ">statistical mechanical</a> models, and several strategies have been or could be pursued to improve their computational performance/capabilities.  For example, it may be worth extending the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Monte_Carlo_method">Monte Carlo</a> move set for our <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SPIN_SYSTEMS'); ">spin systems</a> beyond the single Metropolis spin flip.</li>

<li>And, continuing on the topic of spin system computation, we might consider changing the type of hardware on which we carry it out.  If we're willing to accept additional difficulties and constraints, running <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/WebGL">WebGL</a>/<a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/WebGPU">WebGPU</a> on a <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Graphics_processing_unit">GPU</a> would speed things up considerably.  Until then, check out <a href="//kjslag.github.io/XY/">this</a> amazingly fast WebGL implementation of the <samp>XY</samp> model.</li></ul>

`;



HelpViewer.hvn_lookup_map["HV_E_T_MAX_REACHED"].header_txt = String.raw`Max Duration Reached`;
HelpViewer.hvn_lookup_map["HV_E_T_MAX_REACHED"].md_txt_html = String.raw`

<p style="text-align: center; "><i class="fas fa-fw fa-xl fa-triangle-exclamation gentle_warning"></i> <strong>Maximum Duration Reached</strong> <i class="fas fa-fw fa-xl fa-triangle-exclamation gentle_warning"></i></p>
<p>The maximum trajectory duration has been reached.  Consider rewinding and re-recording.  You can also try increasing the $$ t_{\mathrm{max}} $$ parameter, but be aware that it has a system-type-dependent internal limit.  See <a target="_blank" class="hv_ext_link" href="//github.com/malliaris/SSNS/tree/main/README.md#general-timeenergyvisualizationcomputation-considerations">this discussion</a> for more.</p>

`;



HelpViewer.hvn_lookup_map["HV_E_NOT_IMPLEMENTED"].header_txt = String.raw`Not Implemented`;
HelpViewer.hvn_lookup_map["HV_E_NOT_IMPLEMENTED"].md_txt_html = String.raw`

<p style="text-align: center; "><i class="fas fa-fw fa-xl fa-person-digging gentle_warning"></i> <strong>Not Implemented</strong> <i class="fas fa-fw fa-xl fa-person-digging gentle_warning"></i></p>
<p>This <strong>SSNS</strong> page/functionality is not yet written/implemented.  The <a target="_blank" href="//github.com/malliaris/SSNS/blob/main/README.md#to-dofixaddexplore">GitHub <i class="fa-brands fa-github" style="color: black; "></i></a> may have more information.</p>

`;



HelpViewer.hvn_lookup_map["HV_CONCEPTS"].header_txt = String.raw`Concepts`;
HelpViewer.hvn_lookup_map["HV_CONCEPTS"].md_txt_html = String.raw`


<p>The <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SYS_DROPDOWN'); "><samp>SYS</samp> dropdown area</a> organizes the system types implemented by <strong>SSNS</strong> into four categories.  Each category has a page with a brief description of its central ideas:</p>
<ul><li><a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SA_SP'); ">Stochastic Processes</a></li>
<li><a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SA_SM'); ">Statistical Mechanics</a></li>
<li><a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SA_ND'); ">Nonlinear Dynamics</a></li>
<li><a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SA_FD'); ">Fluid Dynamics</a></li></ul>

<p>There are also a few supplemental pages that go a bit deeper, or cross categories:</p>

<ul><li>a bit on <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ENSEMBLES'); ">statistical ensembles</a>, relevant to the first two categories</li>
<li>the various <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_MARKOV_ONE_STEP'); ">types of stochastic processes</a></li>
<li>for statistical mechanical systems, we implement, two <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_GAS_MODELS'); ">gas models</a> and two <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SPIN_SYSTEMS'); ">spin systems</a></li>
<li>a bit on <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_PHASE_TRANSITIONS'); ">phase transitions</a>, and if/how they will appear in those statistical mechanical systems</li>
<li>a bit on the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_GAS_THEORY_COMPARISON'); ">comparison</a> between theory and computational results, as illustrated with our <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_HS'); ">Hard Sphere</a> implementation</li></ul>

`;



HelpViewer.hvn_lookup_map["HV_ENSEMBLES"].header_txt = String.raw`Ensembles, Averaging`;
HelpViewer.hvn_lookup_map["HV_ENSEMBLES"].md_txt_html = String.raw`


<p>Of the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_CONCEPTS'); ">four categories</a> of <strong>S</strong>imple <strong>S</strong>tochastic and <strong>N</strong>onlinear systems we <strong>S</strong>imulate, <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SA_SP'); ">stochastic processes</a> and <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SA_SM'); ">statistical mechanics</a> represent a <em>stochastic meta-category</em>, while <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SA_ND'); ">nonlinear</a> and <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SA_FD'); ">fluid</a> dynamics represent a <em>nonlinear meta-category</em>.  In the former, system types generally depend on <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Pseudorandom_number_generator">random numbers</a>; in the latter, they do not.  For the former, "ensemble" refers to a number of independently <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Time_evolution">evolved</a> <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Ensemble_(mathematical_physics)">copies</a> of the system type, across which <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Statistics">statistics</a> can be calculated.  Regarding ensembles:</p>

<ul><li><strong>SSNS</strong> <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SA_SP'); ">SP</a> machinery supports large ensembles, as described <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_SP_ENSEMBLE'); ">here</a></li>
<li>for <strong>SSNS</strong> <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SA_SM'); ">SM</a> systems, ensemble size is $$1$$, but averaging <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Temporal_mean">over time</a> (and/or across a lattice or gas container) is always possible</li>
<li>as in all stochastic simulation, care must be taken with the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Random_seed">seeding of RNG's</a>, assessment of <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Autocorrelation">correlations</a>, the determination of <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Steady_state">steady state</a>, etc.</li></ul>

`;



HelpViewer.hvn_lookup_map["HV_MARKOV_ONE_STEP"].header_txt = String.raw`Memorylessness, etc.`;
HelpViewer.hvn_lookup_map["HV_MARKOV_ONE_STEP"].md_txt_html = String.raw`


<p>If the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Time_evolution">evolution</a> of a <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Stochastic_process">stochastic process</a> is described by a <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Probability_distribution">probability distribution</a>, it is reasonable to ask what that probability distribution depends on.  It may:</p>

<ul><li>not depend on the system state at all (like repeated rolls of the dice)</li>
<li>depend only on the <em>current</em> state</li>
<li>depend on the <em>past sequence</em> of states</li></ul>

<p>The first two together form the category known as <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Markov_property">Markov processes</a>, and are said to be "memoryless."  Within Markov processes, there can be further classification.  All <strong>SSNS</strong> <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SA_SP'); ">stochastic processes</a> are <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Discrete-time_Markov_chain">discrete-time</a> <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Birth–death_process">one-step</a> processes, where the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Integer">integer</a> system state changes by $$0$$ or $$\pm 1$$ each time step.</p>

<p>Memorylessness also appears in the <strong>SSNS</strong> <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SPIN_SYSTEMS'); ">spin system</a> implementations <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_IS'); ">Ising</a> and <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_XY'); ">XY</a>.  Specifically, <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Thermal_fluctuations">thermal</a> stochasticity is incorporated via the Markovian <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Metropolis–Hastings_algorithm">Metropolis algorithm</a>.  This should not be confused with <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Magnetic_hysteresis">hysteresis</a> (i.e., <em>memory</em>) seen in the system <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Magnetization">magnetization</a> as the external magnetic field <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_IS_h'); ">$$ \vec{h} $$</a> is varied.</p>


`;



HelpViewer.hvn_lookup_map["HV_SPIN_SYSTEMS"].header_txt = String.raw`Spin Systems`;
HelpViewer.hvn_lookup_map["HV_SPIN_SYSTEMS"].md_txt_html = String.raw`


<a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Spin_(physics)">Spin</a> systems involve ordered arrays of spins, each a little "arrow" that can rotate but not <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Translation_(geometry)">translate</a>.  Spin models are relevant to the study of <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Magnetism">magnetism</a> in <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Solid-state_physics">solids</a>.  They come in many varieties, but generally involve the system changing over time from the combined influence of:</p>

<ul><li> an aligning <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Fundamental_interaction">interaction</a> of each spin with its nearest neighbors</li>
<li> an aligning <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Fundamental_interaction">interaction</a> of each spin with an <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Magnetic_field">external field</a> $$ \vec{h} $$</li>
<li> randomizing <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Thermal_fluctuations">thermal kicks</a> with strength determined by the temperature $$ T $$</ul>
  
<p>Both of our example spin systems (<a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_IS'); ">Ising</a> and <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_XY'); ">XY</a>) are implemented with:</p>

<ul><li>random <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Initial_condition">initial configurations</a></li>
<li><a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Periodic_boundary_conditions">periodic boundary conditions</a></li>
<li>2D square <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Lattice_model_(physics)">lattices</a></li>
<li><a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Metropolis–Hastings_algorithm">Metropolis updates</a></li></ul>


`;



HelpViewer.hvn_lookup_map["HV_PHASE_TRANSITIONS"].header_txt = String.raw`Phase Transitions`;
HelpViewer.hvn_lookup_map["HV_PHASE_TRANSITIONS"].md_txt_html = String.raw`


<p>A sample of water can be switched between frozen and liquid states by manipulating the sample's temperature.  Similarly, the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_IS'); ">Ising</a> and <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_XY'); ">XY</a> <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SPIN_SYSTEMS'); ">spin systems</a> we have implemented exhibit temperature-induced <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Critical_phenomena">phase transitions</a>.  Roughly speaking, low-<a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_XY_T'); ">$$ T $$</a> states will be <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Order_and_disorder">ordered</a> (areas of like-colored tiles), while high-<a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_XY_T'); ">$$ T $$</a> states will be <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Order_and_disorder">disordered</a> (random distribution of colors).</p>

<p><em>True</em> phase transitions only appear in the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Thermodynamic_limit">thermodynamic limit</a> (e.g., number of tiles/particles <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_XY_N'); ">$$ N $$</a> $$ \to \infty $$).  Careful simulation of such phenomena requires large systems/<a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ENSEMBLES'); ">ensembles</a>, and slowly changing $$ T $$ to "hug" <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Thermodynamic_equilibrium">equilibrium</a> states.  While <strong>SSNS</strong>'s computational resources are limited, qualitative transition behavior is well displayed in our Ising and XY implementations.  For a higher-performance, <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Graphics_processing_unit">GPU</a>-based web app, see <a target="_blank" class="hv_ext_link" href="//kjslag.github.io/XY/">this XY simulation</a>.</p>

`;



HelpViewer.hvn_lookup_map["HV_GAS_MODELS"].header_txt = String.raw`Gas Models`;
HelpViewer.hvn_lookup_map["HV_GAS_MODELS"].md_txt_html = String.raw`


<p><strong>SSNS</strong> includes <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Molecular_dynamics">molecular dynamics</a> simulations of two gas models: the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_IG'); ">ideal gas (<samp>IG</samp>)</a> and the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_HS'); ">hard sphere gas (<samp>HS</samp>)</a>.  Details:</p>

<ul>
<li>For both, the number of particles <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_HS_N'); ">$$N$$</a> is user-specified, but fixed for the entire <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_CODE_ORGANIZATION'); ">trajectory</a>.</li>
<li>In <samp>IG</samp>, <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_IG_V'); ">$$V$$</a> is user-specified; in <samp>HS</samp>, it is controlled indirectly via piston speed <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_HS_v_pist'); ">$$v_{\mathrm{pist.}}$$</a>.</li>
<li>For both: models are <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Kinetic_theory_of_gases">classical</a>, particles are <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Monatomic_gas">"monatomic"</a> (no internal <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Degrees_of_freedom_(mechanics)">d.o.f.</a>), and systems are 2D, so <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Equipartition_theorem">equipartition</a> gives average <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Kinetic_energy">kinetic energy</a> of $$k_B T $$ per particle and the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Heat_capacity_ratio">heat capacity ratio</a> $$\gamma = 2$$.</li>
<li>While we keep some 3D terminology (hard <em>spheres</em>, not disks), the volume $$V$$ is really an area and pressure $$p$$ has units of force/length so $$p V$$ represents <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Work_(physics)#Work_by_a_gas">work/energy</a>.</li>
<li><samp>IG</samp>'s particles <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Point_particle">have no extent</a>, but are drawn as small solid black circles; they are identical.  <samp>HS</samp>'s particles have finite radii and can vary in <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_HS_R'); ">$$R$$</a>, density <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_HS_rho'); ">$$\rho$$</a>, and mass; they are depicted as solid circles with $$R$$ <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Proportionality_(mathematics)">to scale</a> and $$\rho$$ in <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Grayscale">greyscale</a>; however, any particle with $$R$$ below a visibility threshold is drawn as a fixed size open circle.  In both models, one particle is colored <span style="color:red"><strong>red</strong></span> for easy tracking.</li>
<li>For simplicity, we skip the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Thermal_reservoir">heat bath</a> and take all collisions to be <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Elastic_collision">elastic</a> and instantaneous, so <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Interatomic_potential">potential energy</a> plays no role and the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Internal_energy">total energy</a> $$ U = N k_B T$$.</li>
<li>We assume <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Adiabatic_process">adiabatic</a> conditions (i.e., well insulated walls), so, except for during piston movement in <samp>HS</samp>, $$U$$ is <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Conservation_law">fixed</a>.</li>
<li>The <samp>IG</samp> gas is initialized at <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Thermodynamic_equilibrium">equilibrium</a> (particle positions are <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Continuous_uniform_distribution">random</a> and velocities are <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Non-uniform_random_variate_generation">sampled</a> from the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_IG_kT0'); ">$$ k_B T_0 $$</a>-dependent <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Maxwell%E2%80%93Boltzmann_distribution">Maxwell-Boltzmann</a> distribution).  For <samp>HS</samp>, this <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_HS_IC'); ">meta-parameter button</a> cycles through 5 <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Initial_condition">initial conditions</a> &mdash; 1 equilibrium, the other 4 "artificial" in some way.</li>
<li>For both, the parameter <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_HS_kT0'); ">$$ k_B T_0 $$</a> controls the initial total energy.  If no sampling is involved, it will be exactly $$ N k_B T_0 $$.  However, for sampled initial conditions (e.g., equilibrium), there will be deviation from this value due to <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_HS_N'); ">$$ N $$</a>-dependent <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Sampling_error">sampling error</a>.  That error, as well as possible piston movement in <samp>HS</samp>, mean that $$T$$ may differ from $$T_0$$.</li>
<li>In both, <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Pressure">pressure</a> $$p$$ is "measured" by tracking and <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Temporal_mean">averaging</a> <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Momentum">momentum</a> transfer in particle-wall collisions.  It is tracked independently for both $$\hat{x}$$ and $$\hat{y}$$.  Note that, in <samp>IG</samp>, <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_IG_BC'); ">toggling</a> <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Periodic_boundary_conditions">periodic boundaries</a> will affect measured $$p$$ values.</li>
<li> While the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Equations_of_motion">equations of motion</a> for both gas models are <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Deterministic_system">deterministic</a>, any sampled initial state is stochastic and thus <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_RNG_RECR_TRAJ'); ">seed</a>-controlled.  The equations of motion are also exact (unlike the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Numerical_methods_for_ordinary_differential_equations">numerical solutions</a> in <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_SH'); "><samp>SH</samp></a>, <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_PF'); "><samp>PF</samp></a>, and <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_E_NOT_IMPLEMENTED'); "><samp>LZ</samp></a>) so the time step $$\Delta s$$ can be made as large as desired (details <a target="_blank" class="hv_ext_link" href="//github.com/malliaris/SSNS/tree/main/README.md#general-timeenergyvisualizationcomputation-considerations">here</a>).</li>
<li> <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Equation_of_state">Equations of state</a>, <samp>HS</samp> piston thermodynamics, plots, etc. are discussed <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_GAS_THEORY_COMPARISON'); ">here</a>.</li>
</ul>


`;



HelpViewer.hvn_lookup_map["HV_GAS_THEORY_COMPARISON"].header_txt = String.raw`Gas Theory`;
HelpViewer.hvn_lookup_map["HV_GAS_THEORY_COMPARISON"].md_txt_html = String.raw`


<p>The <strong>SSNS</strong> <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_HS'); ">Hard Sphere</a> (<samp>HS</samp>) implementation &mdash; and, to a lesser extent, the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_IG'); ">ideal gas</a> (<samp>IG</samp>) implementation &mdash; can be thought of as a virtual laboratory apparatus; there are "dials" to adjust and quantities to "measure," so we can check against various theoretical results.  Our comparisons below involve the usual $$p$$, $$V$$, $$N$$, and $$k_B T$$, as well as the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Internal_energy">internal energy</a> $$U$$, <samp>HS</samp> particle radius $$R$$, <samp>HS</samp> <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Packing_density">area fraction</a> $$\eta$$, and <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Compressibility_factor">compressibility factor</a> $$Z = \frac{p V}{ N k_B T }$$.</p>

<ul>
<li>The <button type="button" class="btn btn-ssns-demo btn-sm px-1 py-0"><i class="fab fa-fw fa-lg fa-buromobelexperte"></i></button> plot shows the actual container and gas particles in motion.</li>
<li>The <samp>HS</samp> <button type="button" class="btn btn-ssns-demo btn-sm px-1 py-0"><i class="fas fa-fw fa-lg fa-chart-simple"></i></button> <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_PLOT_TYPES'); ">plot type</a> gives a statistical snapshot of gas energies/speeds.  It displays the current histogram with corresponding theory curve plotted on top, allowing one to monitor the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Relaxation_(physics)">approach</a> to equilibrium.  If the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_HS_rho'); ">$$\rho$$</a> and <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_HS_R'); ">$$R$$</a> controls are set to give a single mass, the distributions shown are <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Maxwell%E2%80%93Boltzmann_distribution">Maxwell-Boltzmann</a>; otherwise, they are <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Boltzmann_distribution">Boltzmann</a>.</li>
<li>The <samp>IG</samp> <button type="button" class="btn btn-ssns-demo btn-sm px-1 py-0"><i class="fas fa-fw fa-lg fa-chart-simple"></i></button> plot is not as interesting &mdash; with no particle collisions, it doesn't change with time!  Furthermore, the <samp>IG</samp> gas is initialized at and remains at equilibrium.  Nevertheless, the static histogram and <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Maxwell%E2%80%93Boltzmann_distribution">MB dist.</a> are shown, and can be refreshed via the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_RNG_RECR_TRAJ'); ">RNG seed</a>.</li>
<li>The <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Equation_of_state">equation of state</a> for <samp>IG</samp> is the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Ideal_gas">ideal gas law</a>.  The value of $$T$$ (not $$T_0$$ &mdash; see <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_GAS_MODELS'); ">discussion</a>) is available immediately, as are $$V$$ and $$N$$.  Once a reasonable collision-based value for $$p$$ is <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_GAS_MODELS'); ">measured</a>, we can compute $$Z$$, which, at equilibrium, will equal $$1$$.  The <samp>IG</samp> <button type="button" class="btn btn-ssns-demo btn-sm px-1 py-0"><i class="fas fa-fw fa-lg fa-arrow-trend-up"></i></button> plot shows $$T / T_0$$, $$Z_x$$ and $$Z_y$$ (calculated with $$p_x$$ and $$p_y$$, respectively), and $$Z = \frac{Z_x + Z_y}{2}$$.</li>
<li>The <samp>HS</samp> <button type="button" class="btn btn-ssns-demo btn-sm px-1 py-0"><i class="fas fa-fw fa-lg fa-arrow-trend-up"></i></button> plot shows the same quantities as <samp>IG</samp> <button type="button" class="btn btn-ssns-demo btn-sm px-1 py-0"><i class="fas fa-fw fa-lg fa-arrow-trend-up"></i></button>, as well as the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Packing_density">area fraction</a> $$\eta$$ and $$Z / Z_{\mathrm{SHY}}$$ (see below).  In the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Limit_(mathematics)">limit</a> of $$R, \eta \to 0$$, ideality is recovered.  For $$\eta \lesssim 1$$, $$Z$$ will deviate, but $$Z / Z_{\mathrm{SHY}} \cong 1$$.  $$Z_{\mathrm{SHY}}$$ (<a target="_blank" class="hv_ext_link" href="//doi.org/10.1063/1.470649">Santos et al.</a>; $$\eta_\text{c}$$ defined below) &mdash; one of many approximate hard disk fluid equations of state &mdash; is given by:</li>

%% Z_{\mathrm{SHY}} = \left( 1 - 2 \eta + \frac{2 \eta_\text{c} - 1}{\eta_\text{c}^2} \eta^2 \right)^{-1} %%

<li>The <samp>HS</samp> <button type="button" class="btn btn-ssns-demo btn-sm px-1 py-0"><i class="fas fa-fw fa-lg fa-arrows-spin"></i></button> plot shows a $$p \hspace{0.07em} \text{-} \hspace{-0.07em} V$$ diagram with two <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Isothermal_process">isotherms</a> and one <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Adiabatic_process#Graphing_adiabats">adiabat</a>.  "Hugging" <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Thermodynamic_equilibrium">equilibrium</a> states (keeping <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_HS_v_pist'); ">$$v_{\mathrm{pist.}}$$</a> suitably small) with our <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_GAS_MODELS'); ">adiabatic conditions</a> will move $$(p, V)$$ along an adiabat.  We can also traverse isotherms (even without a <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Thermal_reservoir">heat bath</a>) with certain unphysical piston movements.  An (isothermal) <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Joule_expansion">free expansion</a> is achieved with very large negative <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_HS_v_pist'); ">$$v_{\mathrm{pist.}}$$</a>, expanding much faster than any gas particle is moving.  The diagram below was produced (details <a target="_blank" class="hv_ext_link" href="//github.com/malliaris/SSNS/tree/main/README.md#hard-sphere-gas-p-v-diagram-creation">here</a>) with such free expansions taking $$(p, V)$$ down the orange isotherm, then slow adiabatic compressions up the blue adiabat, and more free expansions down the red isotherm.  (Isothermal) free compressions are also possible at low $$N$$, $$T$$, by having a <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Maxwell%27s_demon">Maxwellian demon</a> depress the piston only when no particles are nearby!</li>

<li>Two <samp>HS</samp> areas not yet explored are: <strong>(1)</strong> area fractions $$\eta \gtrsim 0.4$$ and the fluid/solid <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_PHASE_TRANSITIONS'); ">phase transition</a> at <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Circle_packing">close-packed</a> $$\eta_\text{c} = 0.907$$ <strong>(2)</strong> how well $$Z_{\mathrm{SHY}}$$ describes fluids with <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_HS_rho'); ">$$\rho$$</a>$$\text{-}$$ and/or <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_HS_R'); ">$$R$$</a>$$\text{-}$$distributions.</li>
</ul>

<p><img style="max-width: 100%; " src="/static/images/SSNS/plot_screenshots/HS_PP_isotherm_adiabat.png"></p>


`;







// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -----  HelpViewer SA = SYSTEM AREA PAGES  -------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------

HelpViewer.hvn_lookup_map["HV_SA_SP"].header_txt = String.raw`Stochastic Processes`;
HelpViewer.hvn_lookup_map["HV_SA_SP"].md_txt_html = String.raw`

<p>Stochastic processes have some sort of inherent randomness and therefore require <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Probability_distribution">probability distributions</a> and <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ENSEMBLES'); ">ensembles</a> for their quantitative description.  The relevant categories of stochastic processes are briefly discussed <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_MARKOV_ONE_STEP'); ">here</a>.  The example processes that <strong>SSNS</strong> implements include:</p>

<ul><li>the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_RW'); ">random walk</a></li>
<li>the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_MN'); ">Moran model</a> from <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Population_genetics">population genetics</a></li>
<li>a simple <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_E_NOT_IMPLEMENTED'); ">chemical system</a></li>
<li><a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_E_NOT_IMPLEMENTED'); ">M/M/1 queue</a> from <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/M/M/1_queue">queueing theory</a></li></ul>

<p>The future behavior of a stochastic process generally involves multiple possible <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Phase_space">trajectories</a>.  In contrast, for a fully-described, <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Deterministic_system">deterministic</a> system, the single future trajectory is completely known.  For <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SA_ND'); ">nonlinear</a>, deterministic systems that happen to be <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Chaos_theory">chaotic</a>, this trajectory is extremely sensitive to the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Initial_condition">initial state</a> used.  Uncertainty in that state (or <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Parameter_space">parameters</a>, or <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Mathematical_model">modeling</a>), therefore, leads to uncertainty in the trajectory.</p>

`;



HelpViewer.hvn_lookup_map["HV_SA_SM"].header_txt = String.raw`Statistical Mechanics`;
HelpViewer.hvn_lookup_map["HV_SA_SM"].md_txt_html = String.raw`

<p>Statistical mechanics is the branch of physics that forms the connection between <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Microstate_(statistical_mechanics)">microstates</a> and macrostates for systems with very many (<a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Avogadro_constant">$$ \sim \negthickspace 10^{23} $$</a>) particles.  The field provides theoretical underpinnings for (its older cousin) <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Thermodynamics">thermodynamics</a>, and has produced many surprising observations (e.g., <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Universality_(dynamical_systems)">universality</a>).  <strong>SSNS</strong> implements the following statistical mechanical system types:</p>

<ul>
<li>the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_IG'); ">2D ideal Gas</a></li>
<li><a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_HS'); ">2D hard sphere gas</a></li>
<li>the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_IS'); ">2D Ising model</a></li>
<li>the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_XY'); ">XY model</a></li>
</ul>

<p>The first and second are <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_GAS_MODELS'); ">gas models</a>, and are more intuitive in that one can see gas "particles" bouncing around a container.  The third and fourth are examples of spin systems, which are described more generally <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SPIN_SYSTEMS'); ">here</a>.  Also relevant are these brief comments on <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ENSEMBLES'); ">statistical ensembles</a> and <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_PHASE_TRANSITIONS'); ">phase transitions</a>.</p>

`;



HelpViewer.hvn_lookup_map["HV_SA_ND"].header_txt = String.raw`Nonlinear Dynamics`;
HelpViewer.hvn_lookup_map["HV_SA_ND"].md_txt_html = String.raw`

<p>A <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Linear_differential_equation">linear equation</a> like the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Wave_equation">wave equation</a> has the wonderful property that sums of <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Equation_solving">solutions</a> are also solutions &mdash; think of two oppositely directed water waves "passing through" each other.  <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Nonlinear_system">Nonlinear equations</a> don't have this property.  The field of nonlinear dynamics, happily, provides tools like <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Phase_portrait">phase portraits</a> for studying nonlinear systems without focusing on <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Closed-form_expression">closed form solutions</a>.</p>

<p>Nonlinearity is ubiquitous across <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Science,_technology,_engineering,_and_mathematics">STEM</a> fields, from <a target="_blank" class="hv_ext_link" href="https://tedm.us/quantitative_biology">biology</a>, to <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/List_of_nonlinear_ordinary_differential_equations#Economics_and_finance">economics</a>.  A feature like <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Bistability">bistability</a> will occur in countless systems that have little in common other than their governing equations.  <strong>SSNS</strong> implements the following nonlinear system types:</p>

<ul><li>the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_E_NOT_IMPLEMENTED'); ">Lorenz system (<samp>LZ</samp>)</a></li>
<li>the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_LM'); ">Logistic map (<samp>LM</samp>)</a></li>
<li>the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_GM'); ">Gingerbread-man map (<samp>GM</samp>)</a></li></ul>

<p>All three display <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Chaos_theory">chaotic</a> behavior, with its trademark sensitivity to <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Initial_condition">initial conditions</a>.  While their <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Phase_space">trajectories</a> can appear unpredictable, they are completely <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Deterministic_system">deterministic</a> (as opposed to <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SA_SP'); ">stochastic</a>).</p>

`;



HelpViewer.hvn_lookup_map["HV_SA_FD"].header_txt = String.raw`Fluid Dynamics`;
HelpViewer.hvn_lookup_map["HV_SA_FD"].md_txt_html = String.raw`


<p>In many areas of  physics (e.g., <a target="_blank" class="hv_ext_link" href="https://en.wikipedia.org/wiki/Maxwell%27s_equations">electricity & magnetism</a>, <a target="_blank" class="hv_ext_link" href="https://en.wikipedia.org/wiki/Schr%C3%B6dinger_equation#Linearity">quantum mechanics</a>), the central governing equation is linear, which opens many options for finding <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Equation_solving#Differential_equations">solutions</a>.  <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Fluid">Fluid</a> flow, however, is governed by the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Navier–Stokes_equations">Navier-Stokes equations</a>, which are generally <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SA_ND'); ">nonlinear</a>, due to the presence of a <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Material_derivative">material derivative</a>.  In most cases &mdash; especially for non-trivial problem geometries &mdash; <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Closed-form_expression">analytical techniques</a> will need to be supplemented by <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Computational_fluid_dynamics">computation</a>.</p>

<p>The physical variables and material properties in a fluid flow can generally be combined to form various <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Dimensionless_numbers_in_fluid_mechanics">dimensionless parameters</a>.  The values of these numbers, as well as various physical assumptions, <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Computational_fluid_dynamics#Hierarchy_of_fluid_flow_equations">determine the specific set of equations to solve</a>.  Our first <strong>SSNS</strong> fluid implementation is the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_SH'); ">Sod shock tube (<samp>SH</samp>)</a>, a well-known 1D test case for <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Euler_equations_(fluid_dynamics)">Euler</a> codes.  Such <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Solver">solvers</a> are applicable when fluid <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Viscosity">viscosity</a> and <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Thermal_conductivity_and_resistivity">thermal conductivity</a> can be neglected, but <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Density">density</a> variation is important.  The <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Mach_number">Mach number</a> $$\mathrm{Ma} \sim 1$$ under these conditions, and passing fighter jets create <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Sonic_boom">sonic booms</a>!</p>

<p>Another important dimensionless fluid parameter (besides the Mach number) is the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Reynolds_number">Reynolds number</a> $$\mathrm{Re}$$.  It quantifies the relative importance of <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Inertia">inertial</a> and <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Viscosity">viscous</a> forces.  When $$\mathrm{Re} \ll 1$$, the flow is <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Laminar_flow">laminar</a>, with adjacent fluid layers sliding by each other.  In such conditions, <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Run-and-tumble_motion">bacteria</a> can't drift and <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Stokes_flow#Demonstration_of_time-reversibility">dye droplets "unmix."</a> The opposite flow regime is <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Turbulence">turbulent</a>, corresponding to $$\mathrm{Re} \gg 1$$.  The flow is rough, full of <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Eddy_(fluid_dynamics)">eddies</a>, and often <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Chaos_theory">chaotic</a>.</p>

<p><strong>SSNS</strong> was <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_CODE_DESIGN'); ">designed</a> to run in your <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Web_browser">web browser</a>, and it would not be wise to bog things down with a high resolution 2D <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Karman_vortex_street">vortex street</a> simulation!  Instead, we consider a simple, 2D, low $$\mathrm{Re}$$ system where the fluid flow is incompressible, viscous, laminar, steady, unidirectional, and exactly solvable.  In the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_PF'); ">Rigid Planar Flow (<samp>PF</samp>)</a> system, we construct, analyze and simulate a purely <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Solid_mechanics">solid mechanical</a> analog to that the fluid system.</p>


`;







// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -----  HelpViewer ST = SYSTEM TYPE PAGES  -------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------

HelpViewer.hvn_lookup_map["HV_ST_RW"].header_txt = String.raw`Random Walk`;
HelpViewer.hvn_lookup_map["HV_ST_RW"].md_txt_html = String.raw`


<p><a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Random_walk">Random walks</a> are central to the study of <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SA_SP'); ">stochastic processes</a>.  They come in many variations, but all on a central theme: a sequence of random jumps.  They can be 1D or higher-D, <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Discrete_time_and_continuous_time">continuous or discrete</a>, symmetric or <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Biased_random_walk_on_a_graph">biased</a>.  And they can be <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Random_walk#Applications">applied</a> in diverse areas, from finance to <a target="_blank" class="hv_ext_link" href="https://tedm.us/quantitative_biology">biology</a>.</p>

<p><strong>SSNS</strong> implements a very straightforward walk: 1D, discrete in both space and time, and on a <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Boundary_value_problem">finite interval</a>.  <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SP_RW_l_r'); ">$$ \; \ell $$</a> and <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SP_RW_l_r'); ">$$ r $$</a> representing the probabilities of stepping left and right, respectively.  If $$ \ell \neq r$$, the walk is <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Biased_random_walk_on_a_graph">biased</a>.</p>

<p>Many theoretical extensions of random walks have been explored over the years.  Walks can be given <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_MARKOV_ONE_STEP'); ">memory</a> or told to <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Self-avoiding_walk">avoid themselves</a>.  Questions can be asked regarding <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Markov_chain#Properties">transience</a> or <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/First-hitting-time_model">first passage</a>.  Random walks are especially central when viewed as the microscopic, particle-based foundation of macroscopic, <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Continuum_mechanics">continuum</a>-based <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Diffusion">diffusion</a> and <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Transport_phenomena">transport phenomena</a>.</p>


`;



HelpViewer.hvn_lookup_map["HV_ST_MN"].header_txt = String.raw`Moran Model`;
HelpViewer.hvn_lookup_map["HV_ST_MN"].md_txt_html = String.raw`

<p>The Moran model from <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Population_genetics">population genetics</a>, while highly simplified, nevertheless captures three major evolutionary "forces": <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Mutation">mutation</a>, <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Natural_selection">selection</a>, and <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Genetic_drift">genetic drift</a>.  In it, a fixed-size population of <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SP_MN_N'); ">$$ N $$</a> individuals changes its composition over successive <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Discrete_time_and_continuous_time">discrete time steps</a>.  We track a particular gene that has both an "original" <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Allele">version</a> &mdash; call it $$ A $$ &mdash; and a mutated one $$ A^{\ast} $$.  When "reproducing," an $$ A $$ individual can become $$ A^{\ast} $$ &mdash; or vice versa &mdash; with probability <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SP_MN_mu'); ">$$ \mu $$</a>:

%% A \xrightleftharpoons[\mu]{\mu} A^{\ast}. %%

The variable $$ x $$ represents the number of individuals that possess version $$ A $$.</p>

<p>We also allow for a difference in fitness between $$ A $$ and $$ A^{\ast} $$, as quantified by a <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Selection_coefficient">selection coefficient</a> <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SP_MN_s'); ">$$ s $$</a>.  More on evolution generally can be found <a target="_blank" class="hv_ext_link" href="https://tedm.us/evolution">here</a>.</p>

`;



HelpViewer.hvn_lookup_map["HV_ST_IG"].header_txt = String.raw`Ideal Gas`;
HelpViewer.hvn_lookup_map["HV_ST_IG"].md_txt_html = String.raw`

<p>I believe surveys show the single best remembered equation from introductory science is the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Ideal_gas">ideal gas</a> law, $$P V = n R T$$.  For our <strong>SSNS</strong> implementations, we'll use $$p$$ for pressure and substitute $$n R \to N R / N_A \to N k_B$$ since it would be odd to specify <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_IG_N'); ">$$N$$</a> $$ = 1000$$ particles in <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Mole_(unit)">moles</a>.  Thus, we'll use:</p>
  
%% p V = N k_B T %%

<p>We also implement the slightly more complicated <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_HS'); ">hard sphere gas</a>.  The physical variables, ideas, and implementation details common to both are discussed <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_GAS_MODELS'); ">here</a>.</p>

<p>What makes a gas ideal?  <strong>(1)</strong> The particles <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Point_particle"> take up no space</a> (even if their representation on the screen does), and <strong>(2)</strong> the particles do not "see" (or collide with) each other, i.e. there's no <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Interatomic_potential">inter-particle potential</a>.  This simplifies both analysis and simulation: constant <a target="_blank" class="hv_ext_link" href="https://en.wikipedia.org/wiki/Velocity">velocity</a> motion with occasional bounces off the walls.  The downside is that some real gas behavior, e.g., <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Condensation">condensation</a> into a liquid, is not captured.  (See <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Van_der_Waals_equation">van der Waals equation</a> for more.)</p>


`;



HelpViewer.hvn_lookup_map["HV_ST_HS"].header_txt = String.raw`Hard Sphere Gas`;
HelpViewer.hvn_lookup_map["HV_ST_HS"].md_txt_html = String.raw`


<p>Unlike the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_IG'); ">ideal gas (<samp>IG</samp>)</a>, the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Hard_spheres">hard sphere gas</a> does involve an <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Interatomic_potential">inter-particle potential</a>, which is</p>

%% V(r) = \begin{cases} \infty, \; \; & r < 2 R \\ 0, \; \; & r \ge 2 R, \end{cases} %%

<p>where $$r$$ is the inter-particle distance and <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_HS_R'); ">$$R$$</a> is the particle radius.  Because $$V(r)$$ is <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Step_function">piecewise constant</a>, however, the particles move freely like ideal gas particles except for perfectly <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Elastic_collision">elastic collisions</a> when they touch &mdash; just like billiard balls.</p>

<p>As discussed <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_GAS_MODELS'); ">here</a>, the hard sphere <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Equations_of_motion">equations of motion</a> are <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Deterministic_system">deterministic</a>, and we take advantage of that fact with the following efficient update algorithm.  With the radii, initial positions, and initial velocities of all <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_HS_N'); ">$$N$$</a> particles, we calculate how far into the future each pair would collide, if at all.  These <samp>CollisionEvent</samp> objects are loaded into a main <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Data_structure">data structure</a>, ordered soonest to latest.  While a <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Brute-force_search">brute-force</a> approach would involve the $$O(N^2)$$ checking of each pair for an impending collision, our algorithm processes collisions one-by-one from the top of main data structure, with a reasonable amount of updating of main and auxiliary structures in between.</p>


`;



HelpViewer.hvn_lookup_map["HV_ST_IS"].header_txt = String.raw`Ising Model`;
HelpViewer.hvn_lookup_map["HV_ST_IS"].md_txt_html = String.raw`

<p>In the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Ising_model">Ising model</a>, each <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Spin_(physics)">spin</a> can point either directly into the plane of the screen or directly out.  Our implementation has <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_IS_N'); ">$$ N^2 $$</a> total spins arranged in an $$ N \times N $$ square array.  As is common, we use color to indicate direction so that each tile in our <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Heat_map">heat map</a> is either yellow (pointing in) or dark orange (pointing out).</p>
<p>We have also implemented the Ising model's slightly more complicated cousin, the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_XY'); ">XY model</a>.  Further implementation details and a short description of spin system <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Time_evolution">dynamics</a> can be found <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SPIN_SYSTEMS'); ">here</a>.  Both models display phase-transition-like behavior, which we comment on <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_PHASE_TRANSITIONS'); ">here</a>.</p>

`;



HelpViewer.hvn_lookup_map["HV_ST_XY"].header_txt = String.raw`XY Model`;
HelpViewer.hvn_lookup_map["HV_ST_XY"].md_txt_html = String.raw`

<p>In the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Classical_XY_model">XY model</a>, each <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Spin_(physics)">spin</a> rotates freely like the needle of a compass sitting on the "$$ xy $$" plane of the screen.  Our implementation has <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_XY_N'); ">$$ N^2 $$</a> total spins arranged in an $$ N \times N $$ square array.  Unlike <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_IS'); ">Ising</a> spins, whose two possible directions give a <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Heat_map">heat map</a> with two colors, XY model visualization involves a heat map with a cyclic continuum of colors (like a rainbow).</p>
<p>Further implementation details and a short description of spin system <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Time_evolution">dynamics</a> can be found <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SPIN_SYSTEMS'); ">here</a>.  Both Ising and XY models will display phase-transition-like behavior, which we comment on <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_PHASE_TRANSITIONS'); ">here</a>.  A <em>static</em>, pseudo-artistic visualization of XY model <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Topological_defect#Condensed_matter">vortices</a> can be found <a target="_blank" class="hv_ext_link" href="https://tedm.us/Parameter_Spaces">here</a>.  Finally, take a look at <a target="_blank" class="hv_ext_link" href="//kjslag.github.io/XY/">this</a> higher-performance, <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Graphics_processing_unit">GPU-based</a> XY implementation.</p>

`;



HelpViewer.hvn_lookup_map["HV_ST_LZ"].header_txt = String.raw`Lorenz System`;
HelpViewer.hvn_lookup_map["HV_ST_LZ"].md_txt_html = String.raw`

<p> LZZZZZZZZZZZZZZZz originally meant to model  <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SA_FD'); ">fluid ATMOSPHERIC flow</a>   <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Population_growth">population growth</a>, is now better known as a simple example of <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Chaos_theory">chaotic</a> behavior.  The variable $$ x $$ represents population size as a fraction of <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Carrying_capacity">carrying capacity</a> (the largest possible size given environmental conditions).   equations:</p>

`;



HelpViewer.hvn_lookup_map["HV_ST_LM"].header_txt = String.raw`Logistic Map`;
HelpViewer.hvn_lookup_map["HV_ST_LM"].md_txt_html = String.raw`

<p>The <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Logistic_map">logistic map</a>, originally meant to model <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Population_growth">population growth</a>, is now better known as a simple example of <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Chaos_theory">chaotic</a> behavior.  The variable $$ x $$ represents population size as a fraction of <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Carrying_capacity">carrying capacity</a> (the largest possible size given environmental conditions).  The model's <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Recurrence_relation">update equation</a> is:</p>

%% x_{ \mathrm{next} } = r x (1 - x), %%

<p>where the parameter <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_ND_LM_r'); ">$$ r $$</a> represents a <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Population_growth#Population_growth_rate">growth rate</a>.  For particular $$ r $$ and initial fraction <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_ND_LM_x_0'); ">$$ x_0 $$</a>, the trajectory of the system is completely <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Deterministic_system">determined</a>.  In addition, the trajectories fall into one of several categories based on $$ r $$ value, with simple ones below $$ \cong \negmedspace 3.57 $$ and chaotic ones above.</p>

<p>This <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_ND_LM_IC'); ">meta-parameter</a> button in the interface cycles through interesting $$(r, x_0)$$ combinations.  The default <button type="button" class="btn btn-ssns-demo btn-sm px-1 py-0"><i class="fas fa-fw fa-lg fa-arrow-trend-up"></i></button> <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_PLOT_TYPES'); ">plot type</a> shows $$x(t)$$, while the <button type="button" class="btn btn-ssns-demo btn-sm px-1 py-0"><i class="fas fa-fw fa-lg fa-arrows-spin"></i></button> plot allows recreation of the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Bifurcation_theory">bifurcation diagram</a> (example below; more <a target="_blank" class="hv_ext_link" href="//github.com/malliaris/SSNS/tree/main#logistic-map-bifurcation-diagram-re-creation">here</a>).  Finally, a <em>static</em>, pseudo-artistic visualization of the $$ x(r, t)$$ structure can be found <a target="_blank" class="hv_ext_link" href="https://tedm.us/Parameter_Spaces#LM_entry">here</a>.</p>

<p><img style="max-width: 100%; " src="/static/images/SSNS/plot_screenshots/LM_PP_bifurcation_diagram.png"></p>


`;



HelpViewer.hvn_lookup_map["HV_ST_GM"].header_txt = String.raw`Gingerbread-man Map`;
HelpViewer.hvn_lookup_map["HV_ST_GM"].md_txt_html = String.raw`


<p>It was great to <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/List_of_chaotic_maps">discover</a> an example of a <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Nonlinear_system">nonlinear system</a> that traces out a tasty treat!... albeit in a <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Chaos_theory">chaotic</a> fashion.  The <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Gingerbreadman_map">gingerbread-man map</a> consists of the following two <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Recurrence_relation">update equations</a>:</p>

<!-- KaTeX \phantom{} HACK!... couldn't get \begin{align} environment to work...  -->
%% x_{ \mathrm{next} } = 1 - y + |x| %%
%% y_{ \mathrm{next} } = x \phantom{ - 1 + |y| } %%

<p>Compared to the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_LM'); ">logistic map</a>, we've moved from 1D to 2D (update equations for both $$x$$ and $$y$$).  It now makes sense to use the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Phase_portrait">phase-portrait</a>-like <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_PLOT_TYPES'); ">plot type</a> <button type="button" class="btn btn-ssns-demo btn-sm px-1 py-0"><i class="fas fa-fw fa-lg fa-arrows-spin"></i></button>, in addition to <button type="button" class="btn btn-ssns-demo btn-sm px-1 py-0"><i class="fas fa-fw fa-lg fa-arrow-trend-up"></i></button>.</p>

<p>What about chaotic behavior?  With the logistic map, it was the value of the parameter $$r$$ that separated the trajectories into categories.  But the gingerbread-man map has no parameters!  It turns out that the choice of <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Initial_condition">initial values</a> $$($$<a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_ND_GM_x_0'); ">$$x_0$$</a>$$,$$<a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_ND_GM_y_0'); ">$$y_0$$</a>$$)$$ will determine the type of gingerbread-man trajectory.</p>

<p>The "center" of the gingerbread-man, $$(1,1)$$, is a <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Fixed_point_(mathematics)">fixed point</a> (it continually maps to itself &mdash; try it!).  The "heart" of the gingerbread-man is the elongated hexagon $$ {\small (0,0) \to } $$ $$ {\small (1,0) \to } $$ $$ {\small (2,1) \to } $$ $$ {\small (2,2) \to } $$ $$ {\small (1,2) \to } $$ $$ {\small (0,1) \to } $$ $$ {\small (0,0) } $$.  Setting $$(x_0,y_0)$$ to <em>any point</em> on or inside this region will yield a <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Periodic_sequence">period</a>-6 cycle like the one above.  However, for initial coordinates just outside the region, e.g., $$(1.1, 0)$$, you'll see chaotic trajectories!  More <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_ND_GM_IC'); ">here</a>.</p>

<p>There is much to discover in this simple map.  The original paper by R. L. Devaney is <a target="_blank" class="hv_ext_link" href="https://doi.org/10.1016/0167-2789(84)90187-8">here</a> for those who are interested.</p>


`;



HelpViewer.hvn_lookup_map["HV_ST_SH"].header_txt = String.raw`Sod Shock Tube`;
HelpViewer.hvn_lookup_map["HV_ST_SH"].md_txt_html = String.raw`


<p>The <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Sod_shock_tube">Sod shock tube</a> is a simple fluid system that has become a <em>de facto</em> standard for testing newly written 1D <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Compressible_flow">compressible</a> <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Euler_equations_(fluid_dynamics)#Euler_equations">Euler</a> codes.  We imagine a long thin tube with a diaphragm separating two sections of gas &mdash; left $$L$$ and right $$R$$ &mdash; each at a different set of <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Initial_condition">initial conditions</a>.  We assume a perfect gas with constant <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Heat_capacity">specific heats</a> $$c_p$$ and $$c_v$$, so the relevant variables are mass density $$\rho$$, pressure $$p$$, fluid velocity $$u$$, and <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Speed_of_sound">speed of sound</a> $$c$$.  The <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Mach_number">Mach number</a> $$\mathrm{Ma} = u/c$$ will be of order 1 for these transonic/supersonic flows.  Gas temperature $$T$$ can be determined via $$p = \rho R T$$.  (This equation is the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Ideal_gas_law">ideal gas law</a> &mdash; simulated <a class="hv_link" onclick="window.sim.ui.close_HV_load_ST('IG'); ">here</a> &mdash; with mass density instead of number density $$\mathcal{N}/V$$ and $$R$$ representing the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Gas_constant#Specific_gas_constant">specific gas constant</a>.  Clarification on "perfect" vs. "ideal" nomenclature can be found <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Perfect_gas#Perfect_gas_nomenclature">here</a>.)</p>

<p>In the initial setup, there is no bulk flow on either side ($$u_L = u_R = 0$$), but the pressures and densities are imbalanced, e.g., <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_FD_SH_p'); ">$$p_L$$</a> $$>$$ <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_FD_SH_p'); ">$$p_R$$</a> and <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_FD_SH_rho'); ">$$\rho_L$$</a> $$>$$ <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_FD_SH_rho'); ">$$\rho_R$$</a>.  At $$t = 0$$, the diaphragm is instantaneously removed and the gases are released &mdash; like a dam breaking.  Three waves emerge from the spot where the diaphragm was located: a rightward moving <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Shock_wave">shock wave</a>, a leftward moving rarefaction fan, and a rightward moving contact discontinuity in between them.  The shock and contact waves correspond to <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Classification_of_discontinuities">sudden jumps</a> in gas conditions, so neither has significant width.  The rarefaction fan, on the other hand, grows steadily wider with time.  The gas on the far right and far left of the domain is undisturbed, having not "found out" about the changes yet.  In summary, the domain now consists of regions where &mdash; apart from the rarefaction fan &mdash; the within-region gas conditions stay fixed in time, and all region boundaries move apart from each other with fixed speed.</p>

<p>We have not yet mentioned <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_FD_SH_N'); ">$$N$$</a>, an input parameter related not to the fluid flow directly, but to the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Numerical_methods_for_ordinary_differential_equations">numerical solution</a> of the fluid equations.  We take <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_FD_SH_N'); ">$$N$$</a> points evenly spaced along the tube and, for each, calculate and update a vector $$(\rho, \rho u, \rho e)$$ each time step.  (The first, second, and third components of the update equations enforce conservation of mass, momentum, and energy, respectively).  Our implementation sticks with simple choices for the numerical details: a <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Order_of_accuracy">first-order</a>, <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Upwind_scheme">upwind</a> scheme with Zha-Bilgen <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Flux">flux</a> splitting.  The shock tube also happens to have an exact analytical solution, to which we compare our approximate, numerical results.  After a quick bit of numerical root finding to solve an <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Implicit_function">implicit equation</a>, we obtain the values of the gas variables in each region, and plot those that are constant as thin black horizontal/vertical lines.</p>
  

`;



HelpViewer.hvn_lookup_map["HV_ST_PF"].header_txt = String.raw`Rigid Planar Flow`;
HelpViewer.hvn_lookup_map["HV_ST_PF"].md_txt_html = String.raw`


<p>This system, "Rigid Planar Flow", aims to capture the characteristic behavior (<a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Parabola">parabolic</a> velocity profile, etc.) of <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Couette_flow#Planar_flow_with_pressure_gradient">planar Couette / Poiseuille flow</a>, but without actually solving fluid equations.  The boundaries are the familiar pair of infinite parallel plates with fixed separation $$h$$, but the layers of fluid are replaced by a stack of <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_FD_PF_N'); ">$$N$$</a> infinite rigid slabs, each $$ \ell \times w \times h/N $$.  <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Laminar_flow">Laminar flow</a> is thus built in, and we assume a frictional force between neighboring slabs that is linear in their relative velocity $$\Delta v$$.  An external pressure difference per length <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_FD_PF_Dpol'); ">$$\Delta p / \ell$$</a> is applied across the upstream / downstream faces.  The acceleration of the $$i$$th slab is given by <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Newton%27s_laws_of_motion#Second_law">Newton's 2nd Law</a>:</p>

%% a_i = \frac{ \mu N^2 }{ \rho h^2 } \left( v_{i+1} + v_{i-1} - 2 v_i \right) - \frac{ \Delta p }{ \rho \ell }. %%
  
<p> Here, $$\rho$$ is the mass density and <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_FD_PF_mu'); ">$$\mu$$</a> (akin to a <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Viscosity#Dynamic_viscosity">dynamic viscosity</a>) quantifies the strength of the frictional force.</p>

<p>The <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/System_of_linear_equations">system of</a> <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_FD_PF_N'); ">$$N$$</a> <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/System_of_linear_equations">equations</a> above must be supplemented by <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Boundary_value_problem">boundary conditions</a>, and we choose to allow both top and bottom plates to move at fixed speeds <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_FD_PF_Ut'); ">$$ U_{\mathrm{top}} $$</a> and <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_FD_PF_Ub'); ">$$ U_{\mathrm{bottom}} $$</a>, respectively.  <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Initial_value_problem">Initially</a>, each of the slabs in our stack is motionless, i.e., all $$v_i = 0$$ at $$t = 0$$.  <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Numerical_methods_for_ordinary_differential_equations">Numerical integration</a> then calculates and carries out the slab motion.  Like many <strong>SSNS</strong> systems, this one will always tend toward a <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Steady_state">steady-state</a>.  (Be aware of the sensitive role of the integration time step <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_FD_PF_Ds'); ">$$ \Delta s $$</a> in the steady-state approach, however.)  While the time-dependent motion is only approximate, the steady-state velocity values have the following <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Closed-form_expression">analytical solution</a>:</p>

%% {\footnotesize v_{s,i} = \frac{ (N - i + 1) U_{\mathrm{top}} + i U_{\mathrm{bot.}} }{ N + 1 } - \frac{ \alpha i (N - i + 1) }{2}. } %%

<p>The technical details can be found <a target="_blank" class="hv_link" href="/d/teaching/PF_notes.pdf">here</a>.  Of the two <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_PLOT_TYPES'); ">plot types</a> available, <button type="button" class="btn btn-ssns-demo btn-sm px-1 py-0"><i class="fab fa-fw fa-lg fa-buromobelexperte"></i></button> gives a simple, qualitative animation of the motion, while <button type="button" class="btn btn-ssns-demo btn-sm px-1 py-0"><i class="fas fa-fw fa-lg fa-chart-simple"></i></button> tracks the slab velocities precisely: the $$v_i(t)$$ are shown as blue bars, the $$ v_{s,i} $$ are orange circles, and the velocity profile from the true fluid problem is the orange curve.  Increasing <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_FD_PF_N'); ">$$N$$</a> will bring the orange circles and curve together &mdash; this is the $$ N \to \infty $$ limit discussed in the notes linked above.</p>


`;







// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -----  HelpViewer P = PARAMETER PAGES  ----------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------

HelpViewer.hvn_lookup_map["HV_P_SP_RW_l_r"].header_txt = String.raw`\ell, r`;
HelpViewer.hvn_lookup_map["HV_P_SP_RW_l_r"].md_txt_html = String.raw`

<p>$$ \; \ell $$, $$ r $$ and $$ s = 1 - \ell - r$$ represent the probabilities of stepping left, stepping right, and staying put, respectively.  If $$ \ell \neq r$$, the walk is <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Biased_random_walk_on_a_graph">biased</a>.</p>

`;



HelpViewer.hvn_lookup_map["HV_P_SP_RW_N"].header_txt = String.raw`N`;
HelpViewer.hvn_lookup_map["HV_P_SP_RW_N"].md_txt_html = String.raw`

<p>whole number "length" $$N$$ of the finite random walk interval (the <em>number</em> of sites is $$N + 1$$); allowed values are $$2 \le N \le 10000$$</p>

`;



HelpViewer.hvn_lookup_map["HV_P_SP_RW_x_0"].header_txt = String.raw`x_0`;
HelpViewer.hvn_lookup_map["HV_P_SP_RW_x_0"].md_txt_html = String.raw`

<p>initial position (or site #) of the random walk; a whole number $$ \; 0 \le x_0 \le $$ <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SP_RW_N'); ">$$ N $$</a></p>

`;



HelpViewer.hvn_lookup_map["HV_P_SP_MN_mu"].header_txt = String.raw`\mu`;
HelpViewer.hvn_lookup_map["HV_P_SP_MN_mu"].md_txt_html = String.raw`

<p>the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Mutation_rate">mutation rate</a> as a probability: $$ \; 0 \le \mu \le 1 $$  ADD NOTE ABOUT CASES OF ABSORPTION AT 0 OR 1???</p>

`;



HelpViewer.hvn_lookup_map["HV_P_SP_MN_s"].header_txt = String.raw`s`;
HelpViewer.hvn_lookup_map["HV_P_SP_MN_s"].md_txt_html = String.raw`

<p>the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Selection_coefficient">selection coefficient</a>, which takes values $$ \; ? \le s \le ? $$</p>

`;



HelpViewer.hvn_lookup_map["HV_P_SP_MN_N"].header_txt = String.raw`N`;
HelpViewer.hvn_lookup_map["HV_P_SP_MN_N"].md_txt_html = String.raw`

<p>number of individuals in the population; a whole number $$ \; 2, 3, \ldots $$</p>

`;



HelpViewer.hvn_lookup_map["HV_P_SP_MN_x_0"].header_txt = String.raw`x_0`;
HelpViewer.hvn_lookup_map["HV_P_SP_MN_x_0"].md_txt_html = String.raw`

<p>initial value of the number of individuals <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_MN'); ">$$ x $$</a>; a whole number $$ \; 0 \le x_0 \le $$ <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SP_MN_N'); ">$$ N $$</a></p>

`;



HelpViewer.hvn_lookup_map["HV_P_SM_IG_N"].header_txt = String.raw`N`;
HelpViewer.hvn_lookup_map["HV_P_SM_IG_N"].md_txt_html = String.raw`

<p>the number of gas particles $$ 1 \le N \le 10000 $$</p>

`;



HelpViewer.hvn_lookup_map["HV_P_SM_IG_V"].header_txt = String.raw`V`;
HelpViewer.hvn_lookup_map["HV_P_SM_IG_V"].md_txt_html = String.raw`

<p>volume $$V$$ of the ideal gas sample; $$ 0.1 \le V \le 1 $$; units are discussed <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_GAS_MODELS'); ">here</a>; $$V$$ for the ideal gas is fixed for the entire trajectory (unlike the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_HS'); ">hard sphere gas</a>, where it is indirectly controlled on-the-fly via a <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_HS_v_pist'); ">piston</a>)</p>

`;



HelpViewer.hvn_lookup_map["HV_P_SM_IG_kT0"].header_txt = String.raw`k_B T_0`;
HelpViewer.hvn_lookup_map["HV_P_SM_IG_kT0"].md_txt_html = String.raw`

<p><a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Thermodynamic_temperature">absolute temperature</a> $$T_0$$ multiplied by the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Boltzmann_constant">Boltzmann constant</a> $$k_B$$ so that it has units of energy ($$\mathrm{J}$$); the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Expected_value">expected</a> <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_HS_kT0'); ">total energy</a> of the gas is $$N k_B T_0$$ (details <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_GAS_MODELS'); ">here</a>); while the technically allowed temperature range is $$ {0 \le k_B T_0 \le 10^9} $$, a more reasonable working range is $$ {10^{-2} \le k_B T_0 \le 10^2} $$; the hard-coded (but editable) value of the continuous time increment $$\text{d}s = 0.01$$ was picked so that particles at $$k_B T_0 = 10^{-2}$$ are just barely moving, while the movements of particles at $$k_B T_0 = 10^2$$ are fast but just barely trackable frame-to-frame; more <a target="_blank" class="hv_ext_link" href="//github.com/malliaris/SSNS/tree/main/README.md#general-timeenergyvisualizationcomputation-considerations">here</a></p>

`;



HelpViewer.hvn_lookup_map["HV_P_SM_IG_BC"].header_txt = String.raw`\mathrm{BC}`;
HelpViewer.hvn_lookup_map["HV_P_SM_IG_BC"].md_txt_html = String.raw`

<p>This <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_PRMS_DROPDOWN'); ">meta-parameter</a> button cycles through various <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Boundary_value_problem">boundary conditions</a> ($$\mathrm{BC}$$s) for the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_IG'); ">ideal gas</a>.  Each of the two coordinates, $$x$$ and $$y$$, can have boundaries that are either <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Specular_reflection">reflecting</a> or <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Periodic_boundary_conditions">periodic</a>, yielding four possible $$x|y$$ combinations:</p>

<ul>
<li><span class="lrg_bg_areas">$$\mathrm{reflecting \; in} \; \hat{x} \; | \; \mathrm{reflecting \; in} \; \hat{y}$$</span></li>
<li><span class="lrg_bg_areas">$$\mathrm{reflecting \; in} \; \hat{x} \; | \; \mathrm{periodic \; in} \; \hat{y}$$</span></li>
<li>$$\hspace{0.595em}$$<span class="lrg_bg_areas">$$\mathrm{periodic \; in} \; \hat{x} \; | \; \mathrm{reflecting \; in} \; \hat{y}$$</span></li>
<li>$$\hspace{0.595em}$$<span class="lrg_bg_areas">$$\mathrm{periodic \; in} \; \hat{x} \; | \; \mathrm{periodic \; in} \; \hat{y}$$</span></li>
</ul>

<p>A particle hitting a reflecting boundary bounces, with equal angles of <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Angle_of_incidence_(optics)">incidence</a> and reflection.  A particle hitting a periodic boundary, however, will be "transported" to the equivalent spot on opposite side while maintaining its velocity.</p>

<p>As mentioned <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_GAS_MODELS'); ">here</a>, we "measure" gas <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Pressure">pressure</a> by tracking particle-wall collisions.  Thus, for <span class="lrg_bg_areas">$$\mathrm{periodic \; in} \; \hat{x} \; | \; \mathrm{periodic \; in} \; \hat{y}$$</span>, the ideal gas will display $$p = 0$$!  For simplicity, the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_HS'); ">hard sphere gas</a> only implements reflecting boundary conditions.  It does, however, offer an <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_HS_IC'); ">initial condition</a> called "confinement" for which $$p = 0$$ for most of the trajectory.</p>


`;



HelpViewer.hvn_lookup_map["HV_P_SM_HS_N"].header_txt = String.raw`N`;
HelpViewer.hvn_lookup_map["HV_P_SM_HS_N"].md_txt_html = String.raw`

<p>the number of gas particles $$ 1 \le N \le 1000 $$</p>

`;



HelpViewer.hvn_lookup_map["HV_P_SM_HS_IC"].header_txt = String.raw`\mathrm{IC}`;
HelpViewer.hvn_lookup_map["HV_P_SM_HS_IC"].md_txt_html = String.raw`


<p>The space of possible <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Initial_condition">initial conditions</a> ($$\mathrm{IC}$$s) for the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_HS'); ">hard sphere gas</a> is quite large.  This <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_PRMS_DROPDOWN'); ">meta-parameter button</a> cycles through five interesting ones.  For each, the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Expected_value">expected</a> <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_HS_kT0'); ">total energy</a> is $$N k_B T_0$$.  They are:</p>

<ul><li><span class="lrg_bg_areas">$$\mathrm{single} \; \mathbf{v}_0$$</span>: For this $$\mathrm{IC}$$, the particle <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_HS_R'); ">$$R$$</a>, <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_HS_rho'); ">$$\rho$$</a>, and initial position values are identical to those in <span class="lrg_bg_areas">$$\mathrm{equilibrium}$$</span>.  However, all particles are given the same initial velocity $$\mathbf{v}_0$$ and same randomly chosen direction.</li>
<li><span class="lrg_bg_areas">$$\textrm{im/ex-plosion}$$</span>: The particles are placed on a grid.  Each is given a center-pointing velocity so that, if they were <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_IG'); ">ideal gas</a> particles, all would eventually overlap there.  Instead, they converge and explode in a cascade of collisions.</li>
<li><span class="lrg_bg_areas">$$\mathrm{1D \; oscillators}$$</span>: The particles are placed on a grid.  Each is given a Boltzmann-distributed speed, but directed in either $$\pm \hat{x}$$.  Since all $$v_y = 0$$, each row constitutes a "stack" of particles with bouncing and oscillation within, but not between rows.</li>
<li><span class="lrg_bg_areas">$$\mathrm{equilibrium}$$</span>: An <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Thermodynamic_equilibrium">equilibrium</a> configuration of gas particles is constructed: positions and directions are random, and energies (or speeds) are <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Non-uniform_random_variate_generation">sampled</a> from the appropriate <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_HS_kT0'); ">$$T$$</a>-dependent Boltzmann (or <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Maxwell%E2%80%93Boltzmann_distribution">MB</a>) distribution.</li>
<li><span class="lrg_bg_areas">$$\mathrm{confinement}$$</span>: 12 large, dense particles are arranged in a square; they are touching, motionless, and surround a "cloud" of tiny, light particles.  The latter are initialized with equilibrium positions and velocities, but at a slightly elevated $$T$$, so that the total energy is <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_HS_kT0'); ">$$k_B T_0$$</a> per particle.</li></ul>

<p>Any aspect of the $$\mathrm{IC}$$ that is random may be varied by changing the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_RNG_RECR_TRAJ'); ">seed</a> value.  And, of course, any quantitative description (of, say, the length of time required for the last $$\mathrm{IC}$$'s inner gas to break its confinement) would need to be made in terms of <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ENSEMBLES'); ">ensembles</a>.</p>


`;



HelpViewer.hvn_lookup_map["HV_P_SM_HS_rho"].header_txt = String.raw`\rho`;
HelpViewer.hvn_lookup_map["HV_P_SM_HS_rho"].md_txt_html = String.raw`

<p>The gas particle density <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_PRMS_DROPDOWN'); ">meta-parameter</a> toggles between two settings:</p>

<ul>
<li><span class="lrg_bg_areas">$$\mathrm{single \; value}$$</span>: all particles have the same $$\rho$$</li>
<li><span class="lrg_bg_areas">$$\mathrm{distribution}$$</span>: on creation, each particle has its $$\rho$$ value assigned from a small, fixed number of options</li>
</ul>

<p>The values used for the distribution setting typically span many <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Order_of_magnitude">orders of magnitude</a>, as if some particles were made of foam, and others, of rock.  Each density value is assigned a shade of grey that is then used when drawing the gas, with lighter shades indicating lower densities.</p>

<p>Since the radius $$R$$ of the particles can also be chosen from a distribution (via <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_HS_R'); ">this</a> meta-parameter), our hard sphere gas masses can <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Probability_distribution">vary</a> widely.  A small, light grey particle might be a ping pong ball, while a large, dark grey particle might be a bowling ball.  $$R$$ and $$\rho$$ values are sampled <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Independence_(probability_theory)">independently</a>, so we will also have large, light grey particles (which might be beach balls).  Since we are operating in 2D, we calculate particle mass as $$m = A \rho = \pi R^2 \rho$$.</p>  

`;



HelpViewer.hvn_lookup_map["HV_P_SM_HS_R"].header_txt = String.raw`R`;
HelpViewer.hvn_lookup_map["HV_P_SM_HS_R"].md_txt_html = String.raw`

<p>This is the gas particle radius &mdash; not to be confused with the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Gas_constant">gas constant</a> (also $$R$$) present in the best known form of the ideal gas law (see discussion <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_IG'); ">here</a>).  The <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_PRMS_DROPDOWN'); ">meta-parameter</a> button toggles between two settings:</p>

<ul>
<li><span class="lrg_bg_areas">$$\mathrm{single \; value}$$</span>: all particles have the same $$R$$</li>
<li><span class="lrg_bg_areas">$$\mathrm{distribution}$$</span>: on creation, each particle has its $$R$$ value drawn &mdash; apart from a few adjustments &mdash; from a <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Beta_distribution">beta distribution</a></li>
</ul>

<p>Collisions in the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_IG'); ">ideal gas</a> only occur between a particle and a wall, and &mdash; for stationary and <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Rectilinear_polygon">rectilinear</a> walls &mdash; only involve flipping one velocity <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Euclidean_vector#Decomposition">component</a>.  The hard sphere gas is more complicated, since there are many moving things that can potentially collide.  Our overall update algorithm is discussed <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_HS'); ">here</a>; the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Elastic_collision#Two-dimensional">2D collisions</a> involve two circular particles in contact at a single point, separating into tangential and normal components, etc.</p>

<p>A similar meta-parameter for <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_HS_rho'); ">density</a> means our hard sphere gas can have many possible <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Probability_distribution">distributions</a> of particle mass, and, therefore, of energies and speeds.</p>  

`;



HelpViewer.hvn_lookup_map["HV_P_SM_HS_kT0"].header_txt = String.raw`k_B T_0`;
HelpViewer.hvn_lookup_map["HV_P_SM_HS_kT0"].md_txt_html = String.raw`

<p>initial value of <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Thermodynamic_temperature">absolute temperature</a> $$T_0$$ multiplied by the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Boltzmann_constant">Boltzmann constant</a> $$k_B$$ so that it has units of energy ($$\mathrm{J}$$); for all <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_HS_IC'); ">initial conditions</a>, the total energy of the hard sphere gas will be $$\cong N k_B T_0$$ (details <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_GAS_MODELS'); ">here</a>); while the technically allowed temperature range is $$ {0 \le k_B T_0 \le 10^9} $$, a more reasonable working range is $$ {10^{-2} \le k_B T_0 \le 10^2} $$; the hard-coded (but editable) value of the continuous time increment $$\text{d}s = 0.01$$ was picked so that particles at $$k_B T_0 = 10^{-2}$$ are just barely moving, while the movements of particles at $$k_B T_0 = 10^2$$ are fast but just barely trackable frame-to-frame (more <a target="_blank" class="hv_ext_link" href="//github.com/malliaris/SSNS/tree/main/README.md#general-timeenergyvisualizationcomputation-considerations">here</a>); of course, anticipated <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_SM_HS_v_pist'); ">piston movement</a> should also be taken into account</p>

`;



HelpViewer.hvn_lookup_map["HV_P_SM_HS_v_pist"].header_txt = String.raw`v_{\mathrm{pist.}}`;
HelpViewer.hvn_lookup_map["HV_P_SM_HS_v_pist"].md_txt_html = String.raw`

<p>This is the velocity of the piston, the inner surface of which forms the right wall of the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_HS'); ">hard sphere</a> gas container.  We specify velocity (rather than position) since change in the latter is calculated from the former, and both are involved in <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Elastic_collision">collision</a> calculations.  Positive $$v_{\mathrm{pist.}}$$ is taken to be in the $$-\hat{x}$$ direction, i.e., <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Compression_(physics)">compression</a>.  The piston is assumed infinitely massive, which means a colliding particle will get a $$\Delta v$$ contribution of $$2 v_{\mathrm{pist.}}$$.  We thus limit compression speeds to reasonable values so as not to impart unnecessarily large amounts of energy.  Expansion speeds, however, are allowed to be enormous for reasons discussed <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_GAS_THEORY_COMPARISON'); ">here</a>.  The allowed range is $$ {- 10^{101} \le v_{\mathrm{pist.}} \le 10} $$.</p>

<p>While volume $$V$$ in the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_IG'); ">ideal gas</a> implementation is specified directly, volume in the hard sphere gas is controlled indirectly via $$v_{\mathrm{pist.}}$$.  The two gas models are discussed and compared <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_GAS_MODELS'); ">here</a>.</p>
  

`;



HelpViewer.hvn_lookup_map["HV_P_SM_IS_T"].header_txt = String.raw`T`;
HelpViewer.hvn_lookup_map["HV_P_SM_IS_T"].md_txt_html = String.raw`

<p>the temperature in <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Kelvin">absolute units</a>, so that $$ \; T \ge 0 $$</p>

`;



HelpViewer.hvn_lookup_map["HV_P_SM_IS_h"].header_txt = String.raw`h`;
HelpViewer.hvn_lookup_map["HV_P_SM_IS_h"].md_txt_html = String.raw`

<p>the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Magnetic_field">external field</a>; $$ \; - \infty < h < + \infty $$</p>

`;



HelpViewer.hvn_lookup_map["HV_P_SM_IS_N"].header_txt = String.raw`N`;
HelpViewer.hvn_lookup_map["HV_P_SM_IS_N"].md_txt_html = String.raw`

<p>the number of spins $$ 2 \le N \le 1000 $$ along any side of the square <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Lattice_model_(physics)">lattice</a>, so that the total number is $$ N^2 $$</p>

`;



HelpViewer.hvn_lookup_map["HV_P_SM_XY_T"].header_txt = String.raw`T`;
HelpViewer.hvn_lookup_map["HV_P_SM_XY_T"].md_txt_html = String.raw`

<p>the temperature in <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Kelvin">absolute units</a>, so that $$ \; T \ge 0 $$</p>

`;



HelpViewer.hvn_lookup_map["HV_P_SM_XY_h"].header_txt = String.raw`h`;
HelpViewer.hvn_lookup_map["HV_P_SM_XY_h"].md_txt_html = String.raw`

<p>the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Magnetic_field">external field</a>; $$ \; - \infty < h < + \infty $$</p>

`;



HelpViewer.hvn_lookup_map["HV_P_SM_XY_N"].header_txt = String.raw`N`;
HelpViewer.hvn_lookup_map["HV_P_SM_XY_N"].md_txt_html = String.raw`

<p>the number of spins $$ 2 \le N \le 1000 $$ along any side of the square <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Lattice_model_(physics)">lattice</a>, so that the total number is $$ N^2 $$</p>

`;



HelpViewer.hvn_lookup_map["HV_P_ND_LM_IC"].header_txt = String.raw`\mathrm{IC}`;
HelpViewer.hvn_lookup_map["HV_P_ND_LM_IC"].md_txt_html = String.raw`

<p>This <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_PRMS_DROPDOWN'); ">meta-parameter</a> button cycles through various <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Initial_condition">initial conditions</a> ($$\mathrm{IC}$$s), which, for the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_LM'); ">logistic map</a>, each include an inital value <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_ND_LM_x_0'); ">$$ x_0 $$</a> and a parameter value <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_ND_LM_r'); ">$$ r $$</a>.  The 5 $$(r, x_0)$$ pair options and their respective resulting dynamics are:</p>

<ul>
<li> <span class="lrg_bg_areas">$$(1.25, 0.9999)$$</span>: the trajectory starts with a <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Transient_response">transient</a> dip, lingering near the unstable <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Fixed_point_(mathematics)">fixed point</a> at $$x = 0$$; it then gradually and <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Monotonic_function">monotonically</a> approaches the stable fixed point at $$x_f = \frac{r - 1}{r} = \frac{1}{5}$$ (shown in <span style="color:cyan; font-weight: bold">cyan</span>) </li>
<li> <span class="lrg_bg_areas">$$(3.83, 0.738903394256)$$</span>: the trajectory hovers near the unstable <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Fixed_point_(mathematics)">fixed point</a> $$x_f = \frac{r - 1}{r} \cong 0.7389033942558747$$ (in <span style="color:cyan; font-weight: bold">cyan</span>) before fluctuating wildly and settling in to a <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Periodic_sequence">period</a>-3 cycle around $$t = 224$$</li>
<li> <span class="lrg_bg_areas">$$(3.44, 0.999999999132462)$$</span>: the trajectory displays multiple <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Transient_response">transients</a>, first dipping to hover near the unstable <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Fixed_point_(mathematics)">fixed point</a> at $$x = 0$$, then rising to hover near the unstable <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Fixed_point_(mathematics)">fixed point</a> at $$x_f = \frac{r - 1}{r} \cong 0.7093023255813954$$ (in <span style="color:cyan; font-weight: bold">cyan</span>); it finally settles in to <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Oscillation">oscillations</a> between two values (in <span style="color:yellow; font-weight: bold">yellow</span>) given by:</li>

%% x_{\pm} = \frac{ r + 1 \pm \sqrt{(r - 3)(r + 1)} }{ 2r } %%

<li> <span class="lrg_bg_areas">$$(4, 0.75001)$$</span>: the trajectory hovers near the unstable <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Fixed_point_(mathematics)">fixed point</a> $$x_f = \frac{r - 1}{r} = \frac{3}{4}$$ (in <span style="color:cyan; font-weight: bold">cyan</span>), fluctuates a bit, hovers near the unstable <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Fixed_point_(mathematics)">fixed point</a> at $$x = 0$$, and finally embarks on a chaotic path of high amplitude fluctuations and short, seemingly random stretches hugging those fixed points</li>
<li> <span class="lrg_bg_areas">$$(0.999, 0.5)$$</span>: the trajectory steadily approaches the stable <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Fixed_point_(mathematics)">fixed point</a> at $$x = 0$$; be aware that &mdash; without a <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Logarithmic_scale">logarithmic scale</a> &mdash; small but finite $$x$$ values will be indistinguishable from zero, and that, eventually, <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Arithmetic_underflow">underflow</a> will cause $$x$$ to <em>actually reach zero</em></li>
<!-- 3.44 0.999999999132462 -->
</ul>

`;



HelpViewer.hvn_lookup_map["HV_P_ND_LM_r"].header_txt = String.raw`r`;
HelpViewer.hvn_lookup_map["HV_P_ND_LM_r"].md_txt_html = String.raw`

<p><a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Population_growth#Population_growth_rate">growth rate</a> for the population, taking values $$ \; 0 \le r \le 4 $$; be aware that the trajectory will get "stuck" at $$0$$ for any of the following parameter combinations:</p>
<ul><li>$$r = 0$$ and any $$x_0$$</li>
<li>$$x_0 = 0$$ and any $$r$$</li>
<li>$$r = 4$$ and $$x_0 = 1/2$$</li></ul>

`;



HelpViewer.hvn_lookup_map["HV_P_ND_LM_x_0"].header_txt = String.raw`x_0`;
HelpViewer.hvn_lookup_map["HV_P_ND_LM_x_0"].md_txt_html = String.raw`

<p>initial value of the population fraction <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_LM'); ">$$ x $$</a>; $$ \; 0 \le x_0 \le 1 $$</p>
<p>be aware that the trajectory will get "stuck" at $$0$$ for any of the following parameter combinations:</p>
<ul><li>$$r = 0$$ and any $$x_0$$</li>
<li>$$x_0 = 0$$ and any $$r$$</li>
<li>$$r = 4$$ and $$x_0 = 1/2$$</li>
<li>if $$ 0 < r < 1 $$ for so many time steps that the value of $$x$$ experiences <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Arithmetic_underflow">underflow</a></li></ul>

`;



HelpViewer.hvn_lookup_map["HV_P_ND_GM_IC"].header_txt = String.raw`\mathrm{IC}`;
HelpViewer.hvn_lookup_map["HV_P_ND_GM_IC"].md_txt_html = String.raw`

<p>This <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_PRMS_DROPDOWN'); ">meta-parameter</a> button cycles through various <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Initial_condition">initial conditions</a> ($$\mathrm{IC}$$s), which, for the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_GM'); ">gingerbread-man map</a>, are inital value pairs $$($$<a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_ND_GM_x_0'); ">$$x_0$$</a>$$,$$<a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_P_ND_GM_y_0'); ">$$y_0$$</a>$$)$$.  The 5 options &mdash; and the behavior each leads to &mdash; are:</p>

<ul><li> <span class="lrg_bg_areas">$$(0.9, -2)$$</span>: a <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Chaos_theory">chaotic</a> trajectory that draws the gingerbread-man from the outside in</li>
<li> <span class="lrg_bg_areas">$$(1.1, 0)$$</span>: a <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Chaos_theory">chaotic</a> trajectory that draws the gingerbread-man starting at his "heart" and moving outward</li>
<li> <span class="lrg_bg_areas">$$(0.8, 0.4)$$</span>: a <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Periodic_sequence">period</a>-6 cycle within the gingerbread-man's "heart"</li>
<li> <span class="lrg_bg_areas">$$(5, -0.8)$$</span>: a <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Periodic_sequence">period</a>-114 cycle within the gingerbread-man's "coat"</li>
<li> <span class="lrg_bg_areas">$$(5.73, -2)$$</span>: a <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Chaos_theory">chaotic</a> trajectory that draws the gingerbread-man's "coat"</li></ul>

`;



HelpViewer.hvn_lookup_map["HV_P_ND_GM_x_0"].header_txt = String.raw`x_0`;
HelpViewer.hvn_lookup_map["HV_P_ND_GM_x_0"].md_txt_html = String.raw`

<p>initial value of <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_GM'); ">$$ x $$</a>; $$ \; -2.5 \le x_0 \le 5 $$</p>

`;



HelpViewer.hvn_lookup_map["HV_P_ND_GM_y_0"].header_txt = String.raw`y_0`;
HelpViewer.hvn_lookup_map["HV_P_ND_GM_y_0"].md_txt_html = String.raw`

<p>initial value of <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_GM'); ">$$ y $$</a>; $$ \; -2.5 \le y_0 \le 5 $$</p>

`;



HelpViewer.hvn_lookup_map["HV_P_FD_SH_N"].header_txt = String.raw`N`;
HelpViewer.hvn_lookup_map["HV_P_FD_SH_N"].md_txt_html = String.raw`

<p>number of grid points used in the numerical solution of the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_SH'); ">shock tube</a> fluid equations; higher $$N$$ requires more computational expense &mdash; you will see the calculation "run" slower; on the flip side, the features of the compressible flow, e.g., <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Shock_wave">shock waves</a>, will be better resolved and look "crisper"; we require $$N$$ to be an even number $$\ge 4$$</p>

`;



HelpViewer.hvn_lookup_map["HV_P_FD_SH_rho"].header_txt = String.raw`\rho`;
HelpViewer.hvn_lookup_map["HV_P_FD_SH_rho"].md_txt_html = String.raw`

<p>initial mass densities of the gas on the right $$\rho_R$$ and left $$\rho_L$$ sides of the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_SH'); ">shock tube</a>; in general, $$ \rho > 0 $$</p>

`;



HelpViewer.hvn_lookup_map["HV_P_FD_SH_p"].header_txt = String.raw`p`;
HelpViewer.hvn_lookup_map["HV_P_FD_SH_p"].md_txt_html = String.raw`

<p>initial pressures of the gas on the right $$p_R$$ and left $$p_L$$ sides of the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_SH'); ">shock tube</a>; in general, $$ p > 0 $$</p>

`;



HelpViewer.hvn_lookup_map["HV_P_FD_PF_Dpol"].header_txt = String.raw`\Delta p / \ell`;
HelpViewer.hvn_lookup_map["HV_P_FD_PF_Dpol"].md_txt_html = String.raw`

<p>an external pressure difference per unit length $$\Delta p / \ell$$ is applied across the system's upstream and downstream faces; allowed values are $$ -100 \le \Delta p / \ell \le 100 $$ and negative values correspond to force on the slabs in the $$+\hat{x}$$ direction; it has units of $$\mathrm{Pa/m}$$ and is akin to the pressure gradient $$\text{d}p/\text{d}x$$ in the true fluid system; more on this can be found <a target="_blank" class="hv_link" href="/d/teaching/PF_notes.pdf">here</a></p>

`;



HelpViewer.hvn_lookup_map["HV_P_FD_PF_Ut"].header_txt = String.raw`U_{\mathrm{top}}`;
HelpViewer.hvn_lookup_map["HV_P_FD_PF_Ut"].md_txt_html = String.raw`

<p>velocity in $$\mathrm{m/s}$$ of the top boundary: $$ { -100 \le U_{\mathrm{top}} \le 100 } $$</p>

`;



HelpViewer.hvn_lookup_map["HV_P_FD_PF_Ub"].header_txt = String.raw`U_{\mathrm{bot.}}`;
HelpViewer.hvn_lookup_map["HV_P_FD_PF_Ub"].md_txt_html = String.raw`

<p>velocity in $$\mathrm{m/s}$$ of the bottom boundary: $$ { -100 \le U_{\mathrm{bot.}} \le 100 } $$</p>

`;



HelpViewer.hvn_lookup_map["HV_P_FD_PF_mu"].header_txt = String.raw`\mu`;
HelpViewer.hvn_lookup_map["HV_P_FD_PF_mu"].md_txt_html = String.raw`

<p>the parameter $$ 0.01 \le \mu \le 1 $$ quantifies how effectively momentum is transferred from one slab to its neighbors; it is specific to the <samp>PF</samp> mini-app and akin to a <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Friction#Coefficient_of_friction">frictional coefficient</a> or <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Drag_coefficient">drag coefficient</a>; it is meant to emulate (and has units of) the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Viscosity#Dynamic_viscosity">dynamic viscosity</a> in a true fluid; more on this can be found <a target="_blank" class="hv_link" href="/d/teaching/PF_notes.pdf">here</a></p>

`;



HelpViewer.hvn_lookup_map["HV_P_FD_PF_Ds"].header_txt = String.raw`\Delta s`;
HelpViewer.hvn_lookup_map["HV_P_FD_PF_Ds"].md_txt_html = String.raw`


<p>Size of the time step used in the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Numerical_methods_for_ordinary_differential_equations">numerical integration</a> schemes.  $$ \Delta s $$ represents a jump forward in continuous time and should not be confused with the general <strong>SSNS</strong> quantity $$t$$, which is the discrete trajectory step number in the top button bar of the user interface.  In particular, if $$ { 0 < \Delta s < 1 } $$ is changed mid-trajectory, the flow rate being depicted will change, but the "frame rate" will remain the same.</p>

<p>On loading <strong>SSNS</strong>, a default value for $$ \Delta s $$ is calculated heuristically and placed in the entry field.  The user is free to change this value (or those of other <samp>PF</samp> parameters), but should be aware of issues of <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Numerical_stability">numerical stability</a> &mdash; a $$ \Delta s $$ too small, and system change will be hard to observe; a $$ \Delta s $$ too large, and the system may experience runaway instability, as pictured here:</p>

<img class="hv_fw_img" src="/static/images/SSNS/hv_st_specific_pics/numerical_instability_cropped_2.png">

<p>Velocity values will typically grow very rapidly and eventually <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Floating-point_arithmetic">overflow</a>.  Not to worry, exploration can continue after a quick <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_RELOAD_CMDS'); ">reset</a>!</p>


`;



HelpViewer.hvn_lookup_map["HV_P_FD_PF_N"].header_txt = String.raw`N`;
HelpViewer.hvn_lookup_map["HV_P_FD_PF_N"].md_txt_html = String.raw`

<p>number of slabs $$ 1 \le N \le 100 $$; this number does not include the top and bottom boundaries</p>

`;







// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -----  HelpViewer C = CONTROLS PAGES  -----------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------

HelpViewer.hvn_lookup_map["HV_CTRL_DROPDOWN"].header_txt = String.raw`CTRL Dropdown`;
HelpViewer.hvn_lookup_map["HV_CTRL_DROPDOWN"].md_txt_html = String.raw`

<p>Unlike the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_PRMS_DROPDOWN'); "><samp>PRMS</samp></a> <button type="button" class="btn btn-ssns-demo btn-sm px-1 py-0"><i class="fas fa-fw fa-lg fa-sliders"></i></button> dropdown area (which contains <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SYS_DROPDOWN'); ">system-type</a>-specific quantities), the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_CTRL_DROPDOWN'); "><samp>CTRL</samp></a> <button type="button" class="btn btn-ssns-demo btn-sm px-1 py-0"><i class="fas fa-fw fa-lg fa-calculator"></i></button> dropdown area contains inputs that apply to all (or most) system types.  They relate to trajectory navigation, plotting, etc. and are, from top to bottom:</p>

<ul><li>the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_ONE_STEP_CMDS'); ">one-step commands</a> button bar</li>
<li>the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_PLOT_TYPES'); ">plot types</a> button bar</li>
<li><a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_T_DT_JUMP'); ">trajectory jump time</a> settings</li>
<li><a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_DELAY_WINDOW'); ">delay/window settings</a></li>
<li>trajectory and recording <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_T_0_MAX_STOP'); ">start/stop time</a> settings</li>
<li><a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_RNG_RECR_TRAJ'); ">random number and trajectory re-creation</a> settings (only visible/applicable for stochastic system types: <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SA_SP'); ">SP</a>, <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SA_SM'); ">SM</a>)</li>
<li><a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_SP_ENSEMBLE'); ">ensemble settings</a> (only visible/applicable for <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SA_SP'); ">SP</a> system types)</li>
<li>the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_RELOAD_CMDS'); ">reload commands</a> button bar</li></ul>


`;



HelpViewer.hvn_lookup_map["HV_C_CONTINUOUS_CMDS"].header_txt = String.raw`Continuous Action Commands`;
HelpViewer.hvn_lookup_map["HV_C_CONTINUOUS_CMDS"].md_txt_html = String.raw`

<p>At the top of the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_MAIN_PANEL'); ">main panel</a>, always in view, is this button bar:</p>
<img class="hv_fw_img" src="/static/images/SSNS/hv_interface_pics/continuous_cmd_bar.png">
<p>It offers four commands for continuous trajectory navigation.  In the spot of the fifth "button" is the current time step indicator.  Specifically:</p>

<table class="table table-bordered table-sm">
<tbody>
<tr><td>record trajectory (forward)</td>
<td class="hv_emulated_btn_td"><span class="hv_emulated_btn_span px-2 py-1"><i class="fas fa-fw fa-lg fa-video"></i></span></td></tr>
<tr><td>play recorded trajectory backward</td>
<td class="hv_emulated_btn_td"><span class="hv_emulated_btn_span px-2 py-1"><i class="fas fa-fw fa-lg fa-flip-horizontal fa-play"></i></span></td></tr>
<tr><td>pause play/recording</td>
<td class="hv_emulated_btn_td"><span class="hv_emulated_btn_span px-2 py-1"><i class="fas fa-fw fa-lg fa-pause"></i></span></td></tr>
<tr><td>play recorded trajectory forward</td>
<td class="hv_emulated_btn_td"><span class="hv_emulated_btn_span px-2 py-1"><i class="fas fa-fw fa-lg fa-play"></i></span></td></tr>
<tr><td>indicates current time step</td>
<td class="hv_emulated_btn_td"><span class="t_indicators_etc px-2 py-1" style="white-space: nowrap; ">$$ t = 0 $$</span></td></tr>
</tbody>
</table>

<p>These <em>continuous</em> commands should not be confused with their <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_ONE_STEP_CMDS'); ">one step counterparts</a>.</p>

`;



HelpViewer.hvn_lookup_map["HV_C_ONE_STEP_CMDS"].header_txt = String.raw`One Step Commands`;
HelpViewer.hvn_lookup_map["HV_C_ONE_STEP_CMDS"].md_txt_html = String.raw`

<p>Unlike their <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_CONTINUOUS_CMDS'); ">continuous-action counterparts</a> (which put <strong>SSNS</strong> in "run mode"), these one-step commands:</p>
<img class="hv_fw_img" src="/static/images/SSNS/hv_interface_pics/one_step_cmd_bar.png">
<p>offer trajectory navigation in single steps or jumps.  Their button bar is in the toggle-able <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_CTRL_DROPDOWN'); "><samp>CTRL</samp> dropdown area</a>.  Commands include:</p>

<table class="table table-bordered table-sm">
<tbody>
<tr><td>record one step forward</td>
<td class="hv_emulated_btn_td"><span class="hv_emulated_btn_span px-2 py-1"><span style="white-space: nowrap; "><i class="fas fa-fw fa-video pr-1"></i><samp>STEP</samp></span></span></td></tr>
<tr><td>jump to beginning of trajectory <span style="white-space: nowrap; ">($$t = 0$$,</span> usually)</td>
<td class="hv_emulated_btn_td"><span class="hv_emulated_btn_span px-2 py-1"><i class="fas fa-fw fa-lg fa-backward-fast"></i></span></td></tr>
<tr><td>move one step backward</td>
<td class="hv_emulated_btn_td"><span class="hv_emulated_btn_span px-2 py-1"><i class="fas fa-fw fa-lg fa-backward-step"></i></span></td></tr>
<tr><td>move one step forward</td>
<td class="hv_emulated_btn_td"><span class="hv_emulated_btn_span px-2 py-1"><i class="fas fa-fw fa-lg fa-forward-step"></i></span></td></tr>
<tr><td>jump to end of trajectory ($$t = t_{\mathrm{edge}}$$)</td>
<td class="hv_emulated_btn_td"><span class="hv_emulated_btn_span px-2 py-1"><i class="fas fa-fw fa-lg fa-forward-fast"></i></span></td></tr>
</tbody>
</table>


`;




HelpViewer.hvn_lookup_map["HV_C_PLOT_TYPES"].header_txt = String.raw`Plot Type Bar`;
HelpViewer.hvn_lookup_map["HV_C_PLOT_TYPES"].md_txt_html = String.raw`

<p>For each <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SYS_DROPDOWN'); ">system type</a>, output is visualized with one or more plot types, selectable via this bar in the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_CTRL_DROPDOWN'); "><samp>CTRL</samp> dropdown area</a>:</p>
<img class="hv_fw_img" src="/static/images/SSNS/hv_interface_pics/plot_type_bar.png">

<table class="table table-bordered table-sm">
<tbody>
<tr><td>plot of trajectory(ies); time on the horizontal axis; fixed size <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_DELAY_WINDOW'); ">window</a> follows current $$ t $$</td>
<td class="hv_emulated_btn_td"><span class="hv_emulated_btn_span px-2 py-1"><i class="fas fa-fw fa-lg fa-arrow-trend-up"></i></span></td></tr>
<tr><td>plot of non-$$t$$-dependent function, e.g., a probability distribution $$ P(x) $$; plot <em>refreshes</em> each $$ t $$</td>
<td class="hv_emulated_btn_td"><span class="hv_emulated_btn_span px-2 py-1"><i class="fas fa-fw fa-lg fa-chart-simple"></i></span></td></tr>
<tr><td>a canvas of pixels, used to show the current configuration of a <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Degrees_of_freedom_(mechanics)">high-dimensional</a> system, refreshing each $$ t $$</td>
<td class="hv_emulated_btn_td"><span class="hv_emulated_btn_span px-2 py-1"><i class="fab fa-fw fa-lg fa-buromobelexperte"></i></span></td></tr>
<tr><td>phase plane plot with one data point, e.g., $$ [ x(t), y(t) ] $$, for each of a fixed number of past time steps</td>
<td class="hv_emulated_btn_td"><span class="hv_emulated_btn_span px-2 py-1"><i class="fas fa-fw fa-lg fa-arrows-spin"></i></span></td></tr>
</tbody>
</table>

<p>The currently selected plot type is shown darkened (<button type="button" class="btn btn-ssns-demo btn-sm px-1 py-0" style="margin-left: 1px; "><i class="fas fa-fw fa-lg fa-arrows-spin"></i></button> above), while those not supported by the current system type are disabled (<button type="button" class="btn btn-ssns-demo btn-sm px-1 py-0" style="margin-left: 1px; "><i class="fas fa-fw fa-lg fa-chart-simple"></i></button> and <button type="button" class="btn btn-ssns-demo btn-sm px-1 py-0"><i class="fab fa-fw fa-lg fa-buromobelexperte"></i></button> above).  Switching among available plot types can be done <em>even during recording/playback</em>.</p>

`;



HelpViewer.hvn_lookup_map["HV_C_T_DT_JUMP"].header_txt = String.raw`Trajectory Jumps`;
HelpViewer.hvn_lookup_map["HV_C_T_DT_JUMP"].md_txt_html = String.raw`

<p>The following two controls allow the user to make jumps in a recorded trajectory.</p>
<img class="hv_fw_img" src="/static/images/SSNS/hv_interface_pics/t_delta_t_jumps.png">

<p>To jump to an arbitrary new time, enter it in the $$ t_{\mathrm{jump}} $$ field and press <button type="button" class="btn btn-ssns-demo btn-sm px-1 py-0"><i class="fas fa-fw fa-lg fa-turn-down" data-fa-transform="rotate--90"></i></button>.  To change the current time by a <em>jump of a given size</em>, enter it in the $$ \Delta t $$ field and press <button type="button" class="btn btn-ssns-demo btn-sm px-1 py-0"><i class="fas fa-fw fa-lg fa-turn-down" data-fa-transform="rotate--90"></i></button>.  $$ \Delta t $$ can have any <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Sign_(mathematics)">sign</a>.</p>

<p>These controls are unique in that they have two steps: value entry, then application with <button type="button" class="btn btn-ssns-demo btn-sm px-1 py-0"><i class="fas fa-fw fa-lg fa-turn-down" data-fa-transform="rotate--90"></i></button>.  (The <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_PRMS_DROPDOWN'); ">blue background color</a> refers to the latter.)  This separation can be convenient if looking for <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Periodic_sequence">periodicity</a> in a trajectory: set $$ \Delta t $$ to the period and make repeated jumps.  If $$t$$ changes, but the plot does not, then the periodicity is exact!  Try this with <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_GM'); "><samp>GM</samp></a>.</p>


`;



HelpViewer.hvn_lookup_map["HV_C_DELAY_WINDOW"].header_txt = String.raw`Delay/Window`;
HelpViewer.hvn_lookup_map["HV_C_DELAY_WINDOW"].md_txt_html = String.raw`


<p>The following two controls adjust the visual behavior of the app.  As their <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_PRMS_DROPDOWN'); ">blue background indicates</a>, updated values are used immediately.</p>

<img class="hv_fw_img" src="/static/images/SSNS/hv_interface_pics/delay_window.png">

<p><span class="ctrl_eff_immed p-1">$$ \mathrm{delay} $$</span> sets the number of milliseconds to pause between steps during <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_CONTINUOUS_CMDS'); ">continuous recording/playback</a>.  Its value roughly determines the speed of trajectory motion (with $$ 0 \, \mathrm{ms} $$ of delay being the fastest).</p>

</p><span class="ctrl_eff_immed p-1">$$ \mathrm{window} $$</span> sets the maximum width of trajectory viewable at one time.  It is only visible/applicable for the <button type="button" class="btn btn-ssns-demo btn-sm px-1 py-0"><i class="fas fa-fw fa-lg fa-arrow-trend-up"></i></button> <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_PLOT_TYPES'); ">plot type</a>.  At the start of recording, the width grows along with the trajectory.  When it reaches its max value, it "slides" to keep the current $$t$$ centered.  <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_PLOT_AREA'); ">This screenshot</a> shows a window size of $$30$$.</p>


`;



HelpViewer.hvn_lookup_map["HV_C_T_0_MAX_STOP"].header_txt = String.raw`Trajectory Start/Stop`;
HelpViewer.hvn_lookup_map["HV_C_T_0_MAX_STOP"].md_txt_html = String.raw`

<p>The following three controls have to do with trajectory start/stop times.  The symbol background colors are discussed <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_PRMS_DROPDOWN'); ">here</a>.</p>
<img class="hv_fw_img" src="/static/images/SSNS/hv_interface_pics/t_0_max_stop.png">
<p>Trajectory recording starts at $$ t_0 $$ and <em>cannot exceed</em> $$ t_{\mathrm{max}} $$.  Both $$ t_0 $$ and $$ t_{\mathrm{max}} $$ can have any <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Sign_(mathematics)">sign</a>, as long as $$ t_0 < t_{\mathrm{max}} $$.  $$ \; t_0 $$ defaults to $$0$$.  A system- and parameter-dependent <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_E_T_MAX_REACHED'); ">maximum duration</a> limits how large $$ t_{\mathrm{max}} $$ can be.  It may be edited to a smaller value via its checkbox.  $$ \; t_{\mathrm{max}} $$ should not to be confused with <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_PLOT_AREA'); ">$$ t_{\mathrm{edge}} $$</a>.</p>

<p>If $$ t_{\mathrm{stop}} $$ is enabled with its checkbox, the app will exit <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_CONTINUOUS_CMDS'); ">continuous play/recording mode</a> when $$ t = t_{\mathrm{stop}} $$.  When coordinated with <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_PRMS_DROPDOWN'); ">parameter values</a> and <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_RNG_RECR_TRAJ'); ">random seed</a>, this feature can be used to, say, revisit a particular feature in a <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SA_SP'); ">stochastic trajectory</a>.</p>

`;



HelpViewer.hvn_lookup_map["HV_C_RNG_RECR_TRAJ"].header_txt = String.raw`RNG/Trajectory`;
HelpViewer.hvn_lookup_map["HV_C_RNG_RECR_TRAJ"].md_txt_html = String.raw`

<p>The following two controls affect the handling of random numbers and are only visible/applicable for <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SA_SP'); ">stochastic</a> system types.  The control name background colors are discussed <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_PRMS_DROPDOWN'); ">here</a>.</p>
<img class="hv_fw_img" src="/static/images/SSNS/hv_interface_pics/rng_recreate_traj.png">
<p><span class="ctrl_eff_reload p-1">$$ \mathrm{RNG \, seed} $$</span> is simply the value passed to the <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Pseudorandom_number_generator">pseudorandom number generator</a> to initialize its <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/State_(computer_science)">state</a>.  The <span class="ctrl_eff_immed p-1">$$ \mathrm{recreate \, trajectory} $$</span> control is more subtle, and we illustrate with the following scenario:</p>

<img class="hv_fw_img" src="/static/images/SSNS/hv_interface_pics/recreate_traj_illustrated.png">

<p>In the top trace, the stochastic process is recorded out to $$ t = 22 $$.  In the middle trace, we've rewound to $$ t = 10 $$.  If we then re-record to $$ t = 22 $$ with <span class="ctrl_eff_immed p-1">$$ \mathrm{recreate \, trajectory} $$</span> <strong><em>enabled</em></strong>, the top trace is reproduced.  If, on the other hand, we re-record with it <strong><em>disabled</em></strong>, we will get new output, e.g., the bottom trace.</p>

<p>What's happening?  The <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Pseudorandom_number_generator">generator's</a> <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/State_(computer_science)">state</a> at $$t = 10$$ in the middle does not match its state at $$t = 10$$ in the top &mdash; it changed in producing the top's $$ t = 11 \ldots 22 $$.  If nothing is done to correct this, the bottom trace will differ.  In <strong>SSNS</strong>, generator state is saved at each time step, to give the option of restoring it before re-recording.</p>


`;



HelpViewer.hvn_lookup_map["HV_C_SP_ENSEMBLE"].header_txt = String.raw`Ensemble Members`;
HelpViewer.hvn_lookup_map["HV_C_SP_ENSEMBLE"].md_txt_html = String.raw`


<p>When learning a <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SA_SP'); ">stochastic process</a> like the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ST_MN'); ">Moran model</a>, it's best to examine both individual trajectories (e.g., with <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_PLOT_TYPES'); ">plot type</a> <button type="button" class="btn btn-ssns-demo btn-sm px-1 py-0" style="margin-right: 1px; "><i class="fas fa-fw fa-lg fa-arrow-trend-up"></i></button>) <em>and</em> aggregate <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_ENSEMBLES'); ">ensemble</a> behavior (e.g., with <button type="button" class="btn btn-ssns-demo btn-sm px-1 py-0" style="margin-right: 1px; "><i class="fas fa-fw fa-lg fa-chart-simple"></i></button>).  In these <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_CTRL_DROPDOWN'); "><samp>CTRL</samp></a> dropdown settings:</p>
<img class="hv_fw_img" src="/static/images/SSNS/hv_interface_pics/NI_NG_ensemble.png">

<p>$$N_i$$ sets the number of $$i$$ndividuals for the former plot type, while $$N_g$$ sets the number of $$g$$roup members for the latter.  As the <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_PRMS_DROPDOWN'); ">green background</a> indicates, a <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_C_RELOAD_CMDS'); ">reload</a> is necessary for new values to take effect.</p>

<p>The value of $$N_i$$ is capped since storing individual trajectories is generally more <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Computer_memory">memory-intensive</a>.  The $$N_g$$ machinery saves space by storing only the <em>number</em> of ensemble members at each coordinate $$x$$.  (The $$g$$roup members lose their <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Indistinguishable_particles">identities</a>!)</p>


`;



HelpViewer.hvn_lookup_map["HV_C_RELOAD_CMDS"].header_txt = String.raw`Reload Commands`;
HelpViewer.hvn_lookup_map["HV_C_RELOAD_CMDS"].md_txt_html = String.raw`

<p>A trajectory can always be "rewound" and re-recorded.  A more controlled reset, however, is provided by these commands:</p>
<img class="hv_fw_img" src="/static/images/SSNS/hv_interface_pics/reload_cmd_bar.png">

<p>The <strong>SSNS</strong> code is <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_CODE_ORGANIZATION'); ">organized</a> into <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Class_(computer_programming)">classes</a>.  Recording and storage of trajectory data is handled by the $$\texttt{Trajectory}$$ class.  Since each <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_SYS_DROPDOWN'); ">system type</a> has its own version of this class, its data will still be there if the user explores another and then returns.  Certain <a class="hv_link" onclick="window.sim.ui.hv.show_view('HV_PRMS_DROPDOWN'); ">parameter changes</a> require <a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Class_(computer_programming)">re-instantiation</a> of the $$\texttt{Trajectory}$$ to take effect.  The user can choose to:</p>

<table class="table table-bordered table-sm">
<tbody>
<tr><td>reload current $$\texttt{Trajectory}$$</td>
<td class="hv_emulated_btn_td"><span class="hv_emulated_btn_span px-2 py-1"><span style="white-space: nowrap; "><i class="fas fa-fw fa-rotate-right pr-1"></i><samp>THIS</samp></span></span></td></tr>
<tr><td>reload all $$\texttt{Trajectory} \hspace{0.035cm} $$s</td>
<td class="hv_emulated_btn_td"><span class="hv_emulated_btn_span px-2 py-1"><span style="white-space: nowrap; "><i class="fas fa-fw fa-rotate-right pr-1"></i><samp>ALL</samp></span></span></td></tr>
<tr><td>reload page (<a target="_blank" class="hv_ext_link" href="//en.wikipedia.org/wiki/Web_browser">browser refresh</a>)</td>
<td class="hv_emulated_btn_td"><span class="hv_emulated_btn_span px-2 py-1"><span style="white-space: nowrap; "><i class="fas fa-fw fa-rotate-right pr-1"></i><samp>PAGE</samp></span></span></td></tr>
<tr><td><strong>RESERVED</strong>; e.g., for <a target="_blank" class="hv_ext_link" href="//github.com/malliaris/SSNS/tree/main/README.md#hard-sphere-gas-p-v-diagram-creation">this</a></td>
<td class="hv_emulated_btn_td"><span class="hv_emulated_btn_span pl-4 pr-3 py-1"></span></td></tr>
</tbody>
</table>


`;
