/* Mobiscroll License Key:85c855f7-3793-4272-9682-8f66dcfe9665 */
/*jslint eqeq: true, plusplus: true, undef: true, sloppy: true, vars: true, forin: true */
(function ($) {

    var defaults = {
        controls: ['time', 'calendar'],
        firstDay: 0,
        firstSelectDay: 0,
        swipe: true,
        prevText: 'Prev',
        nextText: 'Next',
        calWidth: 0,
        calHeight: 0,
        onDayChange: function () { }
    };

    $.mobiscroll.presetShort('calendar');

    $.mobiscroll.presets.calendar = function (inst) {
        
        function isValid(d) {
            if (d < new Date(minDateTime.getFullYear(), minDateTime.getMonth(), minDateTime.getDate())) {
                return false;
            }
            
            if (d > maxDateTime) {
                return false;
            }
            
            return isInObj(d, s.invalid) === false;
        }
        
        function isInObj(d, obj) {
            var i, v, x, y;
            
            if (obj) {
                // Disable exact dates
                if (obj.dates) {
                    for (i = 0; i < obj.dates.length; i++) {
                        x = obj.dates[i];
                        y = x.d || x;
                        if (y.getTime() === d.getTime()) {
                            return x;
                        }
                    }
                }
                
                // Disable days of month
                if (obj.daysOfMonth) {
                    for (i = 0; i < obj.daysOfMonth.length; i++) {
                        x = obj.daysOfMonth[i];
                        y = x.d || x;
                        v = (y + '').split('/');
                        if (v[1]) {
                            if (v[0] - 1 == d.getMonth() && v[1] == d.getDate()) {
                                return x;
                            }
                        } else {
                            if (v[0] == d.getDate()) {
                                return x;
                            }
                        }
                    }
                }
                
                // Disable days of week
                if (obj.daysOfWeek) {
                    for (i = 0; i < obj.daysOfWeek.length; i++) {
                        x = obj.daysOfWeek[i];
                        y = x.d || x;
                        if (y === d.getDay()) {
                            return x;
                        }
                    }
                }
            }
            return false;
        }
        
        function genMonth(year, month) {
            var curr,
                valid,
                other,
                i,
                j,
                sel = inst.getDate(inst.temp),
                days = new Date(year, month + 1, 0).getDate(),
                w = new Date(year, month, 1).getDay(), // Get the weekday of the month
                prev = new Date(year, month, 0).getDate() - w + 1,
                html = '<div class="dw-cal-slide dw-cal-slide-a"><table cellpadding="0" cellspacing="0">';
            
            //for (i = 0; i < Math.ceil((days + w) / 7) * 7; i++) {
            for (j = 0; j < 42; j++) {
                i = j + s.firstDay;
                curr = new Date(year, month, i - w + 1);
                valid = isValid(curr);
                marked = isInObj(curr, s.marked);
                selected = inst._selectedValues[curr] !== undefined;
                other = i < w || i >= days + w; // Day is from another month
                
                if (j % 7 == 0) {
                    html += (j ? '</tr>' : '') + '<tr>';
                }
                
                html += '<td class="dw-cal-day dw-cal-day-' + (j % 7) +
                    (jqm ? ' ui-body-c' : '') +
                    (selected ? ' dw-sel' : '') +
                    (valid && other ? ' dw-cal-day-diff' : '') +
                    (valid ? ' dw-cal-day-v' : '') + '" data-date="' + (i - w + 1) + '"><div class="dw-i' + 
                    (selected && jqm ? ' ui-btn-active' : '') +
                    (valid && jqm ? ' ui-btn-up-c ui-state-default ui-btn" data-theme="c"' : '"') + '>' +
                    (i < w ? prev + i : (i >= days + w ? i - days - w + 1 : i - w + 1)) +
                    (marked ? '<div class="dw-cal-day-m"></div>' : '') +
                    (marked && marked.text ? '<div class="dw-cal-day-txt">' + marked.text + '</div>' : '') +
                    '</div></td>';
            }

            html += '</tr></table></div>';
            
            $('.dw-cal-my', ctx).text(s.monthNames[month] + ' ' + year);
            
            // Disable/enable prev/next buttons
            if (new Date(year, month - 1, 1) < minDate) {
                $('.dw-cal-prev', ctx).addClass(disabled);
            } else {
                $('.dw-cal-prev', ctx).removeClass(disabled);
            }
            if (new Date(year, month + 1, 1) > maxDate) {
                $('.dw-cal-next', ctx).addClass(disabled);
            } else {
                $('.dw-cal-next', ctx).removeClass(disabled);
            }
            
            return html;
        }
        
        function highlightDate() {
            d = inst.getDate(inst.temp);
            if (d.getFullYear() === currYear && d.getMonth() === currMonth) {
                if (!multi) {
                    $('.dw-cal-slide-a .dw-sel', ctx).removeClass('dw-sel');
                    
                    var tr = $('.dw-cal-slide-a .dw-cal-day[data-date="' + d.getDate() + '"]', ctx).addClass('dw-sel').parent();

                    $('.dw-cal-week-hl', ctx).removeClass('dw-cal-week-hl');
                    
                    if (tr) {
                        tr.addClass('dw-cal-week-hl');
                    }
                    
                    if (jqm) {
                        $('.dw-cal-slide-a .ui-btn-active', ctx).removeClass('ui-btn-active');
                        $('.dw-cal-slide-a .dw-sel .dw-i', ctx).addClass('ui-btn-active');
                    }
                }
            }
        }
        
        function setDate() {
            d = inst.getDate(inst.temp);
                
            // Update calendar to the new month
            if (d.getFullYear() === currYear && d.getMonth() === currMonth) {
                currDate = d;
                highlightDate();
            } else if (d > currDate) {
                currYear = d.getFullYear();
                currMonth = d.getMonth();
                changeMonthNext();
            } else if (d < currDate) {
                currYear = d.getFullYear();
                currMonth = d.getMonth();
                changeMonthPrev();
            }
        }
        
        function changeMonthPrev() {
            currDate = new Date(currYear, currMonth, 1);
            currYear = currDate.getFullYear();
            currMonth = currDate.getMonth();
            
            inst.trigger('onMonthChange', [currYear, currMonth]);
            
            if ($('.dw-cal-slide', ctx).length > 1) {
                $('.dw-cal-slide', ctx).eq(0).remove();
                $('.dw-cal-slide-a', ctx).removeClass('dw-cal-slide-a');
            }
            newMonth = genMonth(currDate.getFullYear(), currDate.getMonth());
            anim.addClass('dw-cal-anim-prev').prepend(newMonth);
            highlightDate();
            trans = true;
            setTimeout(function () {
                anim.addClass('dw-cal-anim-a').removeClass('dw-cal-anim-prev');
                setTimeout(function () {
                    anim.removeClass('dw-cal-anim-a');
                    trans = false;
                }, 300);
            }, 10);
        }
        
        function changeMonthNext() {
            currDate = new Date(currYear, currMonth, 1);
            currYear = currDate.getFullYear();
            currMonth = currDate.getMonth();
            
            inst.trigger('onMonthChange', [currYear, currMonth]);
            
            if ($('.dw-cal-slide', ctx).length > 1) {
                $('.dw-cal-slide', ctx).eq(0).remove();
                $('.dw-cal-slide-a', ctx).removeClass('dw-cal-slide-a');
            }
            newMonth = genMonth(currDate.getFullYear(), currDate.getMonth());
            anim.removeClass('dw-cal-anim-prev').append(newMonth);
            highlightDate();
            setTimeout(function () {
                anim.addClass('dw-cal-anim-a').addClass('dw-cal-anim-prev');
                trans = true;
                setTimeout(function () {
                    anim.removeClass('dw-cal-anim-a');
                    trans = false;
                }, 300);
            }, 10);
        }
        
        function selectDay() {
            if (multi) {
                d = new Date(currYear, currMonth, $(this).attr('data-date'));
                
                if (s.selectType == 'week') { // Select whole week
                    var sel,
                        selected = $(this).hasClass('dw-sel'),
                        diff = d.getDay() - s.firstSelectDay,
                        i = 0;
                    
                    diff = diff < 0 ? 7 + diff : diff;
                        
                    if (!s.multiSelect) { // Only one week can be selected
                        inst._selectedValues = {};
                    }
                    for (i; i < 7; i++) {
                        sel = new Date(d.getFullYear(), d.getMonth(), d.getDate() - diff + i);
                        if (selected) {
                            delete inst._selectedValues[sel];
                        } else {
                            inst._selectedValues[sel] = sel;
                        }
                    }
                    refresh();
                } else { // Select day only
                    $(this).toggleClass('dw-sel');
                    
                    if (jqm) {
                        $('.dw-i', this).toggleClass('ui-btn-active');
                    }
                    
                    if ($(this).hasClass('dw-sel')) {
                        inst._selectedValues[d] = d;
                    } else {
                        delete inst._selectedValues[d];
                    }
                }
            }
                            
            var fill = s.display === 'inline';
            d = inst.getDate(inst.temp);
            inst.setDate(new Date(currYear, currMonth, $(this).attr('data-date'), d.getHours(), d.getMinutes(), d.getSeconds()), fill, 0.2, !fill);
                        
            // Call onDayChange event
            inst.trigger('onDayChange', [{ date: d, marked: $('.dw-cal-day-m', this).length > 0, cell: this }]);
        }
        
        function refresh() {
            if (multi && inst.isVisible()) {
                if ($('.dw-cal-slide', ctx).length > 1) {
                    $('.dw-cal-slide', ctx).eq(0).remove();
                }
                if (anim.hasClass('dw-cal-anim-prev')) {
                    anim.append(genMonth(currYear, currMonth));
                } else {
                    anim.prepend(genMonth(currYear, currMonth));
                }
            }
        }
        
        function getX(e) {
            var org = e.originalEvent,
                ct = e.changedTouches;
            return ct || (org && org.changedTouches) ? (org ? org.changedTouches[0].pageX : ct[0].pageX) : e.pageX;
    
        }
        
        var d,
            i,
            ret,
            ctx,
            anim,
            html,
            oldMonth,
            newMonth,
            minDate,
            maxDate,
            minDateTime,
            maxDateTime,
            currDate,
            currYear,
            currMonth,
            controls,
            highlight,
            that = this,
            touch = false,
            move = false,
            trans = false,
            s = $.extend({}, defaults, inst.settings),
            jqm = s.theme == 'jqm',
            multi = s.multiSelect || s.selectType == 'week',
            disabled = 'dw-cal-btn-d' + (jqm ? ' ui-disabled' : '');
        
        controls = s.controls.join(',');
        
        inst.settings.preset = 'date' + (controls.match(/time/) ? 'time' : '');
        
        if (inst.settings.selectedValues) {
            for (i = 0; i < inst.settings.selectedValues.length; i++) {
                d = inst.settings.selectedValues[i];
                inst._selectedValues[d] = d;
            }
        }
        
        inst.addValue = function (v) {
            inst._selectedValues[v] = v;
            refresh();
        }
            
        inst.removeValue = function (v) {
            delete inst._selectedValues[v];
            refresh();
        }
            
        inst.setValues = function (v) {
            var i = 0;
            
            inst._selectedValues = {};
            
            for (i; i < v.length; i++) {
                inst._selectedValues[v[i]] = v[i];
            }
            refresh();
        }
        
        if (!inst._setValue) {
            inst._setValue = inst.setValue;
            inst.setValue = function () {
                inst._setValue.apply(this, arguments);
                if (inst.isVisible()) {
                    setDate();
                } else {
                    currDate = inst.getDate(inst.temp);
                }
            };
        }
    
        ret = $.mobiscroll.presets.datetime.call(this, inst); //$.extend(s, $.mobiscroll.presets.datetime.call(this, inst));

        $.extend(ret, {
            onMarkupReady: function (dw) {
                ctx = dw;
                d = inst.getDate(inst.temp);
                s = $.extend({}, defaults, inst.settings);
                
                currDate = d;
                currYear = d.getFullYear();
                currMonth = d.getMonth();
                
                if (s.minDate) {
                    minDate = new Date(s.minDate.getFullYear(), s.minDate.getMonth(), 1);
                    minDateTime = s.minDate;
                } else {
                    minDate = new Date(s.startYear, 0, 1);
                    minDateTime = minDate;
                }
                
                if (s.maxDate) {
                    maxDate = new Date(s.maxDate.getFullYear(), s.maxDate.getMonth(), 1);
                    maxDateTime = s.maxDate;
                } else {
                    maxDate = new Date(s.endYear, 11, 31, 23, 59, 59);
                    maxDateTime = maxDate;
                }
                
                dw.addClass('dw-calendar');
                
                if (!controls.match(/date/)) {
                    $('.dwc', ctx).eq(0).addClass('dwc-h');
                }

                html = '<div class="dwc dw-cal-c"><div class="dw-cal">' +
                    '<div class="dw-cal-header' + (jqm ? ' ui-body-c' : '') + '"><div class="dw-cal-btnc">' +
                    '<div class="dw-cal-prev dw-cal-btn dwb"><div class="dw-cal-btn-txt"' + (jqm ? 'data-role="button" data-icon="arrow-l" data-iconpos="notext"' : '') + '>' + s.prevText + '</div></div>' +
                    '<span class="dw-cal-my">' + s.monthNames[currMonth] + ' ' + currYear + '</span>' +
                    '<div class="dw-cal-next dw-cal-btn dwb"><div class="dw-cal-btn-txt"' + (jqm ? 'data-role="button" data-icon="arrow-r" data-iconpos="notext"' : '') + '>' + s.nextText + '</div></div></div>' +
                    '<table cellpadding="0" cellspacing="0"><tr>';
                
                for (i = 0; i < 7; i++) {
                    html += '<th>' + s.dayNamesShort[(i + s.firstDay) % 7] + '</th>';
                }
                
                html += '</tr></table></div><div class="dw-cal-anim-c"><div class="dw-cal-anim dw-cal-anim-prev"><div class="dw-cal-slide"></div></div></div><div class="dw-cal-f"></div></div></div>';
                
                $('.dwcc, .dwbc', ctx).before(html);
                
                anim = $('.dw-cal-anim', ctx);
                
                anim.append(genMonth(currYear, currMonth))
                    .delegate('.dw-cal-day-v', 'touchstart mousedown', function (e) {
                        $(this).addClass('dwb-a');
                    })
                    .delegate('.dw-cal-day-v', 'touchstart', function (e) {
                        move = false;
                        touch = true;
                    })
                    .delegate('.dw-cal-day-v', 'touchmove', function (e) {
                        clearTimeout(highlight);
                        move = true;
                    })
                    .delegate('.dw-cal-day-v', 'touchend', function (e) {
                        if (!move) {
                            selectDay.call(this);
                        }
                    })
                    .delegate('.dw-cal-day-v', 'click', function (e) {
                        if (!touch) {
                            selectDay.call(this);
                        }
                    });
                
                inst.tap($('.dw-cal-prev', ctx), function () {
                    if (!trans && !$(this).hasClass('dw-cal-btn-d')) {
                        currMonth--;
                        changeMonthPrev.call(this);
                    }
                });
                
                inst.tap($('.dw-cal-next', ctx), function () {
                    if (!trans && !$(this).hasClass('dw-cal-btn-d')) {
                        currMonth++;
                        changeMonthNext.call(this);
                    }
                });
                
                if (s.calWidth) {
                    $('.dw-cal', ctx).width(s.calWidth);
                }
                
                if (s.calHeight) {
                    $('.dw-cal-anim-c', ctx).height(s.calHeight);
                }
                
                // Change month on swipe
                if (s.swipe) {
                    
                    var startX,
                        endX,
                        startTime,
                        endTime;
                    
                    $('.dw-cal-anim-c', ctx)
                        .bind('touchstart mousedown', function (e) {
                            e.preventDefault();
                            startTime = new Date();
                            startX = getX(e);
                        })
                        .bind('touchend mouseup', function (e) {
                            endTime = new Date();
                            endX = getX(e);
                            // If duration is more than 500ms, it's not a swipe
                            if (endTime - startTime > 300) {
                                return;
                            }
                            
                            if (endX - startX > 30 && !$('.dw-cal-prev', ctx).hasClass('dw-cal-btn-d')) {
                                currMonth--;
                                changeMonthPrev.call(this);
                            } else if (endX - startX < -30 && !$('.dw-cal-next', ctx).hasClass('dw-cal-btn-d')) {
                                currMonth++;
                                changeMonthNext.call(this);
                            }
                        });
                }
              
                // Highlight initial day and week
                setDate();
            },
            onChange: setDate,
            methods: {
                addValue: function (v) {
                    var inst = $(this).mobiscroll('getInst');
                    if (inst) {
                        inst.addValue(v);
                    }
                    return this;
                },
                removeValue: function (v) {
                    var inst = $(this).mobiscroll('getInst');
                    if (inst) {
                        inst.removeValue(v);
                    }
                    return this;
                },
                setValues: function (v) {
                    var inst = $(this).mobiscroll('getInst');
                    if (inst) {
                        inst.setValues(v);
                    }
                    return this;
                }
            }
        });

        return ret;
    };

})(jQuery);
