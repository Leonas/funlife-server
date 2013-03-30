(function ($) {

  //lookup for a clicked anchor recursively and fire UI own actions when applicable
  $.ui.checkAnchorClick = function (e, theTarget) {
    if(theTarget === ($.ui.ui_kit_container_id)) {
      return;
    }
    //if the item clicked is not an <a> then bubble up to see if we find it
    if(theTarget.tagName && theTarget.tagName.toLowerCase() !== 'a' && theTarget.parentNode) {
      return $.ui.checkAnchorClick(e, theTarget.parentNode);
    }
    if(theTarget.tagName && theTarget.tagName.toLowerCase() === "a") {
      if($.mvc.route(theTarget)) {
        return e.preventDefault();
      }
    }
    //we didn't catch the link, it must be outbound
  };

})(jq);



