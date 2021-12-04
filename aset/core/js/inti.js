let morpOverride = {
        animation: "fadeInLeft",
        separator: ",",
        speed: 1500,
        complete: function () {
            if (this.index === 0) {
                this.settings.animation = 'fadeInDown';
            }
            if (this.index === this.phrases.length - 2) {
                this.settings.animation = 'fadeIn';
            }
            if (this.index === this.phrases.length - 1) {
                this.stop();
            }
        }
    },
    morpOverride2 = {
        animateIn: "fadeIn",
        animateOut: "fadeOut",
        speed: 4000
    };

let el,
    rotateEl,
    dataMorp,
    mouseTimeout;
$('header.menu>nav.menu>.item').each(function() {
    el = $(this);
    rotateEl = el.find('.js-rotating');
    if (!rotateEl.length) {
        return false;
    }
    let morp = rotateEl.Morphext(morpOverride);
    dataMorp = morp.data("plugin_Morphext");
    dataMorp.stop();
    $(this).on('mouseenter', function() {
        if ($(window).outerWidth() <= 500) {
            return false;
        }
        dataMorp.stop();
        el = $(this);
        el.parents('header.menu').addClass('hover');
        clearTimeout(mouseTimeout)
        mouseTimeout = setTimeout(function () {
            rotateEl = el.find('.js-rotating');
            morp = rotateEl.Morphext(morpOverride);
            dataMorp = morp.data("plugin_Morphext");
            dataMorp.start();
        }, 50);
    });

    $(this).on('mouseleave', function() {
        el.parents('header.menu').removeClass('hover');
        dataMorp.stop();
    });
});

$('.showcase .block-rotators').Morphist(morpOverride2);

let header = $('header.menu'),
    btn,
    id,
    itemBtnSidebar = '<div id="toggle-nav" class="item"><div class="ui basic icon button"><div class="hamburgers hamburger--stand"><div class="hamburger-box"><div class="hamburger-inner"></div></div></div></div>';

const body = $('body');

function doneResizing() {
    let w = $(this).outerWidth();
    btn = header.children('#toggle-nav');

    if (w >= 500) {
        body.removeAttr('style');
        btn.remove();
        header.children('nav').removeAttr('style');
        return false;
    }
    if (btn.length) {
        return false;
    }
    header.children('.header.item').after(itemBtnSidebar);
    header.find('nav').attr('style','transition-duration: 1s');
}

doneResizing();

header.on('click', '#toggle-nav', function () {
    $(this).find('.hamburgers').toggleClass("is-active");

    let nav = $(this).siblings('nav');
        nav.toggleClass('show');
    
        if (!nav.hasClass('show')) {
            body.removeAttr('style');
            header.removeClass('hover');
            return false;
        }
        body.attr('style','overflow: hidden !important;');
        header.addClass('hover');
});

let currentTime = new Date(),
    year = currentTime.getFullYear();

$('footer #copyright').children('span').text(year);

$('.ui.sidebar').on('click', '.panel-info i.close.icon', function() {
    $('#form-reservasi').sidebar('hide');
    $('#form-reservasi').find('.card.selected').removeClass('selected');
    $('#form-reservasi').find('input[type="radio"]').prop("checked", false);
    $('#lanjutKeStep-2').addClass('disabled');
});

$('.ui.sidebar').on('click', '.cards>.card', function() {
    let thisC = $(this),
        thisIR = thisC.find('input[type="radio"]');
    if (thisC.hasClass('selected')) {
        return false;
    }
    if (!thisIR.length) {
        return false;
    }
    thisIR.prop("checked", true);
    thisC.siblings('.selected').removeClass('selected');
    thisC.addClass('selected');
    $('#lanjutKeStep-2').removeClass('disabled');
});

$(window).scroll(function () {
    if ($(window).scrollTop() > 0) {
        header.addClass('sticky');
    } else {
        header.removeClass('sticky');
    }
});

let resizeTimeout;
$(window).resize(function () {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(function () {
        doneResizing();
        dataMorp.stop();
        if ($(this).outerWidth() >= 500) {
            dataMorp.start();
        }
    }, 50);
});