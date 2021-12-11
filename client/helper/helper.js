
//general error handler
const handleError = (message) => {
    $("#errorMessage").text(message);
   
};

//brings the user to another page
const redirect = (response) => {
    window.location = response.redirect;
};

//returns an ajax form
const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function(xhr, status, error) {
            console.warn(xhr.responseText);
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};

