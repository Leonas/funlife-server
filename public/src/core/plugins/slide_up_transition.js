(function($ui){

  function slideUpTransition(old_div, currDiv, back) {
    old_div.style.display = "block";
    currDiv.style.display = "block";
    var that = this;
    if (back) {
      currDiv.style.zIndex = 1;
      old_div.style.zIndex = 2;

      that.clearAnimations(currDiv);

      that.css3animate(old_div, {
        y: "100%",
        x: "0%",
        time: "150ms",
        complete: function() {
          that.finishTransition(old_div);
          currDiv.style.zIndex = 2;
          old_div.style.zIndex = 1;
        }
      });
    } else {
      currDiv.style.zIndex = 2;
      old_div.style.zIndex = 1;
      that.css3animate(currDiv, {
        y: "100%",
        x: "0%",
        complete: function() {
          that.css3animate(currDiv, {
            y: "0%",
            x: "0%",
            time: "150ms",
            complete: function(canceled) {
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
  $ui.availableTransitions.up = slideUpTransition;
})($.ui);

