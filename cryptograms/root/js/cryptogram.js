var cipherLines = {"cipherLines":[ [ {
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
} ], [ {
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
} ] ]};

//
// Function called when the document is loaded and ready.
//
jQuery(document).ready(function() {

	Handlebars.renderFromRemote('/handlebars/puzzle.handlebars', cipherLines, '.puzzleFrame');
	
	jQuery('.letterbox').keyup(function() {
		var textField = jQuery(this);
		jQuery('.sym' + textField.attr('symbol')).val(textField.val());
	});
});
