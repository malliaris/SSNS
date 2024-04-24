# SSNS

### Overview

**SSNS** is a web app that offers interactive exploration **S**imple **S**tochastic and **N**onlinear **S**imulator

* interface with [Bootstrap](https://getbootstrap.com/) so that app is easy to use from both mobile and desktop browsers
* plotting relies on the [flot library](https://www.flotcharts.org/), or, for heatmaps, the native HTML canvas element
* web typesetting is done using the [KaTeX library](https://www.katex.org/)
* dependencies include:

### Where To Find Information

If you're interested in knowing more about the **SSNS** app and its code, here are some places to look:

* the help viewer, which is integrated into the app itself; visit [tedm.us/SSNS](https://tedm.us/SSNS) and click the big yellow "?"
* the JavaScript source code located in the [<samp>/js/</samp>](/js/) directory, and the HTML markup code located in [<samp>SSNS.html</samp>](SSNS.html)
* the README document you are currently viewing
* the [<samp>/class_diagrams/</samp>](/class_diagrams/), which capture the basic, object-oriented structure of the code; individual diagrams (example below) have both <samp>svg</samp> and <samp>pdf</samp> versions, and [<samp>all.pdf</samp>](/class_diagrams/all.pdf) contains all diagrams

<a href="/class_diagrams/Trajectory_inheritance_-_no_section_label.svg"><img src="/class_diagrams/Trajectory_inheritance_-_no_section_label.svg"></a>

While the source code has plenty of comments, it is perhaps not the best place to start.  The app aims to be simple, intuitive, and accessible, so a lot can be learned by bouncing back and forth between the user interface and help viewer.  There is plenty of overlap between the content of the help viewer pages and this README.  In general, the former is organized as a linked network, with each node having ~1 page of information when displayed on a mobile device.  The latter is more verbose, more focused on the code/computation, and doesn't touch on the conceptual side of things.

### Classes, Hierarchies, etc.

The central class of the **SSNS** app is the <samp>Trajectory</samp>.  Each system type has its own, <samp>Trajectory</samp> subclass.  A <samp>Trajectory</samp> object is composed of a <samp>ModelCalc</samp> (which performs all model-specific calculations), one or more <samp>TrajSeg</samp> objects to hold the trajectory data, and supporting variables related to time, etc.  The <samp>TrajSeg</samp> represents the portion of a trajectory where the system evolved with a particular set of system parameter values, and is thus composed of a <samp>Params</samp> object and one or more <samp>Coords</samp> objects.  Each <samp>Coords</samp> object hold all dependent variable(s) data for a single time step &mdash; it could be a single scalar integer value, or a large 2D matrix of floating point values.   , ution allows for   es,  part of large class hierarchies

The following classes, which are roughly listed from "largest" (i.e., "outermost") to "smallest," are not part of large class hierarchies, and are often present only as a single instance:

* <samp>Simulator</samp>
* <samp>UserInterface</samp>
* <samp>PlottingMachinery</samp>
* <samp>RunState</samp>
* <samp>UINI</samp> = **U**ser **I**nterface **N**umerical **I**nput
* <samp>HelpViewerNode</samp>
* <samp>HelpViewer</samp>

A few notes:

* <samp>Simulator</samp> is the JavaScript class that encompasses all **SSNS** app logic.  It is instantiated between a pair of <samp>script</samp> tags at the very end of [<samp>SSNS.html</samp>](SSNS.html)
* <samp>HelpViewer</samp> is a modal-lightbox-based network of help pages, each corresponding to a <samp>HelpViewerNode</samp>; see the [Help Viewer](#help-viewer) section for details and a "sitemap" of node pages.

### Abbreviations, Terms, etc.

<table>
<tbody>
<tr><td>trajectory over time; think: x(t)</td><td><samp>XT</samp></td></tr>
<tr><td>non-time-dependent function; think: histogram H(x)</td><td><samp>HX</samp></td></tr>
<tr><td>array quantitatively colored tiles; think: Heat Map</td><td><samp>HM</samp></td></tr>
<tr><td>dependent variable data point, e.g., [ x(t), y(t) ]; think: Phase Plane</td><td><samp>PP</samp></td></tr>
</tbody>
</table>


<table>
<tbody>
<tr><th colspan="2">general</th></tr>
<tr><td>System Type</td><td><samp>ST</samp></td></tr>
<tr><td>Plot Type</td><td><samp>PT</samp></td></tr>
<tr><td>Help Viewer</td><td><samp>HV</samp></td></tr>
<tr><th>categories of system types</th></tr>
<tr><td>Stochastic Processes</td><td><samp>SP</samp></td></tr>
<tr><td>Statistical Mechanics</td><td><samp>SM</samp></td></tr>
<tr><td>Nonlinear Dynamics</td><td><samp>ND</samp></td></tr>
<tr><td>Fluid Dynamics</td><td><samp>FD</samp></td></tr>
<tr><th>system types</th></tr>
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
<tr><th>plot types</th></tr>
<tr><td>trajectory x(t)</td><td><samp>XT</samp></td></tr>
<tr><td>histogram H(x)</td><td><samp>HX</samp></td></tr>
<tr><td>Heat Map</td><td><samp>HM</samp></td></tr>
<tr><td>Phase Plane</td><td><samp>PP</samp></td></tr>
</tbody>
</table>

### Input/Output

Input to the app is done only via the user interface.  On loading of the page, the app shows the default system type and plots its trajectory.  At that point, the trajectory consists of only a single time point &mdash; the default initial condition &mdash; so pressing "play" will do nothing!  More trajectory must be generated by pressing "record."  Once there are two or more time steps, record/backward-play/pause/forward-play, as well as other trajectory navigation commands, become possible.  (This behavior may be confusing if the user expects something like a music player, while the app is more like an audio recorder.)

In addition to buttons, checkboxes, etc., the app has many text input fields for passing in numbers.  Each input field is presented in a "block," with a symbol/word label on a blue or green background on the left.  Some blocks also have a dedicated "apply" button or related controls to the right.  Under the hood, each input field uses an HTML <samp>&lt;input&gt;</samp> element with <samp>type="number"</samp>.  Note that the presence of small increment/decrement arrows, the popup of numeric keyboards, etc. will all depend on choice of browser and mobile vs. desktop.

In a "layer" one below the raw input fields, each HTML input is managed by an instance of the <samp>UINI</samp> (**U**ser **I**nterface **N**umerical **I**nput) class.  The idea is to both take full advantage of existing web functionality (<samp>&lt;input type="number" ... &gt;</samp>'s features, JavaScript event listeners, etc.) and allow for customized handling where necessary.  The setup includes:

* a first round of input validation via <samp>&lt;input type="number"&gt;</samp> with removal of white space and most non-numeric characters
* subclassing for <samp>int</samp> vs. <samp>float</samp> types, with appropriate treatment of leading zeros, etc.  (Note that this is an SSNS UINI distinction &mdash; JavaScript has only a single multipurpose <samp>Number</samp> type; we rely on the <samp>Number.isInteger()</samp> method.)
* use of the <samp>&lt;input type="number"&gt;</samp> attribute <samp>value</samp> to store the quantity's default value (read in by the <samp>UINI</samp> constructor on loading of the app) and subsequent user-entered values
* an internal, validated, "official" value for the quantity that sits between the HTML input field and places where the quantity is used in <samp>Trajectory</samp> contexts; if input that <strong><em>is not</em></strong> decipherable as a number is received, this internal value is immediately pushed back to the input field
* use of the <samp>&lt;input type="number"&gt;</samp> attributes <samp>min</samp> and <samp>max</samp> to store the quantity's range; if input is received that <strong><em>is</em></strong> decipherable as a number, but is out of range, the input field value is immediately "auto-corrected" to the nearest in-range value
* the pushing of previously entered valid values back to the input field; this occurs for system parameters in moving from one <samp>TrajSeg</samp> to another in the replaying of a recorded <samp>Trajectory</samp>

Outputting trajectory data is not implemented, nor planned, but would be very doable... either saving to disk through the browser or just opening a new tab with text data.  And screenshots are always possible, of course 😀.  Similarly, reading saved trajectory in from disk is neither implemented nor planned.

Keyboard shortcuts

console.log messages



<table>
<tbody>
<tr><td>plot of trajectory(ies); time on the horizontal axis; fixed size window follows current time</td><td><samp>XT</samp></td></tr>
<tr><td>plot of non-time-dependent function, e.g., a probability distribution, that refreshes each time step</td><td><samp>HX</samp></td></tr>
<tr><td>heat map array of tiles that refreshes each time step; variable value indicated by color of tile</td><td><samp>HM</samp></td></tr>
<tr><td>phase plane plot with one data point, e.g., (x, y) dependent variable values, for each of a fixed number of past time steps</td><td><samp>PP</samp></td></tr>
</tbody>
</table>




### Help Viewer
blah blah

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
