/*global alert: false, confirm: false, console: false, $: false */

$.mvc.controller.create('photos_controller', {
  init: function () {


  },

  default: function () {

    $.ui.show_page({
      div_id              : 'photos_index_view',
      title               : 'Photos',
      header              : '#header',
      left_button         : false,
      right_button        : false,
      footer              : '#footer',
      active_footer_button: '#bottom_nav_photos',
      url                 : false,
      data                : false
    });

  },

  detail: function (photo_id, comment) {

    $.ui.show_page({
      div_id              : 'photo_detail_view',
      title               : 'Photo',
      header              : '#header',
      left_button         : '#top_back_button',
      right_button        : false,
      footer              : '#footer',
      active_footer_button: '#bottom_nav_photos',
      url                 : false,
      data                : false
    });

  },

  take_photo: function () {

    var cloudinary = 'http://api.cloudinary.com/v1_1/funlife/image/upload';
    var unix_timestamp = Math.round((new Date()).getTime() / 1000);
    var secret_key = 'p0HsqkrLaNZpg3nruhEfWl4-tuc';
    var shaObj = new jsSHA('timestamp=' + unix_timestamp + secret_key, "TEXT");
    var sha1_hash = shaObj.getHash("SHA-1", "HEX");

    if(typeof forge === 'undefined') {
      $('#photo_uploader').click();

      document.getElementById('photo_uploader').addEventListener('change', handleFileSelect, false);

      function handleFileSelect (evt) {
        var files = evt.target.files; // FileList object
        // Loop through the FileList and render image files as thumbnails.
        for(var i = 0, current_file; current_file = files[i]; i++) {
          // Only process image files.
          if(!current_file.type.match('image.*')) {
            continue;
          }

          var reader = new FileReader();

          // Closure to capture the file information.
          reader.onload = (function (theFile) {
            return function (e) {

              $.ajax({
                url        : cloudinary,
                type       : "POST",
                data       : {
                  file     : e.target.result,
                  api_key  : 221816386951751,
                  timestamp: unix_timestamp,
                  signature: sha1_hash
                },
                processData: false,
                contentType: false,
                success    : function (response) {
                  var photo = {'photo': JSON.parse(response)};
                  photo.photo.processed_at = photo.photo.created_at;
                  delete photo.photo.created_at;
                  $.post_with_token({
                    url : '/photos/',
                    data: photo
                  });
                }
              });

            };


          })(current_file);

          // Read in the image file as a data URL.
          reader.readAsDataURL(current_file);

        }
      }


    }
    else {

//        var uploadPhotoFile = function(file){
//          console.log(forge.file.base64(file));
//          $.ajax({
//            url: cloudinary,
//            type: "POST",
//            data:
//            {
//              file: data,
//              api_key: 221816386951751,
//              timestamp: unix_timestamp,
//              signature: sha1_hash
//            },
//            processData: false,
//            contentType: false,
//            success: function (res) {
//              console.log("Upload success. Post this data to rails");
//            },
//            error: function(a,b,c){
//              console.log('error on upload');
//              console.log(a);
//
//            }
//          });
//        };

      var uploadPhotoFile = function (base64string) {

        forge.request.ajax({
          url        : cloudinary,
//          headers: {
//            'X-Parse-Application-Id': config.parseAppId,
//            'X-Parse-REST-API-Key': config.parseRestKey
//          },
          type       : 'POST',
//          files: [file],
//          fileUploadMethod: 'raw',
//          dataType: 'json',
          data       : {
            file     : base64string,
            api_key  : 221816386951751,
            timestamp: unix_timestamp,
            signature: sha1_hash
          },
          processData: false,
          contentType: false,
          success    : function (data) {
            alert('success in upload');
          },
          error      : function (error) {
            console.log('error');
            console.log(error);
          }
        });
      };

      forge.file.getImage({}, function (file) {
        //forge.file.base64(file, function(base64string){      //base64 crashes with big images
        uploadPhotoFile(file);
        // });
      });


//
//
//              $.ajax({
//                url: cloudinary,
//                type: "POST",
//                data:
//                {
//                  file: data,
//                  api_key: 221816386951751,
//                  timestamp: unix_timestamp,
//                  signature: sha1_hash
//                },
//                processData: false,
//                contentType: false,
//                success: function (res) {
//                  console.log("Upload success. Post this data to rails");
//                },
//                error: function(a,b,c){
//                  console.log('error on upload');
//                  console.log(a);
//
//                }
//              });


    }

  }
});
