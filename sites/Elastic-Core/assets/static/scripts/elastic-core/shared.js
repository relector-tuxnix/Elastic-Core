
var errorHandler = function(jqXHR, status, error) {

	if(status == "error") {

		if(error == "Unauthorized") {
			$('#error-lightbox').find('h4').html('You are no longer logged in!');
		} else {
			$('#error-lightbox').find('h4').html('An error occured!');
		}

		$('#error-lightbox').show();

	} else {
		console.log(status);
		console.log(error);
	} 
};

