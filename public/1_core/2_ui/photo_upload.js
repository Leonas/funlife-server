(function($){


  //POST to


  /*
   API Key:221816386951751
   API Secret:p0HsqkrLaNZpg3nruhEfWl4-tuc
   Environment variable: CLOUDINARY_URL=cloudinary://221816386951751:p0HsqkrLaNZpg3nruhEfWl4-tuc@funlife
   */




  /*
   Required parameters:

   file - Either the actual data of the image or an HTTP URL of a public image on the Internet.
   api_key - Your unique Cloudinary API Key.
   timestamp - Unix time in seconds of the current time.
   signature - A signature of all request parameters except for 'file', based on your Cloudinary API Secret.
   See Request Authentication for more details.
   */

  /*
   For manually authenticating your request you need to sign the following parameters

   callback, eager, format, public_id, tags, timestamp, transformation, type
   Timestamp is the Unix time in second of the time of the request (e.g., 1315060076).

   You need to sign a string with all parameters sorted by their names alphabetically.
   Separate parameter name and value with '=' and join parameters with '&'.

   Create a HEX digest string of a SHA1 signature of a string with the concatenation of all
   serialized parameters and your API secret.

   For example, if your API Key is '1234', your secret is 'abcd', the Unix time now is
   1315060076 and you upload a file with the 'sample' Public ID:

   Parameters:
   timestamp: 1315060510
   public_id: "sample"
   file: DATA
   Serialized sorted parameters:
   "public_id=sample&timestamp=1315060510"
   String to create SHA1 HEX digest for:
   "public_id=sample&timestamp=1315060510abcd"
   SHA1 HEX digest:
   "c3470533147774275dd37996cc4d0e68fd03cd4f"


   Final request parameters:

   {
     file: DATA,
     api_key: 221816386951751,
     timestamp: unix_timestamp,
     signature: sha1_sig //timestamp=unix_timestampp0HsqkrLaNZpg3nruhEfWl4-tuc
   }

   */

  //on 200 ok this is returned:
  /*
   {
   url: 'http://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
   secure_url: 'https://cloudinary-a.akamaihd.net/demo/image/upload/v1312461204/sample.jpg',
   public_id: 'sample',
   version: '1312461204',
   width: 864,
   height: 564,
   format: 'png',
   resource_type: 'image',
   signature: 'abcdefgc024acceb1c5baa8dca46797137fa5ae0c3'
   }
   */

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
      url: server+options.api_url,
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
      url: server+options.api_url,
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
      url: server+options.api_url,
      data: options.data,
      success: options.success,
      error: options.error
    });
  };
  /*
   $.get_with_token({
   api_url: options.api_url,
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
