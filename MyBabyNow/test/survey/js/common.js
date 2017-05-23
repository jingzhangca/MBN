//To do: write a framework for ajax.
// var common=function(){};

// common.prototype={
// 	ajax:function(method,url,){
// 		$.ajax({
// 			type: "post",
// 			url: url,
// 			data: JSON.stringify(postData),
// 			contentType: "application/json",
// 			dataType: "json",
// 			success: function(responseData, textStatus, jqXHR) {
// 				$('#message_for_user').html("Information saved. Thanks for your time!");
// 				window.location.replace('/forum/index.html');
// 				$('.preloader-wrapper').addClass('hide');
// 			},
// 			error: function(jqXHR, textStatus, errorThrown) {
// 				var errorMessage = "Something went wrong";
// 				if (jqXHR.status === 0) {
// 					errorMessage = 'Network not connected.\nPlease verify your network connection.';
// 				} else if (jqXHR.status == 404) {
// 					errorMessage = '404. The requested page not found.';
// 				} else if (jqXHR.status == 500) {
// 					errorMessage = 'Internal Server Error [500].';
// 				}
// 				$('#message_for_user').html(errorMessage);
// 				$('.preloader-wrapper').addClass('hide');
// 			}
// 		});
// 	}
// }

// common= new common();