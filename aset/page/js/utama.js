let qouteContent = $('.testimoni .quote-content'),
    qouteContentTime = 5000,
    quoteContentTimeout,
    quoteContentLastActiveIndex,
    root = $('.testimoni'),
    tQAnimationDur = getDuration(root.find('blockquote .quote').css('animation-duration'));

// Functions
let fadeThis = function(elIndex = quoteContentLastActiveIndex, el = qouteContent, elTime = qouteContentTime) {
    if (elIndex == el.filter('[data-order="1"]').index()) {
        return false;
    }

    let elLenght = el.filter('[data-order="1"]').length,
        elTarget;

    el.each(function(i) {
        let j = i;
        if (i > 2) {
            j = 2;
        }
        if (elLenght) {
            if (j == elIndex) {
                j = 1;
            } else if (j < elIndex && j != 0 || j > elIndex && j == 2 && elIndex != 1) {
                j = 0;
            } else if (j > elIndex && j != 2 || j < elIndex && j == 0 && elIndex != 1) {
                j = 2;
            }
        }
        $(this).attr('data-order',j);
    });
    el.filter('[data-order="1"]').addClass('active').siblings('.active').removeClass('active');
    quoteContentLastActiveIndex = el.filter('[data-order="1"]').index();
    elTarget = el.filter('[data-order="1"]').find('img').data('id');
    if (elIndex == el.length-1) {
        quoteContentLastActiveIndex = 0;
    } else {
        quoteContentLastActiveIndex++;
    }

    root.find('.quote.active').removeClass('active').addClass('transition');
    setTimeout(()=>{
        root.find('.quote.transition').removeClass('transition');
        setTimeout(()=>{
            root.find('.quote#'+elTarget).addClass('active');
        }, tQAnimationDur);
    }, tQAnimationDur);
    quoteContentTimeout = setTimeout(fadeThis, elTime);
};

fadeThis();

let tambahanControler = function (type = 'load') {
    let tColumn = $('.tambahan .column'),
        tSegmentPack,
        tSegmentPackName,
        tSegmentBColor,
        tSegmentData,
        tSegmentList;

    switch (type) {
        case 'load':
            tColumn.find('.paket .circular.segment').removeClass('raised');
            tColumn.find('.paket .vertical.segment:first-child>.circular.segment').addClass('raised');
            tSegmentPack = tColumn.find('.paket .circular.segment.raised');
            break;
        case 'mouseenter':
            tSegmentPack = $(this);
            tColumn = tSegmentPack.parents('.tambahan').find('.column');
            tSegmentPack.parent().siblings(':has(.raised)').children('.circular.segment').removeClass('raised');
            tSegmentPack.addClass('raised');
            break;
        default:
            break;
    };
    
    tSegmentPackName = tSegmentPack.children('.header.nama')[0].childNodes[0].nodeValue;
    tSegmentBColor = tSegmentPack.css('border-top-color');
    tSegmentData = tSegmentPack.data('tambahan');
    tSegmentList = tColumn.filter('.list').children('.segment[data-target-tambahan="'+tSegmentData+'"]');

    tSegmentList.prevAll('.segment').addClass('active');
    tSegmentList.addClass('active').nextAll('.segment').removeClass('active');
    tColumn.filter('.header.list').find('span').text(tSegmentPackName).css('color',tSegmentBColor);
};

tambahanControler();

// Events
$('.testimoni').find('.blockquote-image').on('click','.quote-content img', function(e) {
    let link = $(e.delegateTarget),
        img = $(this),
        quote = img.parents('.quote-content');

        e.preventDefault();
        
    if (!link.data('lockedAt') || +new Date() - link.data('lockedAt') > tQAnimationDur*2) {
        
        if (quote.hasClass('active')) {
            return false;
        }

        fadeThis(quote.index());
    }

    link.data('lockedAt', +new Date());
}).on('mouseenter','.quote-content img', function() {
    clearTimeout(quoteContentTimeout);
}).on('mouseleave', function() {
    let img = $(this),
        quote = img.find('.quote-content[data-order="2"]');
    quoteContentTimeout = setTimeout(()=>{
        fadeThis(quote.index());
    }, qouteContentTime);
});

$('.tambahan .column.paket').on('mouseenter', '.vertical.segment>.circular.segment', function(e) {
    tambahanControler.call($(this), e.type);
});

// 
// Perbaikan diganti ke tombol pesan nantinya
// 
$('header #reservasi').click(function() {
    $('#form-reservasi').sidebar({
        transition: 'scale down',
        closable: false
    }).sidebar('toggle');
});
//
// Perbaikan diganti ke tombol pesan nantinya
// 

