## Overview

**SSNS** is a web app that offers interactive exploration of various simple models/maps/equations/processes from a variety STEM fields.  The common theme is that they all involve straightforward update equations and display stochastic and/or nonlinear behavior.  In that sense, **SSNS** is a **S**imple **S**tochastic and **N**onlinear **S**imulator.

Being a web app, **SSNS** makes heavy use of HTML/CSS.  All computation and logic is done in object-oriented JavaScript &mdash; a "back-end" that actually runs client-side in the web browser.  The front-end is a user interface built with [Bootstrap](https://getbootstrap.com/) and [flot](https://www.flotcharts.org/) plotting.  Read on for details...

## Where To Find Things

**SSNS** can always be found "live" at [tedm.us/SSNS](https://tedm.us/SSNS).  If you're interested in knowing more about the app's design and code, here are some places to look:

* the app's integrated help viewer; visit [tedm.us/SSNS](https://tedm.us/SSNS) and click the big yellow "?"
* the JavaScript source located in [<samp>/js/</samp>](/js/), and the HTML source in [<samp>SSNS.html</samp>](SSNS.html)
* this README document
* the [<samp>/class_diagrams/</samp>](/class_diagrams/), which summarize the structure of the code; individual diagrams (example below) in both <samp>svg</samp> and <samp>pdf</samp>, and [<samp>all.pdf</samp>](/class_diagrams/all.pdf), which contains all diagrams

<a href="/class_diagrams/Trajectory_inheritance_-_no_section_label.svg"><img src="/class_diagrams/Trajectory_inheritance_-_no_section_label.svg"></a>

The source code is well structured and commented, but not the fastest way to get the gist of things.  The app itself aims to be simple, intuitive, and accessible &mdash; diving right in and relying on the integrated help viewer is a great way to get started.  There is plenty of overlap between the content of the help viewer pages and this README.  However, the former is organized as a linked network of small chunks of info, while the latter is more verbose, more focused on the code/computation, and doesn't discuss the conceptual side of things.

## Classes, Hierarchies, etc.

The example class diagram pictured above and its companions in the [<samp>/class_diagrams/</samp>](/class_diagrams/) directory capture the structure of the **SSNS** code.  Individual diagrams will be linked to in this section as they come up.

The central class of the **SSNS** app is the <samp>Trajectory</samp>.  An implemented model/map/equation/process is referred to as a "system type" (for lack of a better term).  Each system type has its own <samp>Trajectory</samp> subclass &mdash; a leaf node on the <a href="/class_diagrams/Trajectory_inheritance_-_no_section_label.svg"><samp>Trajectory</samp> inheritance</a> tree.  Its two-letter [abbreviation](#abbreviations-labels-etc) gives the subclass its name, e.g., <samp>Trajectory_XY</samp>.  There are also intermediate-level subclasses, e.g., <samp>Trajectory_Stoch</samp>.  The XY model uses stochastic machinery, so <samp>Trajectory_XY</samp> inherits from <samp>Trajectory_Stoch</samp>, which inherits from <samp>Trajectory</samp>.

A <samp>Trajectory</samp> object contains everything needed to generate output &mdash; and store it for "playback" &mdash; via discrete-time update equations.  Each <samp>Trajectory</samp> is <a href="/class_diagrams/Trajectory_composition_-_no_section_label.svg">composed</a> of a <samp>ModelCalc</samp> object (to perform all model-specific calculations), and one or more <samp>TrajSeg</samp> objects to hold the trajectory data.  A <samp>TrajSeg</samp> represents a portion ("segment") of a trajectory evolved with a particular set of parameter values.  It is thus <a href="/class_diagrams/TrajSeg_composition_-_no_section_label.svg">composed</a> of one <samp>Params</samp> object and one or more <samp>Coords</samp> objects.  Each <samp>Coords</samp> holds all dependent variable data for a single time step &mdash; it could be a single scalar value, or a large 2D matrix of values, integer or floating point, etc.

There are system-type-dependent class hierarchies for <a href="/class_diagrams/Coords_inheritance.svg"><samp>Coords</samp></a> objects, <a href="/class_diagrams/Params_inheritance.svg"><samp>Params</samp></a> objects, and <a href="/class_diagrams/ModelCalc_inheritance.svg"><samp>ModelCalc</samp></a> objects.  At the cost of some flexibility, it was possible to keep the <samp>TrajSeg</samp> class system-type-independent, so it <em>does not</em> have a hierarchy.  On the data visualization side of things, there is an inheritance hierarchy for the <samp>PlotType</samp> class.  It does not have a diagram, but is fairly straightforward and described in the section on [abbreviations](#abbreviations-labels-etc).

The following classes, which are listed roughly from "largest" (i.e., "outermost") to "smallest," are not part of the <samp>Trajectory</samp> "ecosystem."  They do not have large class hierarchies, and are mainly used as single instances:

* <samp>Simulator</samp><br/>Class that encompasses all **SSNS** app logic.  Instantiated between a pair of <samp>script</samp> tags at end of [<samp>SSNS.html</samp>](SSNS.html).
* <samp>UserInterface</samp>
* <samp>PlottingMachinery</samp>
* <samp>RunState</samp><br/>Trajectory creation/navigation can be done either in a continuous-action mode (e.g., hit "Record" and let it run), or in one-off step/jumps.  This class keeps track of what mode the app is in, what direction it is "running," etc.
* <samp>UINI</samp> = **U**ser **I**nterface **N**umerical **I**nput<br/>See [Input/Output](#inputoutput) section.
* <samp>HelpViewerNode</samp>
* <samp>HelpViewer</samp><br/>A modal-lightbox-based network of help pages, always accessible by clicking the big yellow "?".  Each help page is represented by a <samp>HelpViewerNode</samp>, and identified by an <samp>id</samp> like <samp>HV_ST_XY</samp> (the **H**elp **V**iewer page for **S**ystem **T**ype <samp>XY</samp>).  See [abbreviations](#abbreviations-labels-etc) and [Help Viewer "Sitemap"](#help-viewer-sitemap) for more.

The **SSNS** JavaScript code is separated into several source files, all located in the [<samp>/js/</samp>](/js/) directory.  The following table indicates which of the above-described classes each source file contains.

<table>
<tbody>
<tr><td><samp>UINI.js</samp></td><td><samp>UINI</samp></td></tr>
<tr><td><samp>.js</samp></td><td><samp>FILL INNNNNNNNNNNNNNNN</samp></td></tr>
<tr><td><samp>.js</samp></td><td><samp>FILL INNNNNNNNNNNNNNNN</samp></td></tr>
<tr><td><samp>.js</samp></td><td><samp>FILL INNNNNNNNNNNNNNNN</samp></td></tr>
</tbody>
</table>

## External Libraries, Dependencies

There are many fantastic JavaScript libraries out there!  **SSNS** relies on:

* [stdlib.js](https://stdlib.io/)<br/>for data structures, statistics, and pseudorandom number generation
* [flot](https://www.flotcharts.org/)<br/>for creating plots of trajectory data (flot does not have support for heat maps, so the native HTML <samp>&lt;canvas&gt;</samp> element is used instead)
* [Bootstrap](https://getbootstrap.com/)<br/>for UI components and responsive layout that displays well on both mobile and desktop browsers
* [KaTeX](https://www.katex.org/)<br/>for typesetting of math expressions
* [jQuery](https://jquery.com/)<br/>for simple and concise interaction with the HTML DOM
* [Font Awesome](https://fontawesome.com/)<br/>for nifty icons

For convenience, a minified bundle of all of these JavaScript dependencies is available in [<samp>SSNS_dependencies.js</samp>](SSNS_dependencies.js).  There is version info within it.  As for stylesheets, the [<samp>SSNS.html</samp>](SSNS.html) <samp>&lt;head&gt;</samp> section has links to the CSS files for the Bootstrap and KaTeX libraries, as well as [<samp>SSNS.css</samp>](SSNS.css), which contains a small amount of **SSNS**-specific styling.

## Abbreviations, Labels, etc.

If you're trying to orient yourself in the code, the table of abbreviations below should keep things from feeling like total alphabet soup!

Many of the code's JavaScript variable names use two-letter abbreviations to indicate category, subcategory, etc.  For example, when using the Logistic Map (<samp>LM</samp>) system type, the derived class involved is <samp>Trajectory_LM</samp>.  <samp>PlotType</samp> derived classes contain two such abbreviations, e.g., <samp>PlotTypeXT_LM</samp>; the first abbreviation corresponds to the intermediate level branches in the <samp>PlotType</samp> [class hierarchy](#classes-hierarchies-etc); the second abbreviation, to the leaf nodes.

<table>
<tbody>
<tr><th colspan="2">general</th></tr>
<tr><td>Simple Stochastic and Nonlinear Simulator</td><td><samp>SSNS</samp></td></tr>
<tr><td>User Interface Numerical Input</td><td><samp>UINI</samp></td></tr>
<tr><td>System Type</td><td><samp>ST</samp></td></tr>
<tr><td>Plot Type</td><td><samp>PT</samp></td></tr>
<tr><td>User Interface</td><td><samp>UI</samp></td></tr>
<tr><td>Help Viewer</td><td><samp>HV</samp></td></tr>
<tr><th colspan="2">areas of system types</th></tr>
<tr><td>Stochastic Processes</td><td><samp>SP</samp></td></tr>
<tr><td>Statistical Mechanics</td><td><samp>SM</samp></td></tr>
<tr><td>Nonlinear Dynamics</td><td><samp>ND</samp></td></tr>
<tr><td>Fluid Dynamics</td><td><samp>FD</samp></td></tr>
<tr><th colspan="2">system types</th></tr>
<tr><td>Random Walk</td><td><samp>RW</samp></td></tr>
<tr><td>Moran Model</td><td><samp>MN</samp></td></tr>
<tr><td>M/M/1 Queue</td><td><samp>QU</samp></td></tr>
<tr><td>Chemical System</td><td><samp>CH</samp></td></tr>
<tr><td>2D Ideal Gas</td><td><samp>IG</samp></td></tr>
<tr><td>2D Ising Model</td><td><samp>IS</samp></td></tr>
<tr><td>XY Model</td><td><samp>XY</samp></td></tr>
<tr><td>Logistic Map</td><td><samp>LM</samp></td></tr>
<tr><td>Gingerbread-man Map</td><td><samp>GM</samp></td></tr>
<tr><td>1D Euler Shock Tube</td><td><samp>EU</samp></td></tr>
<tr><td>Rigid Planar Flow</td><td><samp>PF</samp></td></tr>
<tr><th colspan="2">plot types</th></tr>
<tr><td>trajectory x(t)</td><td><samp>XT</samp></td></tr>
<tr><td>histogram H(x)</td><td><samp>HX</samp></td></tr>
<tr><td>Heat Map</td><td><samp>HM</samp></td></tr>
<tr><td>Phase Plane</td><td><samp>PP</samp></td></tr>
</tbody>
</table>

These abbreviations are also used in HTML element <samp>id</samp> attributes.  For instance <samp>UI_P_SP_MN_mu</samp> stands for "User Interface &mdash; Parameters &mdash; Stochastic Processes &mdash; Moran Model &mdash; parameter mu."  Every two-letter abbreviation above is unique ***across all categories***.

## Computation in JavaScript

The core of the **SSNS** app is ~3000 lines of object-oriented JavaScript.  The JavaScript language has evolved over many years as the programming language of the web.  Scientific computation has never been its forte, but it was the logical choice for us.  The design-stage thinking went something like this:

* The app needed to load relatively quickly in a web browser, and without the need to install anything.  To keep things simple, the code would run client-side, and, after loading, would not need to communicate further with the server (i.e., no Ajax).  Years ago, Java code in the form of an applet might have been considered, but not anymore 😀 The app needed to be straightforward to use, and accessible.  With JavaScript, an enormous number of tools are available to facilitate .  WEB DEV TOOLS, JS CONSOLE you can always get a quick peek by viewing the source in your browser.
* JavaScript is not known for its object-oriented programming capabilities.  It has long had "objects," but the term refers to a particular type of key-value-pair container rather than a class instance.  Happily, the 2015 revised standard added, among other things, "true" classes, with inheritance, standard nomenclature, etc.  It is still not possible to have multiple constructors (due to fundamental language limitations), but there are workarounds for this.  Overall, JavaScript met the code's anticipated [structural](#classes-hierarchies-etc) needs just fine.
* Good, straightforward plotting was needed.  The doesn't seem to be a single web plotting library that offers, say, what [matplotlib](https://matplotlib.org/) does in the Python world.  Most refined web plotting libraries tend to focus on data exploration and novel visualization techniques.  The [flot](https://www.flotcharts.org/) library served our purposes for the most part.  It is lightweight and has good auto-scaling.
* Solid pseudorandom number generating capabilities were needed.  JavaScript's <samp>Math.random()</samp> does not appear to allow seeding or accessing the generator's state, but [stdlib.js](https://stdlib.io/) proved sufficient in this area.

* TOUCH ON THESE??? [Bootstrap](https://getbootstrap.com/)<br/>for UI components and responsive layout that displays well on both mobile and desktop browsers [Font Awesome](https://fontawesome.com/)<br/>for nifty icons



## Input/Output

All input to the app is done via the user interface.  On load, the app plots the trajectory of the default system type.  At that point, there is only one time point &mdash; the default initial condition &mdash; so pressing "play" does nothing!  More trajectory must be generated by pressing "record."  With two or more time steps, all trajectory navigation commands become available.  (Some users might expect something like a music player, but the app is more like an audio recorder.)

In addition to buttons and checkboxes, the app has many text input fields for passing in numbers.  Each is presented in a "block," with a symbol/word label on a blue or green background on the left.  Some blocks also have related controls on the right.  Under the hood, each input field uses an HTML <samp>&lt;input&gt;</samp> element with <samp>type="number"</samp>.  Note that many numeric input features, e.g., small increment/decrement arrows or popup numeric keyboards, will depend on choice of browser and screen width.

In the "layer" just below the HTML input fields, each input is managed by an instance of the <samp>UINI</samp> (**U**ser **I**nterface **N**umerical **I**nput) class.  This way, we can take advantage of existing web functionality, e.g., <samp>js</samp> event listeners, while still inserting customized handling where necessary.  The <samp>UINI</samp> class involves:

* a first round of input cleaning as <samp>&lt;input type="number"&gt;</samp> removes white space and most non-numeric characters
* subclasses <samp>UINI_int</samp> and <samp>UINI_float</samp>, with appropriate treatment of leading zeros, etc.  (JavaScript has only a single multipurpose <samp>Number</samp> type, so we rely on <samp>Number.isInteger()</samp>)
* use of the <samp>&lt;input&gt;</samp> element's <samp>value</samp> attribute to store the quantity's default value (read on app load by <samp>UINI</samp> constructor) and subsequent user-entered values
* an internal, "official," validated value for the quantity; it sits between the UI and <samp>Trajectory</samp> "insertion points"; if user input is received that is ***not*** a decipherable number, this internal value is immediately pushed back to the UI
* use of the <samp>&lt;input&gt;</samp> element's <samp>min</samp> and <samp>max</samp> attributes to store the quantity's range; if user input is received that ***is*** a decipherable number, but is out of range, it is immediately "auto-corrected" to the nearest in-range value
* the pushing of previously entered valid values back to the UI; this occurs for system parameters when crossing <samp>TrajSeg</samp> boundaries during "playback"

Outputting trajectory data is not implemented, nor planned, but would be very doable, e.g., by saving to disk or opening a new tab with text data.  Screenshots are always possible, of course 😀.  Reading saved trajectory data from disk also not implemented, nor planned, but doable.

For those who favor keyboard over mouse and desktop over mobile:

* hit <samp>TAB</samp> to cycle through input buttons/fields; <samp>SHIFT-TAB</samp> to reverse
* if a button is currently selected, hit or hold <samp>ENTER</samp> to repeatedly "press" it
* if a numerical input is currently selected, hit or hold up/down arrows to change the value

Browser developer tools are indispensable when doing development, but also handy when running the code.  A number of <samp>console.log()</samp> statements are embedded in the JavaScript to print informational messages for convenience.

## To Do/Fix/Add/Explore

* If you happen to spot a lingering bug, please [report it](https://github.com/malliaris/SSNS/issues).  Comments, suggestions, reports of suspected bugs also welcome!

* ADDING NEW ST's

* Most of the SSNS system types track one (or maybe a handful) of dependent variables over time, and so the derived <samp>Coords</samp> object for these systems will have a very small memory footprint.  Notable exceptions are the <samp>SM</samp> spin systems <samp>IS</samp> and <samp>XY</samp> &mdash; for them, the <samp>Coords</samp> object holds a 2D field of spin values, and thus can be orders of magnitude larger.  Since we don't want to put the task of **SSNS** memory management on the browser &#x1F642;, our choices for capping the footprint of the <samp>Trajectory</samp>s of these spin systems are: (1) statically cap both grid size <samp>N</samp> and max duration <samp>t_max</samp> (2) adaptive caps so that larger grids are allowed for shorter trajectories, and vice versa (3) something more clever.<br/><br/>We already have in place a required <samp>get_max_num_t_steps()</samp> method for each <samp>Trajectory</samp> to allow for customized max duration calculations.  Another angle to pursue is to reconsider exactly what information is stored in the spin <samp>Coords</samp> object.  Currently, the Metropolis Monte-Carlo algorithm by which these system types evolve modifies either 0 or 1 spins each time step.  The <samp>CoordTransition_Spin</samp> class is a lightweight auxiliary class that stores only this potential 1 spin change between consecutive spin array configurations.  It is certainly possible to reconstruct an entire trajectory from, say, the initial array configuration plus the transition information for each subsequent time step.  This potential approach is complicated by the fact that we currently use the HTML <samp>&lt;canvas&gt;</samp> element for spin system plotting, and also by the fact that it's possible to incorporate Metropolis "candidate moves" where more than 1 spin are changed.  See the code comments around <samp>CoordTransition_Spin</samp> in ADDJSFILENAMEANDLINK.js and <samp>PlotTypeHM</samp> in ADDJSFILENAMEANDLINK.js.  Also see next bullet point, which is related.

* GPU hardware WebGL <a href="//kjslag.github.io/XY/">here</a> XY WebGPU GPGPU machine learning <samp>PRMS</samp> and <samp>CTRL</samp> a errors HTML 5 video element

## Help Viewer "Sitemap"

	    HV_HOME
		HV_USING
		    HV_PLOT_AREA
		    HV_MAIN_PANEL
		    HV_C_CONTINUOUS_CMDS
		    HV_PRMS_DROPDOWN
		    HV_CTRL_DROPDOWN
			HV_C_ONE_STEP_CMDS
			HV_C_PLOT_TYPES
			HV_C_T_DT_JUMP
			HV_C_DELAY_WINDOW
			HV_C_T_0_MAX_STOP
			HV_C_RNG_RECR_TRAJ
			HV_C_SP_ENSEMBLE
			HV_C_RELOAD_CMDS
		    HV_SYS_DROPDOWN
		    HV_HELP_VIEWER
		HV_COMPUTATION
		    HV_CODE_ORGANIZATION
		    HV_CODE_DEPENDENCIES
		    HV_CODE_LIMITATIONS
		    HV_CODE_IO
		    HV_ERRORS
			HV_E_T_MAX_REACHED
		HV_CONCEPTS
		    HV_ENSEMBLES
		    HV_MARKOV_ONE_STEP
		    HV_SPIN_SYSTEMS
		    HV_PHASE_TRANSITIONS
		    HV_SA_SP
			HV_ST_MN
			    HV_P_SP_MN_mu
			    HV_P_SP_MN_s
			    HV_P_SP_MN_N
			    HV_P_SP_MN_x_0
		    HV_SA_SM
			HV_ST_IS
			    HV_P_SM_IS_T
			    HV_P_SM_IS_h
			    HV_P_SM_IS_N
			HV_ST_XY
			    HV_P_SM_XY_T
			    HV_P_SM_XY_h
			    HV_P_SM_XY_N
		    HV_SA_ND
			HV_ST_LM
			    HV_P_ND_LM_r
			    HV_P_ND_LM_x_0
			HV_ST_GM
			    HV_P_ND_GM_x_0
			    HV_P_ND_GM_y_0
		    HV_SA_FD
			HV_ST_EU
			HV_ST_PF
		    HV_MINI_SCENARIOS
