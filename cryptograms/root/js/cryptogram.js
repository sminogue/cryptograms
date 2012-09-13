var cipher = {
	"ciphertext" : [ {
		"symbol" : "z"
	}, {
		"symbol" : "r"
	}, {
		"symbol" : "t"
	}, {
		"symbol" : "g"
	}, {
		"symbol" : ""
	}, {
		"symbol" : "p"
	}, {
		"symbol" : "l"
	}, {
		"symbol" : "r"
	} ]
};

//
// Function called when the document is loaded and ready.
//
jQuery(document).ready(function() {

	jQuery('.puzzleFrame').handlebars(jQuery('#template'), cipher);

	jQuery('.letterbox').keyup(function() {
		var textField = jQuery(this);
		jQuery('.sym'+textField.attr('symbol')).val( textField.val());
	});
});

/*
 * This is a jQuery plugin which will be used to make using handlebars a little
 * easier. Source:
 * http://thinkvitamin.com/code/handlebars-js-part-3-tips-and-tricks/
 */
(function($) {
	var compiled = {};
	$.fn.handlebars = function(template, data) {
		if (template instanceof jQuery) {
			template = $(template).html();
		}

		compiled[template] = Handlebars.compile(template);
		this.html(compiled[template](data));
	};
})(jQuery);