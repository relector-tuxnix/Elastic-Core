/* 
 * This builds the dialog box and binds the dialog buttons to action! 
 */
function setupModal(target) {
    
    closeModal();

    var $newModal = $(target).clone();

    $newModal.attr('id', 'active-modal');

    $newModal.find('.header').mousedown(function(e) {

        window.my_dragging = {};

        my_dragging.pageX0 = e.pageX;
        my_dragging.pageY0 = e.pageY;
        my_dragging.elem = $newModal;
        my_dragging.offset0 = $(my_dragging.elem).offset();

        function handle_dragging(e) {

            var left = my_dragging.offset0.left + (e.pageX - my_dragging.pageX0);
            var top = my_dragging.offset0.top + (e.pageY - my_dragging.pageY0);

            $(my_dragging.elem).offset({top: top, left: left});
        }

        function handle_mouseup(e){
            $('body').off('mousemove', handle_dragging).off('mouseup', handle_mouseup);
        }

        $('body').on('mouseup', handle_mouseup).on('mousemove', handle_dragging);
    });

    $('body').append($newModal);
}


function closeModal() {

	$('#active-modal').remove();
	$('.ui.dimmer').remove();

	closeLoading();
}


function showModal() {

	$('#active-modal').modal('show');
}


function showMessage(title, message, close, width, height) {

	setupModal('#generic-modal');

	console.log(isNullOrWhiteSpace(title));

    if(isNullOrWhiteSpace(title) == false) {
        $('#active-modal .header').text(title);
    }

	if(isNullOrWhiteSpace(message)) {

		$("#active-modal .message-list").remove();

	} else {

		arrayIntoUL($("#active-modal .message-list"), message);
	}

	showModal();
}


/*
 *
 * If an AJAX request return an HTTP error display it in a pre-defined element called #error-window.
 *
 */
var errorHandler = function(jqXHR, status, error) {

    if(isNullOrWhiteSpace(jqXHR.responseText) == true) {

        showMessage('Error', ['An unexpected error occured. See console for more details.'], true, 400, 0);

        console.log(error);
        console.log(status);

        return;
    }

    try {

        var obj = JSON.parse(jqXHR.responseText);

        if(isNullOrWhiteSpace(obj) == false && isNullOrWhiteSpace(obj.message) == false) {
            showMessage('Error', [obj.message], true, 400, 0);
        }

        return;

    } catch(e) {

        showMessage('Error', ['An unexpected error occured. See console for more details.'], true, 400, 0);

        console.log(e);
    }
};


/*
 *
 * Takes a JS array ["1", "2"] and places the item into a pre-defined UL(LI[.default-item]) element in the DOM.
 *
 */
var arrayIntoUL = function(ulElement, jsList) {

	console.log(ulElement);

	var defaultLI = $(ulElement).find('.default-item').clone();

	console.log(defaultLI);

	$(defaultLI).removeClass('default-item');
	$(defaultLI).show();

	$(ulElement).children().not('.default-item').remove();

	for(var i = 0; i < jsList.length; i++) {

		var newLI = $(defaultLI).clone();

		$(newLI).text(jsList[i]);

		$(ulElement).append(newLI);
	}	

	$(ulElement).show();

	if($(ulElement).parent().children(":visible").length > 1) {
		$(ulElement).css("margin-bottom", "10px");
	}
};


function isNullOrEmpty(value) {

    if(value == null || value == undefined || value == "" || value == {} || value == []) {
        return true;
    }

    return false;
};


function showLoading() {

	var $fader = $("#fader");
	var $loader = $("#loader"); 

	$loader.css('display', 'block');
	$fader.css('display', 'block');
};


function closeLoading() {

	$("#fader").remove();
	$("#loader").remove();
};
