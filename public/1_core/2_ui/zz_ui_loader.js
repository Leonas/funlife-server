(function ($) {
  //when doc ready, add the touch layer
  $(document).ready(function () {
    if($.os.supportsTouch) {
      $.touch_layer(document.getElementById("ui_kit"));
    }
  });

//If the document is ready, call autoBoot to launch
  if(document.readyState === 'complete' || document.readyState === "loaded") {
    $.ui.autoBoot();
  }
//Otherwise add a listener and launch when ready
  else {
    document.addEventListener("DOMContentLoaded", function () {
      $.ui.autoBoot();
      this.removeEventListener("DOMContentLoaded", arguments.callee);
    }, false);
  }
})(jq);

