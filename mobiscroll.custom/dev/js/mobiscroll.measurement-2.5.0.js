/* Mobiscroll License Key:85c855f7-3793-4272-9682-8f66dcfe9665 */
/*jslint eqeq: true, plusplus: true, undef: true, sloppy: true, vars: true, forin: true */
(function ($) {

    var defaults = {
        batch: 50,
        min: 0,
        max: 100,
        defUnit: '',
        units: null,
        unitNames: null,
        invalid: [],
        sign: false,
        signText: '&nbsp;',
        wholeText: 'Whole',
        fractionText: 'Fraction',
        unitText: 'Unit',
        step: 0.05,
        convert: function (val) {
            return val;
        }
    };

    $.mobiscroll.presets.measurement = function (inst) {
        var s = $.extend({}, defaults, inst.settings),
            elm = $(this),
            wheel = {},
            w = [{}],
            fractions = [],
            batch = s.batch,
            batchStart,
            batchStop,
            useUnits = s.units && s.units.length,
            baseUnit = useUnits ? (s.defUnit || s.units[0]) : '',
            units = s.unitNames || s.units,
            useFract = s.step < 1,
            repFract = false,
            steps = Math.round(useFract ? s.step * 100 : s.step),
            realValue,
            oldUnit,
            oldWhole,
            idxSign = -1,
            idxFract,
            idxWhole,
            idxUnit,
            minVal,
            maxVal,
            minWhole,
            maxWhole,
            minFract,
            maxFract,
            change,
            timer = {},
            j,
            l,
            i = 0;

        function getWhole(k) {
            return useFract ? (k < 0 ? Math.ceil(k) : Math.floor(k)) : step(Math.round(k), steps);
        }

        function getFract(k) {
            return useFract ? step((Math.abs(k) - getWhole(Math.abs(k))) * 100, steps) : 0;
        }

        function getParts(v) {
            var whole = getWhole(v),
                fract = getFract(v),
                sign = v < 0 ? '-' : '+';

            if (fract >= 100) {
                if (v < 0) {
                    whole--;
                } else {
                    whole++;
                }
                fract = 0;
            }
            return [sign, whole, fract];
        }

        function getNr(d) {
            var whole = replace(d[idxWhole], true) - 0,
                fract = useFract ? (replace(d[idxFract]) / 100 * (whole < 0 ? -1 : 1)) : 0;
            return (s.sign && d[0] == '-' ? -1 : 1) * (whole + fract);
        }

        function step(v, st) {
            return Math.round(v / st) * st;
        }

        function pad(num, size) {
            num = num + '';
            while (num.length < size) {
                num = '0' + num;
            }
            return num;
        }

        function replace(str, strict) {
            if (str) {
                return strict ? str.replace(/_/g, '') : str.replace(/_|\+|\-/g, '');
            }
            return '';
        }

        function convert(v, u1, u2) {
            if (u1 === u2) {
                return v;
            }
            return s.convert.call(this, v, u1, u2);
        }

        function constrain(val, min, max) {
            val = val > max ? max : val;
            val = val < min ? min : val;
            return val;
        }

        function setMinMax(unit) {
            minVal = convert(s.min, baseUnit, unit);
            maxVal = convert(s.max, baseUnit, unit);
            minWhole = getWhole(minVal);
            maxWhole = getWhole(maxVal);
            minFract = getFract(minVal);
            maxFract = getFract(maxVal);
            if (maxFract >= 100) {
                maxWhole++;
                maxFract = 0;
            }
        }

        function genWholeWheel(unit, val) {
            // Whole wheel
            setMinMax(unit);
            wheel = {};

            var minv = +minWhole,
                maxv = +maxWhole,
                st = useFract ? 1 : steps,
                start,
                stop;

            if (s.sign) {
                maxv = Math.abs(minv) > Math.abs(maxv) ? Math.abs(minv) : Math.abs(maxv);
                minv = minv < 0 ? 0 : minv;
            }
            
            start = val - batch * st;
            start = start < minv ? minv : start;
            stop = start + batch * st * 2;
            stop = stop > maxv ? maxv : stop;

            if (start !== batchStart || stop !== batchStop) {
                for (j = start; j <= stop; j += st) {
                    wheel['_' + j] = j;
                }
                w[0][s.wholeText] = wheel;
                batchStart = start;
                batchStop = stop;
                return true;
            }
            return false; // Don't change the wheel if start and stop is the same
        }

        function genFractWheel(val) {
            if (repFract) {
                wheel = {};

                var l = fractions.length,
                    offset = $.inArray(+val, fractions),
                    rep,
                    k,
                    i;

                for (j = -50; j < 50; j++) {
                    k = (j + offset) % l;
                    i = fractions[k < 0 ? l + k : k];
                    rep = Math.abs(Math.floor((j + offset) / l));
                    wheel['_' + Array(rep).join(j + offset < 0 ? '-' : '+') + i] = '.' + pad(i, 2);
                }
      
                w[0][s.fractionText] = wheel;
            }
        }
        
        // Check if sign is needed
        if (s.sign) {
            sign = false;
            for (j = 0; j < s.units.length; j++) {
                if (convert(s.min, baseUnit, s.units[j]) < 0) {
                    sign = true;
                }
            }
            s.sign = s.sign && sign;
        }
        
        // Sign wheel (if enabled)
        if (s.sign) {
            wheel = {
                '-': '-',
                '+': '+'
            };
            w[0][s.signText] = wheel;
            idxSign = i++;
        }

        // Whole wheel (later generated)
        w[0][s.wholeText] = {};
        idxWhole = i++;

        // Fraction wheel
        if (useFract) {
            wheel = {};
            for (j = 0; j < 100; j += steps) {
                fractions.push(j);
                wheel['_' + j] = '.' + pad(j, 2);
            }
            repFract = fractions.length > s.rows;
            w[0][s.fractionText] = repFract ? {} : wheel;
            idxFract = i++;
        }

        // Unit wheel
        if (useUnits) {
            wheel = {};
            for (j = 0; j < s.units.length; j++) {
                wheel[j] = units[j];
            }
            w[0][s.unitText] = wheel;
        }
        idxUnit = i;
        
        return {
            width: 55,
            wheels: w,
            formatResult: function (d) {
                return getNr(d).toFixed(useFract ? 2 : 0) + (useUnits ? ' ' + units[d[idxUnit]] : '');
            },
            parseValue: function (v) {
                var d = v.split(' '),
                    val = +d[0],
                    ret = [],
                    parts,
                    unit = '';

                if (useUnits) {
                    unit = $.inArray(d[1], units);
                    unit = unit == -1 ? $.inArray(baseUnit, s.units) : unit;
                    unit = unit == -1 ? 0 : unit;
                }

                setMinMax(useUnits ? s.units[unit] : '');

                val = isNaN(val) ? 0 : val;

                parts = getParts(val);

                parts[1] = constrain(parts[1], minWhole, maxWhole);

                if (s.sign) {
                    ret[0] = parts[0];
                    parts[1] = Math.abs(parts[1]);
                }

                ret[idxWhole] = '_' + parts[1];

                if (useFract) {
                    ret[idxFract] = '_' + parts[2];
                }

                if (useUnits) {
                    ret[idxUnit] = unit;
                }

                return ret;
            },
            onBeforeShow: function () {
                genWholeWheel(useUnits ? s.units[inst.temp[idxUnit]] : '', replace(inst.temp[idxWhole]));
                genFractWheel(replace(inst.temp[idxFract]));
                change = true;
            },
            onShow: function (dw) {
                $('.dwwl', dw).bind('mousedown touchstart', function () {
                    clearTimeout(timer[$('.dwwl', dw).index(this)]);
                });
            },
            onCancel: function () {
                realValue = undefined;
            },
            validate: function (dw, i, time) {
                var temp = inst.temp,
                    minus,
                    changes = [],
                    chTime,
                    parts,
                    whole,
                    t,
                    v,
                    fract = replace(temp[idxFract]) - 0,
                    newUnit = useUnits ? s.units[temp[idxUnit]] : '';
                
                if (s.sign && i === 0) { // Sign changed
                    realValue = Math.abs(realValue) * (temp[i] === '-' ? -1 : 1);
                    changes = repFract ? [idxWhole, idxFract] : [idxWhole];
                }

                if (i === idxWhole || (i === idxFract && useFract) || realValue === undefined || (i === undefined && !change)) { // Set real value if numbers changed
                    realValue = getNr(temp);
                    oldUnit = newUnit;
                }

                if (useUnits && ((i === idxUnit && oldUnit !== newUnit) || (i === undefined && !change))) { // Convert value if unit changed
                    realValue = convert(realValue, oldUnit, newUnit);
                    oldUnit = newUnit;
                    parts = getParts(realValue);
                    
                    if (s.sign) {
                        temp[0] = parts[0];
                    }
                    
                    // Change wheel
                    genWholeWheel(newUnit, s.sign ? Math.abs(parts[1]) : parts[1]);
                    genFractWheel(fract);
                    
                    changes = repFract ? [idxWhole, idxFract] : [idxWhole];
                    
                    chTime = i ? 0.2 : 0;
                }

                realValue = constrain(realValue, minVal, maxVal);
                parts = getParts(realValue);
                whole = s.sign ? Math.abs(parts[1]) : parts[1];
                
                /*if (s.sign) {
                    temp[0] = parts[0];
                }*/
                minus = s.sign ? temp[0] == '-' : realValue < 0;

                temp[idxWhole] = '_' + whole;

                if (useFract) {
                    temp[idxFract] = '_' + parts[2];
                }
                
                if (i === idxWhole) { /* && oldWhole !== whole*/ // Load whole wheel in batches
                    genWholeWheel(newUnit, whole);
                    changes.push(idxWhole);
                }

                if (i === idxFract && repFract) {
                    genFractWheel(fract);
                    changes.push(idxFract);
                }
                
                oldWhole = whole;
                
                if (s.sign && i === undefined) { // Disable +/- signs
                    t = $('.dw-ul', dw).eq(idxSign);
                    $('.dw-li', t).addClass('dw-v');
                    if (minVal > 0) {
                        $('.dw-li', t).eq(0).removeClass('dw-v');
                    }
                    if (maxVal < 0) {
                        $('.dw-li', t).eq(1).removeClass('dw-v');
                    }
                }

                if (s.sign && !i) { // Disable out of range whole values if sign changed or initial validation
                    t = $('.dw-ul', dw).eq(idxWhole);
                    $('.dw-li', t).addClass('dw-v');
                    j = $('.dw-li', t).index($('.dw-li[data-val="_' + Math.abs(minus ? minWhole : maxWhole) + '"]', t));
                    if (j != -1) {
                        $('.dw-li', t).slice(j + 1).removeClass('dw-v');
                    }
                }

                if (i !== idxFract && useFract) { // || fract < 0 || fract >= 100
                    t = $('.dw-ul', dw).eq(idxFract);
                    $('.dw-li', t).addClass('dw-v');
                    
                    // We need to make difference between +0 and -0, so we compare the strings instead of numbers
                    var p1 = s.sign ? (temp[0] + replace(temp[1])) : ((realValue < 0 ? '-' : '+') + Math.abs(parts[1])),
                        p2 = (minVal < 0 ? '-' : '+') + Math.abs(minWhole),
                        p3 = (maxVal < 0 ? '-' : '+') + Math.abs(maxWhole);
                    
                    // Disable out of range fraction values
                    //if (parts[1] == minWhole) { // || parts[1] == minWhole + 1
                    if (p1 === p2) {
                        $('.dw-li', t).each(function () {
                            v = replace($(this).attr('data-val'));
                            //if (v < minFract) {
                            if (minus ? v > minFract : v < minFract) {
                                $(this).removeClass('dw-v');
                            }
                        });
                    }
                    //if (parts[1] == maxWhole) {  // || parts[1] == maxWhole - 1
                    if (p1 === p3) {
                        $('.dw-li', t).each(function () {
                            v = replace($(this).attr('data-val'));
                            //if (v > maxFract) {
                            if (minus ? v < maxFract : v > maxFract) {
                                $(this).removeClass('dw-v');
                            }
                        });
                    }

                    for (j = 0; j < s.invalid.length; j++) { // Disable user values
                        var cparts = getParts(convert(s.invalid[j], baseUnit, newUnit));

                        if (parts[0] === cparts[0] && parts[1] === cparts[1]) { // Sign and whole part matches
                            //$('.dw-ul', dw).eq(idxFract).find('.dw-li[data-val="_' + cparts[2] + '"]').removeClass('dw-v');
                            $('.dw-li', t).each(function () {
                                if (replace($(this).attr('data-val')) == cparts[2]) {
                                    $(this).removeClass('dw-v');
                                }
                            });
                        }
                    }
                }

                if (!useFract) { // Disable user values on whole wheel
                    t = $('.dw-ul', dw).eq(idxWhole);
                    for (j = 0; j < s.invalid.length; j++) {
                        $('.dw-li[data-val="_' + step(convert(s.invalid[j], baseUnit, newUnit), steps) + '"]', t).removeClass('dw-v');
                    }
                }
                
                if (changes.length) {
                    timer[i] = setTimeout(function () {
                        change = true;
                        inst.changeWheel(changes, chTime);
                    }, time * 1000);
                    
                    return false;
                }

                change = false;
            }
        };
    };

})(jQuery);
