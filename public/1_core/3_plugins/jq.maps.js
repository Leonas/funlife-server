// @author Ian Maffett
// @copywrite AppMobi 2012
// Please see - https://developers.google.com/maps/documentation/javascript/ for the API


/**
 * jq.maps.js - google maps plugin wrapper for jqMobi apps.  You can pass in configuration options that are from the Google Maps API
 ```
 $("#map").gmaps({zoom: 8,center: new google.maps.LatLng(40.010787, -76.278076),mapTypeId: google.maps.MapTypeId.ROADMAP});   // create the map with basic options
 $("#map").gmaps() //return the google maps object back from cache
 ```
 *@param {Object} [options]
 *@title $().gmaps([options]);
 */
(function () {
  var gmapsLoaded = false;
  $(document).ready(function () {
    if(window['google'] && google.maps) {
      $(document).trigger("gmaps:available");
      gmapsLoaded = true;
      return true;
    }
    var gmaps = document.createElement("script");
    gmaps.src = "https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyC-weGLF_U2fkiHZ4vwT_sL7KXsXqaxrl0&sensor=true&callback=gmapsPluginLoaded";
    $("head").append(gmaps);
    window['gmapsPluginLoaded'] = function () {
      $(document).trigger("gmaps:available");
      gmapsLoaded = true;
    }
  });

  var mapsCache = {};

  $.fn.gmaps = function (options) {
    console.log('im here');
    if(this.length == 0) {
      console.log('error')
      return;
    }
    if(!options) {
      console.log('section 2');
      return mapsCache[this[0].id];
    }
    if(options == "resize" && mapsCache[this[0].id]) {
      console.log('section 3');
      return google.maps.event.trigger(mapsCache[this[0].id], 'resize');
    }
    for(var i = 0; i < this.length; i++) {
      console.log('section 4');
      new gmaps(this[i], options);
    }
  };


  var gmaps = function (elem, options) {
    var createMap = function () {
      console.log('creating a map');
      if(!options || Object.keys(options).length == 0) {
        console.log('setting default options');
        options = {
          zoom     : 8,
          center   : new google.maps.LatLng(40.010787, -76.278076),
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
      }
      mapsCache[elem.id] = new google.maps.Map(elem, options);
      google.maps.event.trigger(mapsCache[elem.id], 'resize');
    };

    if(!gmapsLoaded) {
      $(document).one("gmaps:available", function () {
        console.log('doing something?');
        createMap();
      });
    }
    else {
      console.log('making a gmap');
      createMap();
    }
  }
})(jq);