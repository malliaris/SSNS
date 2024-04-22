# SSNS
**S**imple **S**tochastic and **N**onlinear **S**imulator, a web app

* interface with [Bootstrap](https://getbootstrap.com/) so that app is easy to use from both mobile and desktop browsers
* plotting relies on the [flot library](https://www.flotcharts.org/), or, for heatmaps, the native HTML canvas element
* web typesetting is done using the [KaTeX library](https://www.katex.org/)
* dependencies include:

### Class Hierarchies, etc.
The following classes, which are roughly listed from "largest" (i.e., "outermost") to "smallest," are not part of large class hierarchies, and are often present only as a single instance:

* <samp>SSNS</samp> = **S**imple **S**tochastic and **N**onlinear **S**imulator
* <samp>UserInterface</samp>
* <samp>PlottingMachinery</samp>
* <samp>RunState</samp>
* <samp>UINI</samp> = **U**ser **I**nterface **N**umerical **I**nput
* <samp>HelpViewerNode</samp>
* <samp>HelpViewer</samp>

A few select notes:

* <samp>SSNS</samp>, as the name suggests, is the JavaScript class that encompasses all app logic.  It is instantiated between a pair of <samp>script</samp> tags at the very end of <samp>SSNS.html</samp>
