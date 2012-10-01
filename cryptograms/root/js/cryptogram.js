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

	// Bind controls

	jQuery('#submitButton').click(function() {
		try {
			solvePuzzle();
		} catch (e) {
			window.location = 'error.html';
		}
	});

	jQuery('#resetButton').click(function() {
		try {
			resetPuzzle();
		} catch (e) {
			window.location = 'error.html';
		}
	});

	jQuery('#settings').click(function() {
		try {
			showSettingsPane();
		} catch (e) {
			window.location = 'error.html';
		}
	});

	jQuery('.closeModalX').click(function() {
		try {
			closeModalDialogs();
		} catch (e) {
			window.location = 'error.html';
		}
	});

	jQuery('#saveButton').click(function() {
		try {
			saveSettings();
		} catch (e) {
			window.location = 'error.html';
		}
	});

	bindPersonaEvents();
	
	// Load initial puzzle
	try {
		loadPuzzle();
	} catch (e) {
		window.location = 'error.html';
	}

});

/**
 * ########################################
 *        LOGIN FUNCTIONS
 * ########################################
 */
/*
 * Function to display the login dialog
 */
function showLogin(){
	showModalBackGround();
	jQuery('#loginDialog').show();
}

function loginSuccess(assertion){
	var obj = jQuery.parseJSON( assertion );
	closeModalDialogs();
	hideModalBackGround();
}

function showLogoutLink(){
	jQuery('#loginLink').hide();
	jQuery('#logoutLink').show();
}

function bindPersonaEvents(){
	navigator.id.watch({
		  loggedInUser: loggedInUser,
		  onlogin: function(assertion) {
		    // A user has logged in! Here you need to:
		    // 1. Send the assertion to your backend for verification and to create a session.
		    // 2. Update your UI.
		    jQuery.ajax({ /* <-- This example uses jQuery, but you can use whatever you'd like */
		      type: 'POST',
		      url: 'auth/login.php', // This is a URL on your website.
		      data: {assertion: assertion},
		      success: function(res, status, xhr) { 
		    	  loginSuccess(res); 
		      },
		      error: function(res, status, xhr) { alert("login failure" + res); }
		    });
		  },
		  onlogout: function() {
		    // A user has logged out! Here you need to:
		    // Tear down the user's session by redirecting the user or making a call to your backend.
		    // Also, make that loggedInUser will get set to null on the next page load.
		    // (That's a literal JavaScript null. Not false, 0, or undefined. null.)
			  jQuery.ajax({
		      type: 'POST',
		      url: 'auth/logout.php', // This is a URL on your website.
		      success: function(res, status, xhr) { window.location.reload(); },
		      error: function(res, status, xhr) { alert("logout failure" + res); }
		    });
		  }
		});
}


/**
 * ########################################
 *        SETTINGS FUNCTIONS
 * ########################################
 */
/*
 * Save settings selections from the settings pane
 */
function saveSettings() {

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
}

/*
 * Show the settings modal panel
 */
function showSettingsPane() {
	showModalBackGround();
	jQuery('#settingsPane').show();
}


/**
 * ########################################
 *        HELPER FUNCTIONS
 * ########################################
 */
/*
 * Close the settings modal panel
 */
function closeModalDialogs() {
	jQuery('.modalDialog').hide();
	hideModalBackGround();
}

/*
 * Function to show the opaque background which surrounds a modal dialog.
 */
function showModalBackGround() {
	jQuery('.modalBackGround').show();
}

/*
 * Function to hide the opaque background which surrounds a modal dialog.
 */
function hideModalBackGround() {
	jQuery('.modalDialog').hide();
	jQuery('.modalBackGround').hide();
}


/**
 * ########################################
 *        PUZZLE FUNCTIONS
 * ########################################
 */
/*
 * Handle a user entering a letter into one of the textfields. If the letter is
 * used then remove it, if the letter is unused then update the entire puzzle
 * with their choice.
 */
function handleKeyEntry(thisfield) {
	var textField = jQuery(thisfield);
	var char = textField.val();

	if (isLetterUsed(textField)) {
		jQuery('.sym' + textField.attr('symbol')).val('');
	} else {
		jQuery('.sym' + textField.attr('symbol')).val(char);
		updateLetterTray();
	}
}

/*
 * Reset the puzzle by clearing choices.
 */
function resetPuzzle() {
	jQuery('.letterbox').each(function() {
		var currentField = jQuery(this);
		currentField.val('');
	});
	updateLetterTray();
}

/*
 * Call the server and fetch a new puzzle, then update the UI to show the new
 * puzzle.
 */
function loadPuzzle() {
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
			window.location = 'error.html';
		}
	});

	updateLetterTray();
}

/*
 * Submit a puzzle to the server for validation that the entered solution is
 * correct or incorrect
 */
function solvePuzzle() {

	// Hide submit and reset buttons

	// Show next button

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
			for ( var key in data.reverseCipher) {

				if (data.cipherText.indexOf(key) != -1) {

					showDecryptedChar(key, data.reverseCipher[key]);

				}

			}
		}
	});
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
 *        HANDLEBARS FUNCTIONS
 * ########################################
 */
/*
 * Register handlebars helper to display a puzzleCell.
 */
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
