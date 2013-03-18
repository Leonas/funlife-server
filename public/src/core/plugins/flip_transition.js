(function($ui){

  function flipTransition (old_div, current_div, back) {
    old_div.style.display = "block";
    current_div.style.display = "block";
    var that = this
    if (back) {
      that.css3animate(current_div, {
        x: "100%",
        scale: .8,
        rotateY: "180deg",
        complete: function() {
          that.css3animate(current_div, {
            x: "0%",
            scale: 1,
            time: "150ms",
            rotateY: "0deg",
            complete: function(){
              that.clearAnimations(current_div);
            }
          });
        }
      });
      that.css3animate(old_div, {
        x: "100%",
        time: "150ms",
        scale: .8,
        rotateY: "180deg",
        complete: function() {
          that.css3animate(old_div, {
            x: "-100%",
            opacity: 1,
            scale: 1,
            rotateY: "0deg",
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
      that.css3animate(old_div, {
        x: "100%",
        time: "150ms",
        scale: .8,
        rotateY: "180deg",
        complete: function() {
          that.css3animate(old_div, {
            x: "-100%",
            y: 0,
            time: "1ms",
            scale: 1,
            rotateY: "0deg",
            complete: function() {
              that.finishTransition(old_div);
            }
          });
        }
      });
      that.css3animate(current_div, {
        x: "100%",
        time: "1ms",
        scale: .8,
        rotateY: "180deg",
        complete: function() {
          that.css3animate(current_div, {
            x: "0%",
            time: "150ms",
            scale: 1,
            rotateY: "0deg",
            complete:function(){
              that.clearAnimations(current_div);
            }
          });
        }
      });
    }
  }
  $ui.availableTransitions.flip = flipTransition;
})($.ui);
