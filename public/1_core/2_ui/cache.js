(function($){
  /*
  Calculate the time difference of having a save function for each page vs one for the
  entire object like here because I dont know how slow or fast stringify is. Actually, its prolly
  faster than saving each individual one.
  */

  if(window.localStorage.getItem('cached_pages') !== (null || undefined) ) {
    $.ui.cached_pages = $.ui.cached_pages || JSON.parse(window.localStorage.getItem('cached_pages'));
  }
  else{
    $.ui.cached_pages = {};
  }
  $.ui.cached_pages.save = function(){
    window.localStorage.setItem('cached_pages', JSON.stringify($.ui.cached_pages));
  };

})(jq);
