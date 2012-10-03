//Alphabet, used as the basis for available letters.
var alphabet = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
		'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ];

// Regex used to identify punctuation. This will be used in the handlebars
// handler in deciding how a char should be displayed.
var punctuation = RegExp("[,\.-_$%:;'\"!?]");

// Settings configuration
var showLetterTray = true;
var showAnimatedSolution = true;
var loggedInUser = null;

/*
 * Function called when the document is loaded and ready. It will bind controls
 * and set up the initial display of the UI.
 */
jQuery(document).ready(function() {
	try{
		// Bind controls
	
		jQuery('#submitButton').click(function() {
			try {
				solvePuzzle();
			} catch (e) {
				displayErrorPage();
			}
		});
	
		jQuery('#resetButton').click(function() {
			try {
				resetPuzzle();
			} catch (e) {
				displayErrorPage();
			}
		});
	
		jQuery('#settings').click(function() {
			try {
				showsettingsDialog();
			} catch (e) {
				displayErrorPage();
			}
		});
	
		jQuery('.closeModalX').click(function() {
			try {
				closeModalDialogs();
			} catch (e) {
				displayErrorPage();
			}
		});
	
		jQuery('#saveButton').click(function() {
			try {
				saveSettings();
			} catch (e) {
				displayErrorPage();
			}
		});
	
		jQuery('#nextButton').click(function() {
			try {
				nextPuzzle();
			} catch (e) {
				displayErrorPage();
			}
		});
		
		//Load login link using handlebars
		Handlebars.renderFromRemote('handlebars/login.handlebars', null,'.loginBar');
		
		bindPersonaEvents();
	
		// Load initial puzzle
		try {
			loadPuzzle();
		} catch (e) {
			displayErrorPage();
		}
		
		jQuery('input, textarea, password').placeholder();
	}catch(e){
		displayErrorPage();
	}
});

/**
 * ######################################## 
 * LOGIN FUNCTIONS
 * ########################################
 */

/*
 * Perform the mozilla persona login. 
 */
function performPersonaLogin(){
	try{
		closeModalDialogs();
		hideModalBackGround();
		navigator.id.request();
	}catch(e){
		displayErrorPage();
	}
}

/*
 * Function to display the login dialog
 */
function showLoginDialog() {
	try{
		showModalBackGround();
		jQuery('#loginDialog').show();
		centerDialog(jQuery('#loginDialog'));
		jQuery('#userEmail').val('');
		jQuery('#userPassword').val('');
	}catch(e){
		displayErrorPage();
	}
}

/*
 * Function to be called and handle login success from Mozilla Persona
 */
function personaLoginSuccessCallback(result) {
	try{
		var obj = jQuery.parseJSON(result);
		Handlebars.renderFromRemote('handlebars/logout.handlebars', obj,'.loginBar');
		closeModalDialogs();
		hideModalBackGround();
	}catch(e){
		displayErrorPage();
	}
}

/*
 * Function to be called and handle logout success from mozilla Persona 
 */
function personaLogoutSuccessCallback(){
	try{
		window.location.reload();
	}catch(e){
		displayErrorPage();
	}
}

/*
 * Bind Persona Events. 
 */
function bindPersonaEvents() {
	try{
		navigator.id.watch({
			loggedInUser : loggedInUser,
			onlogin : function(assertion) {
				jQuery.ajax({
					type : 'POST',
					url : 'auth/login.php',
					data : {
						assertion : assertion
					},
					success : function(res, status, xhr) {
						personaLoginSuccessCallback(res);
					},
					error : function(res, status, xhr) {
						console.log(err);
						displayErrorPage();
					}
				});
			},
			onlogout : function() {
				jQuery.ajax({
					type : 'POST',
					url : 'auth/logout.php', // This is a URL on your website.
					success : function(res, status, xhr) {
						personaLogoutSuccessCallback();
					},
					error : function(res, status, xhr) {
						console.log(err);
						displayErrorPage();
					}
				});
			}
		});
	}catch(e){
		displayErrorPage();
	}
}

/**
 * ######################################## 
 * SETTINGS FUNCTIONS
 * ########################################
 */
/*
 * Save settings selections from the settings pane
 */
function saveSettings() {
	try{
		closeModalDialogs();
		showProcessingDialog();
		
		// Get selections
		showLetterTray = jQuery("#letter-tray").is(':checked');
		showAnimatedSolution = jQuery("#animation").is(':checked');
	
		// Show/Hide letter tray
		if (showLetterTray) {
			jQuery('.letter-tray').show();
			updateLetterTray();
		} else {
			jQuery('.letter-tray').hide();
		}
	
		closeModalDialogs();
	}catch(e){
		displayErrorPage();
	}
}

/*
 * Show the settings modal panel
 */
function showsettingsDialog() {
	try{
		showModalBackGround();
		jQuery('#settingsDialog').show();
		centerDialog(jQuery('#settingsDialog'));
	}catch(e){
		displayErrorPage();
	}
}

/**
 * ######################################## 
 * HELPER FUNCTIONS
 * ########################################
 */

/*
 * Show processing dialog
 */
function showProcessingDialog(){
	try{
		showModalBackGround();
		jQuery('#processingDialog').show();
		centerDialog(jQuery('#processingDialog'));
	}catch(e){
		displayErrorPage();
	}
}

/*
 * Center a dialog on the screen.
 */
function centerDialog($jQueryDialog){
	try{
		var width = $jQueryDialog.width();
		var height = $jQueryDialog.height();

		var window_width = $(window).width();
		var window_height = $(window).height();

		var top = (window_height / 2) - (height / 2);
		var left = (window_width / 2) - (width / 2);

		$jQueryDialog.css('top', top);
		$jQueryDialog.css('left', left);
	}catch(e){
		displayErrorPage();
	}
}

/*
 * Helper method to redirect to the error page.
 */
function displayErrorPage(){
	window.location = 'error.html';
}

/*
 * Close any open dialogs
 */
function closeModalDialogs() {
	try{
		jQuery('.modalDialog').hide();
		hideModalBackGround();
	}catch(e){
		displayErrorPage();
	}
}

/*
 * Function to show the opaque background which surrounds a modal dialog.
 */
function showModalBackGround() {
	try{
		jQuery('.modalBackGround').show();
	}catch(e){
		displayErrorPage();
	}
}

/*
 * Function to hide the opaque background which surrounds a modal dialog.
 */
function hideModalBackGround() {
	try{
		jQuery('.modalDialog').hide();
		jQuery('.modalBackGround').hide();
	}catch(e){
		displayErrorPage();
	}
}

/**
 * ######################################## 
 * PUZZLE FUNCTIONS
 * ########################################
 */
/*
 * Handle a user entering a letter into one of the textfields. If the letter is
 * used then remove it, if the letter is unused then update the entire puzzle
 * with their choice.
 */
function handleKeyEntry(thisfield) {
	try{
		var textField = jQuery(thisfield);
		var char = textField.val();
	
		if (isLetterUsed(textField)) {
			jQuery('.sym' + textField.attr('symbol')).val('');
		} else {
			jQuery('.sym' + textField.attr('symbol')).val(char);
			updateLetterTray();
		}
	}catch(e){
		displayErrorPage();
	}
}

/*
 * Get the next puzzle
 */
function nextPuzzle(){
	try{
		// Show processing
		showModalBackGround();
		showProcessingDialog();
		
		// Hide submit and reset buttons
		jQuery('#submitButton').show();
		jQuery('#resetButton').show();
		jQuery('#nextButton').hide();
		
		loadPuzzle();
		
		hideModalBackGround();
		closeModalDialogs();
	}catch(e){
		displayErrorPage();
	}
}


/*
 * Reset the puzzle by clearing choices.
 */
function resetPuzzle() {
	try{
		jQuery('.letterbox').each(function() {
			var currentField = jQuery(this);
			currentField.val('');
		});
		updateLetterTray();
	}catch(e){
		displayErrorPage();
	}
}

/*
 * Call the server and fetch a new puzzle, then update the UI to show the new
 * puzzle.
 */
function loadPuzzle() {
	showModalBackGround();
	showProcessingDialog();
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

	Handlebars.renderFromRemote('handlebars/puzzle.handlebars', cipherLines,
			'.puzzle');

	jQuery('.letterbox').keyup(function() {
		try {
			handleKeyEntry(this);
		} catch (e) {
			displayErrorPage();
		}
	});

	updateLetterTray();
	hideModalBackGround();
	closeModalDialogs();
}

/*
 * Submit a puzzle to the server for validation that the entered solution is
 * correct or incorrect
 */
function solvePuzzle() {
	try{
		// Show processing
		showModalBackGround();
		showProcessingDialog();
		
		// Hide submit and reset buttons
		jQuery('#submitButton').hide();
		jQuery('#resetButton').hide();
	
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
				for ( var key in data.reverseCipher) {
					if (data.cipherText.indexOf(key) != -1) {
						showDecryptedChar(key, data.reverseCipher[key]);
					}
				}
			}
		});
		
		// Show next button
		jQuery('#nextButton').show();
		
		closeModalDialogs();
		hideModalBackGround();
	}catch(e){
		displayErrorPage();
	}
}

/*
 * Test if a letter has already been used.
 */
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

/*
 * Build string from letter entries. This will be sent to the server to
 * determine if it is the correct answer.
 */
function getSolutionString() {

	var retVal = '';

	jQuery('.letterbox').each(function() {

		var currentField = jQuery(this);

		retVal += currentField.val();

	});

	return retVal;

}

/*
 * Get un-used letters.
 */
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

/*
 * The panel showing available letters is the "lettertray" this function will
 * update it to reflect what letters have been used or returned to the pool of
 * available.
 */
function updateLetterTray() {

	if (!showLetterTray) {
		return;
	}

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

/*
 * Function which will show the "spinning" chars below the text boxes for a
 * particular cipher character. At the end of this function the correct answer
 * for a cipher character will be displayed.
 */
function showDecryptedChar(cipherChar, clearChar) {

	if (!showAnimatedSolution) {
		var counter;
		for (counter = 0; counter < 26; counter++) {
			if (alphabet[counter] === clearChar) {
				jQuery('.' + cipherChar).html(clearChar);

				if (jQuery('.sym' + cipherChar).val() === clearChar) {
					jQuery('.sym' + cipherChar).css('background-color',
							'#4EAD1F');
				} else {
					jQuery('.sym' + cipherChar).css('background-color',
							'#F76E6E');
				}
			}
		}
	} else {
		var counter = 0;
		var intVal;
		intVal = setInterval(function() {
			jQuery('.' + cipherChar).html(alphabet[counter]);

			if (alphabet[counter] === clearChar) {
				window.clearInterval(intVal);
				jQuery('.' + cipherChar).html(clearChar);

				if (jQuery('.sym' + cipherChar).val() === clearChar) {
					jQuery('.sym' + cipherChar).css('background-color',
							'#4EAD1F');
				} else {
					jQuery('.sym' + cipherChar).css('background-color',
							'#F76E6E');
				}

			}
			counter++;
		}, 100);
	}

}

/**
 * ######################################## 
 * HANDLEBARS FUNCTIONS
 * ########################################
 */
/*
 * Register handlebars helper to display a puzzleCell.
 */
Handlebars
		.registerHelper(
				'puzzleCell',
				function(cipherChar) {
					try{
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
					}catch(e){
						displayErrorPage();
					}
				});
