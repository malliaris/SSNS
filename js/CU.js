
///////////////////////////////////////////////////////////////////////////////////////////////
////////  UTILITY CLASSES  ////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
////////  classes that are handy but have no strong relationship to the overall project  //////
///////////////////////////////////////////////////////////////////////////////////////////////


// convenience utility (CU) methods -- all static, for easy access without instantiation
// NOTE: for those that are CSS/jQuery-based and take string identifier argument, leave leading "#" off -- it will be added!

class RootFinding {

    // basic bisection root bracketing routine... just returns NaN instead of root if methods fails for now...
    static bisect_method(fxn, a, b, tolerance, max_iterations) {

	if (Math.sign(fxn(a)) == Math.sign(fxn(b))) return NaN;  // fxn(a) and fxn(b) must have opposite signs
	for (let i = 0; i < max_iterations; i++) {
	    let c = (a + b)/2.0;  // new midpoint
	    if ((fxn(c) == 0) || ((b - a)/2.0 < tolerance)) {
		return c;
	    }
	    if (Math.sign(fxn(c)) == Math.sign(fxn(a))) {
		a = c;
	    } else {
		b = c;
	    }
	}
	return NaN;
    }
}


class CU {

    static gs(str_id) {  // gs = get string
	return $("#" + str_id).val();
    }
    static gi(str_id) {  // gi = get int
	return parseInt($("#" + str_id).val());
    }
    static gf(str_id) {  // gf = get float
	return parseFloat($("#" + str_id).val());
    }
    static sv(str_id, new_val) {  // s = set value (int or float input, but stored as a string I think)
	$("#" + str_id).val(new_val);
    }
    static gmn(str_id) {  // gmn = get min
	return $("#" + str_id).attr("min");
    }
    static gmx(str_id) {  // gmx = get max
	return $("#" + str_id).attr("max");
    }
    static smn(str_id, new_min_val) {  // smn = set min
	$("#" + str_id).attr("min", new_min_val);
    }
    static smx(str_id, new_max_val) {  // smx = set max
	$("#" + str_id).attr("max", new_max_val);
    }
    static sh(str_id, new_html) {  // sh = set html, e.g., between open/close pair of html tags
	$("#" + str_id).html(new_html);
    }
    static sk(str_id, tex_str) {  // sk = set katex, i.e., render a dynamically generated LaTeX string
	katex.render(tex_str, document.getElementById(str_id), {throwOnError: false});  // heads up: only works with js, not jQuery
    }
    static gcb(str_id) {  // gcb = get check box value
	return $("#" + str_id).is(":checked");
    }
    // NOTE: grb() arg is **name**, while srb() arg is **id** in, e.g., <input type="radio" name="UI_ST" id="UI_ST_ND_LM">
    static grb(str_id) {  // grb = get radio button value
	return $("input[name='" + str_id + "']:checked").val();
    }
    // NOTE: grb() arg is **name**, while srb() arg is **id** in, e.g., <input type="radio" name="UI_ST" id="UI_ST_ND_LM">
    static srb(str_id) {  // srb = set radio button value
	$("#" + str_id).prop("checked", true);
    }
    static eb(str_id) {  // NEEDED?  eb = enable button
    	$("#" + str_id).removeClass("disabled");  // NOTE: enabling an already enabled button is not an error -- it has no net effect
    }
    static db(str_id) {  // NEEDED?  db = disable button
    	$("#" + str_id).addClass("disabled");  // NOTE: disabling an already disabled button is not an error -- it has no net effect
    }
    static gmv(va, vb, vc) {  // gmv = get middle value, i.e., the one that's between the other two numerically
    	let arr_to_sort = [ va, vb, vc ];  // assemble array of all three
	return arr_to_sort.sort( (U,V) => U - V )[1];  // after sorting numerically, the middle value (index [1]) is the one we want...
    }
    static scal_mult_vect(vprod, s, v) {  // multiply each element of the passed-in ndarray v by the scalar s, placing the result in vprod
	if (vprod.length != v.length) {
	    console.log("ERROR in scal_mult_vect(): vectors have unequal lengths!");
	} else {
	    for (let i = 0; i < vprod.length; i++) {
		vprod.set(i, s * v.get(i));
	    }
	}
    }
    static copy_vect(vsrc, vdest) {  // copy vsrc into vdest
	if (vsrc.length != vdest.length) {
	    console.log("ERROR in copy_vect(): vectors have unequal lengths!");
	} else {
	    for (let i = 0; i < vsrc.length; i++) {
		vdest.set(i, vsrc.get(i));
	    }
	}
    }
    static add_vects(vsum, va, vb) {  // add vectors va and vb element-wise, putting the result in vsum; "references" vsum, va, and vb can refer to same container(s)
	if ((vsum.length != va.length) || (vsum.length != vb.length)) {
	    console.log("ERROR in add_vects(): vectors have unequal lengths!");
	} else {
	    for (let i = 0; i < vsum.length; i++) {
		vsum.set(i, va.get(i) + vb.get(i));
	    }
	}
    }
    static incr_entry_OM(om, k) {  // for OrderedMap om (from js-sdsl library), if om[k] exists, do om[k] += 1, else insert om[k] = 1
	let orig_v = om.getElementByKey(k);
	if (orig_v == undefined) {
	    om.setElement(k, 1);
	} else {
	    om.setElement(k, orig_v + 1);
	}
    }
    static decr_entry_OM(om, k) {  // ***value interpreted as a count***, i.e., element should only be present if value v >= 1; for OrderedMap om (from js-sdsl library), decrement entry
	let orig_v = om.getElementByKey(k);
	if ((orig_v != undefined) && (orig_v >= 1)) {  // if om[k] doesn't exist or om[k] < 1, print an error (below)
	    if (orig_v > 1) {
		om.setElement(k, orig_v - 1);  // decrement with element remaining in OM
	    } else {
		om.eraseElementByKey(k);  // decrementing 1 --> 0 means element should just be removed from OM
	    }
	} else {
	    console.log("ERROR in decr_entry_OM(): either OM entry doesn't exist or value is < 1!");
	}
    }
    static add_to_entry_OM(om, k, v) {  // for OrderedMap om (from js-sdsl library), if om[k] exists, do om[k] += v, else insert om[k] = v
	if (v > 0) {  // don't do anything if v == 0
	    let orig_v = om.getElementByKey(k);
	    if (orig_v == undefined) {
		om.setElement(k, v);
	    } else {
		om.setElement(k, orig_v + v);
	    }
	}
    }
    static print_stats_OM(om) {
	let sum = 0;
	om.forEach((element, index) => {
	    sum += element[1];
	});
	console.log("OM x_min, x_max, x_span_p1, #_x_entries, sum:\t", om.front()[0], om.back()[0], (om.back()[0] - om.front()[0] + 1), om.size(), sum);
    }
    static ppOM(om) {  // ppOM = pretty print OrderedMap (from js-sdsl library)
	om.forEach((element, index) => {
	    console.log("ppOM:\t", element[0], element[1], index);
	});
    }
}
