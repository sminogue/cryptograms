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

var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
//var alphabet = ['a','b','c','d','e','f'];
//
// Function called when the document is loaded and ready.
//
jQuery(document).ready(function() {

	Handlebars.renderFromRemote('handlebars/puzzle.handlebars', cipherLines, '.puzzle');
	
	updateLetterTray();
	
	jQuery('.letterbox').keyup(function() {
		var textField = jQuery(this);
		jQuery('.sym' + textField.attr('symbol')).val(textField.val());
		updateLetterTray();
	});
});


function updateLetterTray(){
	
	var col = 0;
	var rows = [];
	var row = [];
	
	var availableLetters = _.uniq(alphabet);
	
	jQuery('.letterbox').each(function(){
	
		var textField = jQuery(this);
		
		availableLetters = _.without(availableLetters,textField.val());
		
	});
	
	availableLetters = _.sortBy(availableLetters,function(letter){return letter;});
	
	_.each(availableLetters,function(letter){ 
		if(col>0 && col % 5 == 0){
			rows.push(row);
			row = [];
			row.push(letter);
			col = 1;
		}else{
			row.push(letter);
			col++;
		}
	});
	
	rows.push(row);
	
	var model = {"model": rows };
	Handlebars.renderFromRemote('handlebars/letters.handlebars', model, '#available-letters');
	
}


