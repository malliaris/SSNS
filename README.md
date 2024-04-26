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

The central class of the **SSNS** app is the <samp>Trajectory</samp>.  An implemented model/<wbr>map/<wbr>equation/<wbr>process is referred to as a "system type" (for lack of a better term).  Each system type has its own <samp>Trajectory</samp> subclass &mdash; a leaf node on the <a href="/class_diagrams/Trajectory_inheritance_-_no_section_label.svg"><samp>Trajectory</samp> inheritance</a> tree.  Its two-letter [abbreviation](#abbreviations-labels-etc) gives the subclass its name, e.g., <samp>Trajectory_XY</samp>.  There are also intermediate-level subclasses, e.g., <samp>Trajectory_Stoch</samp>.  The XY model uses stochastic machinery, so <samp>Trajectory_XY</samp> inherits from <samp>Trajectory_Stoch</samp>, which inherits from <samp>Trajectory</samp>.

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

The core of the **SSNS** app is ~3000 lines of object-oriented JavaScript.  JavaScript has evolved over many years as the programming language of the web.  Needless to say, is not naturally suited to scientific computation, but it was the logical choice.  The design-stage though process went something like this:

<ul><li>ideally the app would be quick to load in a web browser without installation of anything; to keep things simple, the code would run client-side, and, after loading, would not need to communicate further with the server (i.e., no Ajax); years ago, Java code in the form of an applet might have been considered, but not anymore 😀</li>
<li>The code's The js source code, with its accompanying user interface <samp>SSNS.hmtl</samp>, are freely available on.  And, of course, you can always get a quick peek by viewing the source in your browser.</li>
<li>When it comes to object-oriented programming, JavaScript is probably not the first languages that comes to mind.  Happily, the updated JavaScript standard ~2015 was a big step forward in that it added, among other things, "true" classes.  The language, prior to these additions, used "object" to refer to a key-value-pair container  has a meaning other than a class instance</li>
<li>It's always nice to be able to "outsource" various tasks via the incorporation of external libraries.  For the more typical scientific computing needs like pseudorandom number generation and plotting, the JavaScript offerings were not great.  On the other hand, </li>
<li>fff</li></ul>


## Input/Output

Input to the app is done only via the user interface.  On loading of the page, the app shows the default system type and plots its trajectory.  At that point, the trajectory consists of only a single time point &mdash; the default initial condition &mdash; so pressing "play" will do nothing!  More trajectory must be generated by pressing "record."  Once there are two or more time steps, record/backward-play/pause/forward-play, as well as other trajectory navigation commands, become possible.  (This behavior may be confusing if the user expects something like a music player, while the app is more like an audio recorder.)

In addition to buttons, checkboxes, etc., the app has many text input fields for passing in numbers.  Each input field is presented in a "block," with a symbol/word label on a blue or green background on the left.  Some blocks also have a dedicated "apply" button or related controls to the right.  Under the hood, each input field uses an HTML <samp>&lt;input&gt;</samp> element with <samp>type="number"</samp>.  Note that the presence of small increment/decrement arrows, the popup of numeric keyboards, etc. will all depend on choice of browser and mobile vs. desktop.

In a "layer" one below the raw input fields, each HTML input is managed by an instance of the <samp>UINI</samp> (**U**ser **I**nterface **N**umerical **I**nput) class.  The idea is to both take full advantage of existing web functionality (<samp>&lt;input type="number" ... &gt;</samp>'s features, JavaScript event listeners, etc.) and allow for customized handling where necessary.  The setup includes:

* a first round of input validation via <samp>&lt;input type="number"&gt;</samp> with removal of white space and most non-numeric characters
* subclassing for <samp>int</samp> vs. <samp>float</samp> types, with appropriate treatment of leading zeros, etc.  (Note that this is an SSNS UINI distinction &mdash; JavaScript has only a single multipurpose <samp>Number</samp> type; we rely on the <samp>Number.isInteger()</samp> method.)
* use of the <samp>&lt;input type="number"&gt;</samp> attribute <samp>value</samp> to store the quantity's default value (read in by the <samp>UINI</samp> constructor on loading of the app) and subsequent user-entered values
* an internal, validated, "official" value for the quantity that sits between the HTML input field and places where the quantity is used in <samp>Trajectory</samp> contexts; if input that <strong><em>is not</em></strong> decipherable as a number is received, this internal value is immediately pushed back to the input field
* use of the <samp>&lt;input type="number"&gt;</samp> attributes <samp>min</samp> and <samp>max</samp> to store the quantity's range; if input is received that <strong><em>is</em></strong> decipherable as a number, but is out of range, the input field value is immediately "auto-corrected" to the nearest in-range value
* the pushing of previously entered valid values back to the input field; this occurs for system parameters in moving from one <samp>TrajSeg</samp> to another in the replaying of a recorded <samp>Trajectory</samp>

Outputting trajectory data is not implemented, nor planned, but would be very doable... either saving to disk through the browser or just opening a new tab with text data.  And screenshots are always possible, of course 😀.  Ditto for reading saved trajectory in from disk.

For those who favor the keyboard over the mouse and are on desktop, not mobile:

* hit <samp>TAB</samp> to cycle through input buttons/fields; <samp>SHIFT-TAB</samp> to reverse
* if a button is currently selected, hit or hold <samp>ENTER</samp> to repeatedly "press" it
* if a numerical input is currently selected, hit or hold up/down arrows to change the value

Browser development tools are indispensable when doing development, but can also be handy when just running the code.  <samp>console.log()</samp> is used a fair amount to print informational messages to the JavaScript console.

## Performance

Scientific computing is often geared toward performance, taking advantage, for example, of parallel execution on a computer cluster.  This being a client-side web app, the actual computation takes place in the web browser of your device.  (Closing the browser tab or window is a totally reasonable way to stop all app code execution!)

Most of the SSNS system types require the storing of the values of small number of variables for each time step, and are thus not computationally intensive.  For the stochastic processes, our strategy is to follow a small number of individual trajectories, while large ensembles are only tracked in the aggregate.

The system types where computational strategy required the most thought were the spin systems, where a 2D field of values for each time step makes grid size both update and plotting memory footprint
  canvas element

  The past few decades have seen incredible developments in the use graphics of specialized GPU hardware WebGL <a href="//kjslag.github.io/XY/">here</a> XY
WebGPU
GPGPU machine learning
<samp>PRMS</samp> and <samp>CTRL</samp>
a errors
HTML 5 video element

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
