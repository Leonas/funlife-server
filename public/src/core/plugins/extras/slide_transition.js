(function($ui){

  /**
   * Initiate a sliding transition.  This is a sample to show how transitions are implemented.  These are registered in $ui.availableTransitions and take in three parameters.
   * @param {Object} previous panel
   * @param {Object} current panel
   * @param {Boolean} go back
   * @title $ui.slideTransition(previousPanel,currentPanel,goBack);
   */
  function slideTransition(old_div, current_div, back) {
    old_div.style.display = "block";
    current_div.style.display = "block";
    var that = this;
    if (back) {
      that.css3animate(old_div, {
        x:"0%",
        y:"0%",
        complete:function(){
          that.css3animate(old_div, {
            x: "100%",
            time: "150ms",
            complete: function() {
              that.finishTransition(old_div, current_div);
            }
          }).link(current_div, {
                x: "0%",
                time: "150ms"
              });
        }
      }).link(current_div, {
            x:"-100%",
            y:"0%"
          });
    } else {
      that.css3animate(old_div, {
        x:"0%",
        y:"0%",
        complete:function(){
          that.css3animate(old_div, {
            x: "-100%",
            time: "150ms",
            complete: function() {
              that.finishTransition(old_div, current_div);
            }
          }).link(current_div, {
                x: "0%",
                time: "150ms"
              });
        }
      }).link(current_div, {
            x:"100%",
            y:"0%"
          });
    }
  }
  $ui.availableTransitions.slide = slideTransition;
  $ui.availableTransitions['default'] = slideTransition;
})($.ui);
