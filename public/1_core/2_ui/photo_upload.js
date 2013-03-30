(function ($) {




  /*
   // Step 1: Capture an image
   var capturePhoto = function() {
   forge.file.getImage({width: 500, height: 500}, function (file) {
   forge.file.imageURL(file, function (url) {
   $('#photo-container').prepend($('<img>').attr('src', url));
   });
   uploadPhotoFile(file);
   });
   };

   // Step 2: Upload the image file to Parse
   var uploadPhotoFile = function(file) {
   forge.request.ajax({
   url: 'https://api.parse.com/1/files/' + (new Date()).getTime() + '.jpg',
   headers: {
   'X-Parse-Application-Id': config.parseAppId,
   'X-Parse-REST-API-Key': config.parseRestKey
   },
   type: 'POST',
   files: [file],
   fileUploadMethod: 'raw',
   dataType: 'json',

   success: function (data) {
   uploadPhotoMetadata(data);
   },
   error: function () {
   alert('Problem uploading the photo');
   }
   });
   };

   // Step 3: Upload image metadata to Parse
   var uploadPhotoMetadata = function(data) {
   forge.request.ajax({
   url: 'https://api.parse.com/1/classes/Photo',
   headers: {
   'X-Parse-Application-Id': config.parseAppId,
   'X-Parse-REST-API-Key': config.parseRestKey
   },
   type: 'POST',
   contentType: 'application/json',
   dataType: 'json',
   data: JSON.stringify({
   file: {
   '__type': 'File',
   name: data.name
   },
   stream: config.streamName
   }),
   success: function (file) {
   // Upload complete - do nothing
   },
   error: function () {
   alert('Problem uploading the metadata');
   }
   });
   };



   $(document).ready(function() {
   $('#upload-photo').bind(clickEvent, capturePhoto);
   getPhotos();
   forge.event.messagePushed.addListener(function (msg) {
   alert(msg.alert);
   });
   });





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
