(function($ui){

  function popTransition(old_div, currDiv, back) {
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
        scale: .2,
        origin: "-50%"+" 50%",
        complete: function(canceled) {
          if(canceled) {
            that.finishTransition(old_div);
            return;
          }

          that.css3animate(old_div, {
            x: "-100%",
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
      that.css3animate(currDiv, {
        x: "0%",
        y: "0%",
        scale: .2,
        origin: "-50%"+" 50%",
        opacity: .1,
        complete: function() {
          that.css3animate(currDiv, {
            x: "0%",
            time: "150ms",
            scale: 1,
            opacity: 1,
            origin: "0%"+" 0%",
            complete: function(canceled){
              if(canceled) {
                that.finishTransition(old_div, currDiv);
                return;
              }

              that.clearAnimations(currDiv);
              that.css3animate(old_div, {
                x: "100%",
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
  $ui.availableTransitions.pop = popTransition;
})($.ui);
