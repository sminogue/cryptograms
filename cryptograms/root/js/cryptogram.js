

var alphabet = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
		'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ];

var punctuation = RegExp("[,\.-_$%:;'\"!?]");

//
// Function called when the document is loaded and ready.
//
jQuery(document).ready(
		function() {
			var cipherLines = null;
			jQuery.ajax({
				  url: "webservices/getpuzzle.php",
				  dataType: 'json',
				  async: false,
				  success: function(data){
					  cipherLines = data;
				  }
				});
			
			cipherLines = {
					"cipherLines" : cipherLines };
			
			Handlebars.renderFromRemote('handlebars/puzzle.handlebars',
					cipherLines, '.puzzle');

			updateLetterTray();

			jQuery('.letterbox').keyup(function() {
				var textField = jQuery(this);
				var char = textField.val();

				if (isLetterUsed(textField)) {
					jQuery('.sym' + textField.attr('symbol')).val('');
				} else {
					jQuery('.sym' + textField.attr('symbol')).val(char);
					updateLetterTray();
				}
			});
			
			jQuery('#submitButton').click(function(){
				
				//Show processing 
				
				//Get string of solutuion
				var solutionString = getSolutionString();
				
				//submit synchronous submission
				
				
				jQuery.ajax({
					  url: "webservices/solvepuzzle.php",
					  data: {'solution':solutionString},
					  async: false,
					  success: function(data){
						  //Show result
						  jQuery('#result').html(data);
					  }
					});
				
			});
			
			jQuery('#resetButton').click(function(){
				
				jQuery('.letterbox').each(function() {

					var currentField = jQuery(this);
					currentField.val('');

				});
				
				updateLetterTray();
				
			});
			
			
		});

function isLetterUsed(textField) {

	var retVal = false;

	jQuery('.letterbox').each(function() {

		var currentField = jQuery(this);

		if (textField.attr('symbol') != currentField.attr('symbol')) {

			if (textField.val() == currentField.val()) {

				retVal = true;

			}

		}

	});

	return retVal;

}

function getSolutionString() {

	var retVal = '';

	jQuery('.letterbox').each(function() {

		var currentField = jQuery(this);

		retVal += currentField.val();
		
	});

	return retVal;

}

function getAvailableLetters() {
	var availableLetters = _.uniq(alphabet);

	jQuery('.letterbox').each(function() {

		var textField = jQuery(this);

		availableLetters = _.without(availableLetters, textField.val());

	});

	availableLetters = _.sortBy(availableLetters, function(letter) {
		return letter;
	});

	return availableLetters;

}

function updateLetterTray() {

	var col = 0;
	var rows = [];
	var row = [];

	var availableLetters = getAvailableLetters();

	_.each(availableLetters, function(letter) {
		if (col > 0 && col % 5 == 0) {
			rows.push(row);
			row = [];
			row.push(letter);
			col = 1;
		} else {
			row.push(letter);
			col++;
		}
	});

	rows.push(row);

	var model = {
		"model" : rows
	};
	Handlebars.renderFromRemote('handlebars/letters.handlebars', model,
			'#available-letters');

}


Handlebars.registerHelper('puzzleCell',function(cipherChar){
	
	if(punctuation.test(cipherChar)){
		return new Handlebars.SafeString('<div class="punctuationLetter">'+cipherChar+'</div>');
	}else if('' === cipherChar || ' ' === cipherChar){
		return new Handlebars.SafeString('<div class="cipherLetter">'+cipherChar+'</div>');
	}else{
		return new Handlebars.SafeString('<input class="letterbox sym'+cipherChar+'" symbol="'+cipherChar+'" type="text" size="1" maxlength="1"/><div class="cipherLetter">'+cipherChar+'</div>');
	}
	
});
