var form_validation;
var on_success;
$(document).ready(function() {

    $('.arc-text').circleType({
        radius: 850
    });

    $(window).bind("load resize scroll", function(e) {
        var y = $(window).scrollTop();
        $(".par-image-wrapper").each(function() {
            var par_offset = $(this).parent().offset().top - y;
            if (($(this).offset().top < (y + $(window).height())) && ($(this).offset().top + $(this).height() > y)) {
                $(this).css('top', parseInt(-par_offset / 6) + 'px');
            }
        });
    });

    $('#nav-button').click(function() {
        if ($(this).hasClass('close')) {
            $('#navigation').animate({
                opacity: 0
            }, 500, function() {
                $('header').removeClass('close');
                $(this).hide();
                $(document).unbind('touchmove');
            });
        } else {
            $('header').addClass('close');
            $('#navigation').css('opacity', '0').css('display', 'table');
            $('#navigation').animate({
                opacity: 1
            }, 500, function() {
                $(document).bind('touchmove', function(e) {
                    e.preventDefault();
                });
            });
        }
        $('#nav-button').toggleClass('close');
        $('body').toggleClass('blur');
    });
    //modernizr
    $(window).resize(mod);
    // Call once on initial load
    mod();
    //scroll to functions
    $(document).on("scroll", onScroll);
    $('a[href^="#"].scroll').on('click', function(e) {
        e.preventDefault();
        $(document).off("scroll");
        if ($('header').hasClass('close')) {
            $('body').toggleClass('blur');
            $('#navigation').animate({
                opacity: 0
            }, 500, function() {
                $('header, #nav-button').removeClass('close');
                $(this).hide();
                $(document).unbind('touchmove');
            });
        }
        $('a').each(function() {
            $(this).removeClass('active');
        })
        $(this).addClass('active');
        var target = this.hash,
            menu = target;
        $target = $(target);
        if ($('#nav-button').is(":visible")) {
            var scrollTopDist = $target.offset().top + 2 - $('#nav-button').outerHeight();
            //console.log(scrollTopDist);
        } else {
            var scrollTopDist = $target.offset().top + 2;
            //console.log(scrollTopDist);
        }
        $('html, body').stop().animate({
            'scrollTop': scrollTopDist
        }, 700, 'swing', function() {
            window.location.hash = target;
            $(document).on("scroll", onScroll);
        });
    });
    $('a#readmore').click(function(e) {
        e.preventDefault();
        $('.story-col.xs-hide').slideToggle(300);
        var text = $(this).html();
        //($(this).html() === "Read More") ? $(this).html("Hide") : $(this).html("Read More&hellip;");
        $(this).html(text == "Read More" ? "Hide" : "Read More");
    });
    //Form hide/show areas.
    $('input[name="attend"]').click(function() {
        if ($('#attend_yes').is(':checked')) {
            $('#guest, input[name="email"]').fadeIn();
            $('#comments').attr('placeholder', 'Comments');
            $('input[name="email"]').attr('placeholder', 'E-Mail *');
        } else {
            $('#guest, #rsvp_guest_info, #rsvp_song, input[name="email"]').fadeOut();
            $('#comments_sec').fadeIn();
            $('#comments').val('').attr('placeholder', 'Regrets');
            $('input[name="guest"]').prop('checked', false);
            $('#rsvp_guest_info input[type="text"], #rsvp_guest_info input[type="email"], #rsvp_song input[type="text"]').val('');
        }
        $('input[name="guest"]').click(function() {
            $('#rsvp_song, #comments_sec').fadeIn();
            if ($('#guest_yes').is(':checked')) {
                $('#rsvp_guest_info').fadeIn();
            } else {
                $('#rsvp_guest_info').fadeOut();
                $('#rsvp_guest_info input[type="text"], #rsvp_guest_info input[type="email"]').val('');
            }
        });
    });

    function addError(element) {
        $(element).addClass('error');
    }

    function removeError(element) {
        $(element).removeClass('error');
    }
    
    
    $("#rsvp_form input").on("change keyup paste click", function () {
        if (this.type === 'radio') {
            removeError('#rsvp_form input[name="' + this.name + '"]');
        } else {
            removeError(this);
        }
    });


    on_success = function on_success (attending) {
        $('#loading').hide();
        $('.mes_yes').hide();
        $('.mes_no').hide();
        //output = '<div class="success">'+response.text+'</div>';
        if (attending == 'Yes') {
            $('.mes_yes').show();
        }
        if (attending == 'No') {
            $('.mes_no').show();
        }
        $('#success').animate({
            opacity: 1
        }, 500).css('position', 'relative');
        $('#rsvp_form').fadeOut(500);
        $("#message").hide();
    }

    $('#message').hide();
    form_validation = function form_validation (validate) {
        var valid = true;
        if (!validate) {
            return valid;
        }
        var val_err_msg = '';
        if (!$("input[name='entry.726793198']").is(':checked')) {
            addError('#rsvp_form input[name="entry.726793198"]'); //change border color to red
            val_err_msg += '<li>Seleziona se sarai presente</li>';
            valid = false; //set do not proceed flag
        }
        if (!$.trim($('#rsvp_form input[name="entry.322360859"]').val())) { //if this field is empty 
            addError('#rsvp_form input[name="entry.322360859"]'); //change border color to red 
            val_err_msg += '<li>Inserisci il tuo Nome</li>';
            valid = false; //set do not proceed flag
        }

        if (!$.trim($('#rsvp_form input[name="entry.300621983"]').val())) { //if this field is empty 
            addError('#rsvp_form input[name="entry.300621983"]'); //change border color to red 
            val_err_msg += '<li>Inserisci il tuo Cognome</li>';
            valid = false; //set do not proceed flag
        }

        if (valid === false) {
            output = '<div class="error">' + val_err_msg + '</div>';
            var message = $("#message");
            if (message.is(':visible')) {
                message.html(output);
            } else {
                message.html(output).slideDown();
            }
        } else {
            $("#message").hide();
            on_success(attend=$("input[name='entry.726793198']:checked").attr('value'));
        }
        return valid;
    }

    //Form Validation & AJAX.
    $('#rsvp_form').submit(function(event) {
        var attending = $("input[name='attend']:checked").val();
        return form_validation(true);
    });
    //reset previously set border colors and hide all message on .keyup()
    $("#contact_form  input[required=true], #contact_form textarea[required=true]").keyup(function() {
        $(this).css('border-color', '');
        $("#result").slideUp();
    });
    $(window).bind("load scroll resize", function() {
        var banner = $('#banner');
        if (isElementInViewport(banner) == false) {
            $('header#nav, #nav-button').addClass('withbg');
        } else {
            $('header#nav, #nav-button').removeClass('withbg');
        }
    });

    function updateClock() {
        var now = moment(),
            second = now.seconds() * 6,
            minute = now.minutes() * 6 + second / 60,
            hour = ((now.hours() % 12) / 12) * 360 + 90 + minute / 12;
        $('#hour').css("transform", "rotate(" + hour + "deg)");
        $('#minute').css("transform", "rotate(" + minute + "deg)");
        $('#second').css("transform", "rotate(" + second + "deg)");
    }

    function timedUpdate() {
        updateClock();
        setTimeout(timedUpdate, 1000);
    }
    timedUpdate();
    var wedding = moment('201509271100', 'YYYYMMDDhhmm');
    var seconds = moment.duration(moment().diff(wedding)).asSeconds();
    var clock = $('#countdown').FlipClock(seconds, {
        clockFace: 'DailyCounter',
        countdown: false,
        showSeconds: false,
        language: 'Italian'
    });
});

function isElementInViewport(el) {
    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }
    var rect = el.getBoundingClientRect();
    return (rect.bottom >= 0 && rect.right >= 0 && rect.top <= (window.innerHeight || document.documentElement.clientHeight) && rect.left <= (window.innerWidth || document.documentElement.clientWidth));
}

var scroll_intro = function (scrollPos) {
    $('#intro').css('background-position', 'left ' + ((scrollPos)) + 'px');
};

var noscroll_intro = function () {
    $('#intro').removeClass('background-position');
}

var intro_action = noscroll_intro;

function onScroll(event) {
    var scrollPos = $(document).scrollTop();
    $('#navigation a').each(function() {
        var currLink = $(this);
        var header = $('header');
        var refElement = $(currLink.attr("href"));
        if (refElement.position().top - header.outerHeight() <= scrollPos && refElement.position().top + refElement.outerHeight() > scrollPos - header.outerHeight()) {
            $('#navigation ul li a').removeClass("active");
            currLink.addClass("active");
        } else {
            currLink.removeClass("active");
        }
    });
    intro_action(scrollPos);
    // $('#intro').css('background-position', 'left ' + ((scrollPos)) + 'px');
}
//modernizr functions
var mod = function() {
    intro_action = noscroll_intro;
    if (Modernizr.mq('only screen and (max-width : 480px)')) {
        $('.shorten object:not(.sm)').each(function() {
            $(this).attr('data', $(this).attr('data').replace(".svg", "_mobile.svg")).addClass('sm');
        });
        intro_action = scroll_intro;
    } else {
        $('.shorten object.sm').each(function() {
            $(this).attr('data', $(this).attr('data').replace("_mobile.svg", ".svg")).removeClass('sm');
        });
    }
    if (Modernizr.mq('only screen and (max-width : 768px)')) {
        $('.behind_image img:not(.sm)').each(function() {
            $(this).attr('src', $(this).attr('src').replace(".jpg", "_mobile.jpg")).addClass('sm');
        });
        intro_action = scroll_intro;
    } else {
        $('.behind_image img.sm').each(function() {
            $(this).attr('src', $(this).attr('src').replace("_mobile.jpg", ".jpg")).removeClass('sm');
        });
    }
}

var mustache = function () {
  jQuery('img.mustache').each(function () {
    var img = this;
    var oldSrc = img.src;
    $(img).removeClass('mustache');
    console.log(img);
    img.src = 'http://mustachify.me/?src=' + encodeURIComponent(img.src);
    setTimeout(function () {
      img.src = oldSrc;
      $(img).addClass('mustache');
    }, 20000);
  });
};

var clicks = 0;

$(document).on('click touchstart', function () {
    if (clicks === 0) {
        setTimeout(function () {
            clicks = 0;
        }, 2000);
    }
    clicks += 1;
    if (clicks === 10) {
        mustache();
    }
});
