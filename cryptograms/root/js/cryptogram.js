
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
				url : "webservices/getpuzzle.php",
				dataType : 'json',
				async : false,
				success : function(data) {
					cipherLines = data;
				}
			});

			cipherLines = {
				"cipherLines" : cipherLines
			};

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

			jQuery('#submitButton').click(function() {

				// Show processing

				// Get string of solutuion
				var solutionString = getSolutionString();

				// submit synchronous submission

				jQuery.ajax({
					url : "webservices/solvepuzzle.php",
					data : {
						'solution' : solutionString
					},
					dataType : 'json',
					async : false,
					success : function(data) {
						var thing = '';
						for(var key in data.reverseCipher){
							
							if(data.cipherText.indexOf(key) != -1){
								
								showDecryptedChar(key, data.reverseCipher[key]);
								
							}
							
						}
					}
				});

			});

			jQuery('#resetButton').click(function() {

				jQuery('.letterbox').each(function() {

					var currentField = jQuery(this);
					currentField.val('');

				});

				updateLetterTray();

			});

			jQuery('#testButton').click(function() {

				showDecryptedChar('c', 'g');

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

function showDecryptedChar(cipherChar, clearChar) {

	var counter = 0;
	var intVal;
	intVal = setInterval(function() {
		jQuery('.' + cipherChar).html(alphabet[counter]);

		if (alphabet[counter] === clearChar) {
			window.clearInterval(intVal);
			jQuery('.' + cipherChar).html(clearChar);
			
			if(jQuery('.sym'+cipherChar).val() === clearChar){
				jQuery('.sym'+cipherChar).css('background-color','#4EAD1F');
			}else{
				jQuery('.sym'+cipherChar).css('background-color','#F76E6E');
			}
			
		}
		counter++;
	}, 100);

}

Handlebars
		.registerHelper(
				'puzzleCell',
				function(cipherChar) {

					if (punctuation.test(cipherChar)) {
						return new Handlebars.SafeString(
								'<div class="punctuationLetter">' + cipherChar
										+ '</div>');
					} else if ('' === cipherChar || ' ' === cipherChar) {
						return new Handlebars.SafeString(
								'<div class="cipherLetter">' + cipherChar
										+ '</div>');
					} else {
						return new Handlebars.SafeString(
								'<input class="letterbox sym'
										+ cipherChar
										+ '" symbol="'
										+ cipherChar
										+ '" type="text" size="1" maxlength="1"/><div class="cipherLetter '
										+ cipherChar + '">' + cipherChar
										+ '</div>');
					}

				});
