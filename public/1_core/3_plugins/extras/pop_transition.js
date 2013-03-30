(function ($ui) {

  function popTransition (old_div, current_div, back) {
    old_div.style.display = "block";
    current_div.style.display = "block";
    var that = this
    if(back) {
      current_div.style.zIndex = 1;
      old_div.style.zIndex = 2;
      that.clearAnimations(current_div);
      that.css3animate(old_div, {
        x       : "0%",
        time    : "150ms",
        opacity : .1,
        scale   : .2,
        origin  : "-50%" + " 50%",
        complete: function (canceled) {
          if(canceled) {
            that.finishTransition(old_div);
            return;
          }

          that.css3animate(old_div, {
            x       : "-100%",
            complete: function () {
              that.finishTransition(old_div);
            }
          });
          current_div.style.zIndex = 2;
          old_div.style.zIndex = 1;
        }
      });
    }
    else {
      old_div.style.zIndex = 1;
      current_div.style.zIndex = 2;
      that.css3animate(current_div, {
        x       : "0%",
        y       : "0%",
        scale   : .2,
        origin  : "-50%" + " 50%",
        opacity : .1,
        complete: function () {
          that.css3animate(current_div, {
            x       : "0%",
            time    : "150ms",
            scale   : 1,
            opacity : 1,
            origin  : "0%" + " 0%",
            complete: function (canceled) {
              if(canceled) {
                that.finishTransition(old_div, current_div);
                return;
              }

              that.clearAnimations(current_div);
              that.css3animate(old_div, {
                x       : "100%",
                y       : 0,
                complete: function () {
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
