/* Mobiscroll License Key:85c855f7-3793-4272-9682-8f66dcfe9665 */
(function ($) {

    $.mobiscroll.themes.wp = {
        defaults: {
            width: 70,
            height: 76,
            accent: 'none',
            dateOrder: 'mmMMddDDyy'
        },
        init: function (elm, inst) {
            var click,
                active;
            
            $('.dw', elm).addClass('wp-' + inst.settings.accent);

            $('.dwwl', elm).bind('touchstart mousedown DOMMouseScroll mousewheel', function () {
                click = true;
                active = $(this).hasClass('wpa');
                $('.dwwl', elm).removeClass('wpa');
                $(this).addClass('wpa');
            }).bind('touchmove mousemove', function () {
                click = false;
            }).bind('touchend mouseup', function () {
                if (click && active) {
                    $(this).removeClass('wpa');
                }
            });
        }
    };

    $.mobiscroll.themes['wp light'] = $.mobiscroll.themes.wp;

})(jQuery);


