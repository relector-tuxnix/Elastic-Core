/*
 *
 * If an AJAX request return an HTTP error display it in a pre-defined element called #error-window.
 *
 */
var errorHandler = function(jqXHR, status, error) {

	/* Hide all other windows before showing the error */
	$(".modal").hide();

	arrayIntoUL($("#error-message"), jqXHR.responseJSON.message);

	$('#error-message').show();
	$('#error-window').show();
};


/*
 *
 * Takes a JS array ["1", "2"] and places the item into a pre-defined UL(LI[.default-item]) element in the DOM.
 *
 */
var arrayIntoUL = function(ulElement, jsList) {

	var defaultLI = $(ulElement).find('.default-item').clone();

	$(defaultLI).removeClass();
	$(defaultLI).show();

	$(ulElement).children().not('.default-item').remove();

	for(var i = 0; i < jsList.length; i++) {

		var newLI = $(defaultLI).clone();

		$(newLI).text(jsList[i]);

		$(ulElement).append(newLI);
	}	

	$(ulElement).show();
};
