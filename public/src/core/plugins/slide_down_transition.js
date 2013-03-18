(function($ui){

  function slideDownTransition (old_div, current_div, back) {
    old_div.style.display = "block";
    current_div.style.display = "block";
    var that = this
    if (back) {
      current_div.style.zIndex = 1;
      old_div.style.zIndex = 2;
      that.clearAnimations(current_div);
      that.css3animate(old_div, {
        y: "-100%",
        x: "0%",
        time: "150ms",
        complete: function(canceled) {
          if(canceled) {
            that.finishTransition(old_div, current_div);
            return;
          }

          that.css3animate(old_div, {
            x: "-100%",
            y: 0,
            complete: function() {
              that.finishTransition(old_div);

            }
          });
          current_div.style.zIndex = 2;
          old_div.style.zIndex = 1;
        }
      });
    } else {
      old_div.style.zIndex = 1;
      current_div.style.zIndex = 2;
      that.css3animate(current_div, {
        y: "-100%",
        x: "0%",
        complete: function() {
          that.css3animate(current_div, {
            y: "0%",
            x: "0%",
            time: "150ms",
            complete: function(canceled){
              if(canceled) {
                that.finishTransition(old_div, current_div);
                return;
              }

              that.clearAnimations(current_div);
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
  $ui.availableTransitions.down = slideDownTransition;
})($.ui);

