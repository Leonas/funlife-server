(function($ui){

  function fadeTransition (old_div, currDiv, back) {
    old_div.style.display = "block";
    currDiv.style.display = "block";
    var that = this
    if (back) {
      currDiv.style.zIndex = 1;
      old_div.style.zIndex = 2;
      that.clearAnimations(currDiv);
      that.css3animate(old_div, {
        x: "0%",
        time: "150ms",
        opacity: .1,
        complete: function(canceled) {
          if(canceled) {
            that.finishTransition(old_div, currDiv);
            return;
          }

          that.css3animate(old_div, {
            x: "-100%",
            opacity: 1,
            complete: function() {
              that.finishTransition(old_div);
            }

          });
          currDiv.style.zIndex = 2;
          old_div.style.zIndex = 1;
        }
      });
    } else {
      old_div.style.zIndex = 1;
      currDiv.style.zIndex = 2;
      currDiv.style.opacity = 0;
      that.css3animate(currDiv, {
        x: "0%",
        opacity: .1,
        complete: function() {
          that.css3animate(currDiv, {
            x: "0%",
            time: "150ms",
            opacity: 1,
            complete:function(canceled){
              if(canceled) {
                that.finishTransition(old_div, currDiv);
                return;
              }

              that.clearAnimations(currDiv);
              that.css3animate(old_div, {
                x: "-100%",
                y: 0,
                complete: function() {
                  that.finishTransition(old_div);
                }
              });
            }
          });
        }
      });
    }
  }
  $ui.availableTransitions.fade = fadeTransition;
})($.ui);
