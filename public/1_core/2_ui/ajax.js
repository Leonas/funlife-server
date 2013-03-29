(function($){


  $.get_with_token = function(options){
    $.ajax({
      type: 'GET',
      dataType: 'application/json',
      headers: { 'Authorization': current_user.token },
      url: server+options.url,
      data: options.data,
      success: options.success,
      error: options.error
    });
  };


  $.post_with_token = function(options){
    $.ajax({
      type: 'POST',
      dataType: 'application/json',
      headers: { 'Authorization': current_user.token },
      url: server+options.url,
      data: options.data,
      success: options.success,
      error: options.error
    });
  };
  
  $.put_with_token = function(options){
    $.ajax({
      type: 'PUT',
      dataType: 'application/json',
      headers: { 'Authorization': current_user.token },
      url: server+options.url,
      data: options.data,
      success: options.success,
      error: options.error
    });
  };
  
  $.delete_with_token = function(options){
    $.ajax({
      type: 'DELETE',
      dataType: 'application/json',
      headers: { 'Authorization': current_user.token },
      url: server+options.url,
      data: options.data,
      success: options.success,
      error: options.error
    });
  };
/*
  $.get_with_token({
    url: options.url,
    data: options.data,
    success: function(response, statusText, xhr){},
    error: function(data){}
  });

 * Execute an Ajax call with the given options
 * options.type - Type of request
 * options.beforeSend - function to execute before sending the request
 * options.success - success callback
 * options.error(context, xhr, 'error', e) - error callback
 * options.complete - complete callback - called with a success or error
 * options.timeout - timeout to wait for the request
 * options.url - URL to make request against
 * options.contentType - HTTP Request Content Type
 * options.headers - Object of headers to set
 * options.dataType - Data type of request
 * options.data - data to pass into request.  $.param is called on objects


*/
})(jq);
