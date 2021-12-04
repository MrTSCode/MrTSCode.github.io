//   Sementara nanti diambil dari database --> thresholdInputNumberStep2.jumlahPaketKambingPorsi
const thresholdInputNumberStep2 = {
    jumlahAnakMin: 1,
    jumlahAnamMax: 12,
    jumlahKambingMin: 0,
    jumlahKambingMax: 24,
    jumlahMenuTambahanMin: 20
};

const thresholdFromDBStep2 = {
    jumlahPaketKambingPorsi: 90,
    namaPaketKambing: 'Super',
    hargaPaketKambingJantan: 1100000,
    hargaPaketKambingBetina: 950000,
    warnaPaketKambing: 'green'
};

const arrayObjectMenuFromDBStep2 = [
    {  
        nama_menu: 'A', 
        harga_menu: 20000
    },
    {  
        nama_menu: 'B', 
        harga_menu: 16000
    },
    {  
        nama_menu: 'C', 
        harga_menu: 12000
    }
];

// Sementara nanti bisa langsung dari server POST method --> thresholdServerStep2
const thresholdServerStep2 = {
    modelAqiqah: 'Tebar Aqiqah'
}

let jumlah_kambing = 0;

let hitungJumlahMenuTambahanMax = function(arrayIndexInput, thresholdFromDBStep2) {
    let jumlahMenuTambahanMax;
        jumlah_kambing = 0;

    $.each(arrayIndexInput, function(index) {
        let thisObject = $(this)[0],
            thisValue;
        if (thisObject.name == 'jumlah_jantan' || thisObject.name == 'jumlah_betina') {
            thisValue = parseInt(thisObject.value);
            if (isNaN(thisValue)) {
                thisValue = 0;
            }
            jumlah_kambing += parseInt(thisValue);
        }

        if (thisObject.name == 'jumlah_menu_tambahan') {
            jumlahMenuTambahanMax = jumlah_kambing*thresholdFromDBStep2.jumlahPaketKambingPorsi;
            if (thisObject.value > jumlahMenuTambahanMax) {
                thisObject.value = jumlahMenuTambahanMax;
            }
            if (jumlahMenuTambahanMax == 0) {
                thisObject.value = '';
            }
            thisObject.max = jumlahMenuTambahanMax;
            thisObject.input.val(thisObject.value);
        }
    });
};

let InputGroupNumber = function(thisInput, thresholdStep2) {
    this.input = thisInput;
    this.value = this.input.val().replace(/[^0-9]/g, '');
    this.name  = this.input.attr('name');

    if (this.name == "jumlah_anak") {
        this.min = thresholdStep2.jumlahAnakMin;
        this.max = thresholdStep2.jumlahAnamMax;
    } else if (this.name == 'jumlah_jantan' || this.name == 'jumlah_betina') {
        this.min = thresholdStep2.jumlahKambingMin;
        this.max = thresholdStep2.jumlahKambingMax;
    } else {
        this.min = thresholdStep2.jumlahMenuTambahanMin;
        this.max = thresholdStep2.jumlahMenuTambahanMax;
    }
};

let inputAddSUbNumber = function(setValue, onEvent) {
    if (onEvent.value == '') {
        onEvent.value = 0;
    }

    setValue = parseInt(onEvent.value) + setValue;

    if (setValue <= onEvent.min) {
        setValue = onEvent.min;
        onEvent.input.parent('.inputGroup.number').removeClass('a-d').addClass('b-d');
    }

    if (setValue >= onEvent.max) {
        setValue = onEvent.max;
        onEvent.input.parent('.inputGroup.number').removeClass('b-d').addClass('a-d');
    }

    if (setValue > onEvent.min && setValue < onEvent.max) {
        onEvent.input.parent('.inputGroup.number').removeClass('b-d a-d');
    }

    if (setValue == 0) {
        setValue = '';
    }

    onEvent.value = setValue;
    onEvent.input.val(onEvent.value);
};

let elPemesanan = $('.pemesanan'),
    elAnak = elPemesanan,
    elInputNumber = elPemesanan.find('#step-2 .inputGroup.number'),
    elCheckMenuTambahan = elPemesanan.find('#step-2 .inputGroup input[type="checkbox"]'),
    arrayIndexInput = [];

elInputNumber.each(function(index) {
    let thisInput = $(this).children('input'),
        setValue,
        indexInput = new InputGroupNumber(thisInput, thresholdInputNumberStep2),
        ctrlDown = false;

    $(this).click(function(e) {
        if (e.target.localName == 'input') {
            return false;
        }
        if (indexInput.max == undefined || indexInput.max == 0) {
            return false;
        }
        if (e.offsetX < 0) {
            setValue = -1;
        } else {
            setValue = +1;
        }
        inputAddSUbNumber(setValue, indexInput);
        hitungJumlahMenuTambahanMax(arrayIndexInput, thresholdFromDBStep2);
        setDataRincian(arrayIndexInput, elRincian);
    });

    $(this).keyup(function(e) {
        if (e.keyCode == 17) ctrlDown = false;

        if (e.keyCode == 38 || e.keyCode == 40) {
            if (indexInput.max == undefined || indexInput.max == 0) {
                return false;
            }
            if (e.keyCode == 40) {
                setValue = -1;
            } else {
                setValue = +1;
            }
            inputAddSUbNumber(setValue, indexInput);
            hitungJumlahMenuTambahanMax(arrayIndexInput, thresholdFromDBStep2);
            setDataRincian(arrayIndexInput, elRincian);
        }
    });

    $(this).bind('paste',function(e) {
        setValue = parseInt(e.originalEvent.clipboardData.getData("text").replace(/[^0-9]/g, ""));
        e.preventDefault();

        if (setValue <= indexInput.min) {
            indexInput.value = indexInput.min;
            indexInput.input.parent('.inputGroup.number').removeClass('a-d').addClass('b-d');
        }

        if (setValue >= indexInput.max) {
            indexInput.value = indexInput.max;
            indexInput.input.parent('.inputGroup.number').removeClass('b-d').addClass('a-d');
        }

        if (setValue < indexInput.max && setValue > indexInput.min) {
            indexInput.value = setValue;
            indexInput.input.parent('.inputGroup.number').removeClass('b-d a-d');
        }

        if (indexInput.value == 0) {
            indexInput.value = '';
        }
        
        indexInput.input.val(indexInput.value);
        hitungJumlahMenuTambahanMax(arrayIndexInput, thresholdFromDBStep2);
        setDataRincian(arrayIndexInput, elRincian);
    });

    $(this).change(function() {
        setValue = parseInt(thisInput.val().replace(/[^0-9]/g, ""));
        
        if (setValue <= indexInput.min  || isNaN(setValue)) {
            setValue = indexInput.min;
            indexInput.input.parent('.inputGroup.number').removeClass('a-d').addClass('b-d');
        }

        if (setValue >= indexInput.max) {
            setValue = indexInput.max;
            indexInput.input.parent('.inputGroup.number').removeClass('b-d').addClass('a-d');
        }

        if (setValue > indexInput.min && setValue < indexInput.max) {
            indexInput.input.parent('.inputGroup.number').removeClass('b-d a-d');
        }

        if (setValue == 0) {
            setValue = '';
        } else {
            setValue = setValue.toFixed();
        }
        
        indexInput.value = setValue;
        indexInput.input.val(indexInput.value);
        hitungJumlahMenuTambahanMax(arrayIndexInput, thresholdFromDBStep2);
        setDataRincian(arrayIndexInput, elRincian);
    });

    $(this).keydown(function(e) {
        let key = Number(e.key);

        let thisP = $(this).parents('#jumlah-kambing');

        if (thisP.length && $(this).parent('.column.field').is(':last-child') && jumlah_kambing == 0 && e.keyCode == 9) {
            return false;
        }
        
        if (indexInput.max == undefined || indexInput.max == 0) {
            return false;
        }

        if (isNaN(key) && e.keyCode != 8 && e.keyCode != 9 && e.keyCode != 46 && e.keyCode != 37 && e.keyCode != 38 && e.keyCode != 39 && e.keyCode != 40 && e.keyCode != 17 && e.keyCode != 86 && e.keyCode != 67 || e.key === null || e.key === ' ') {
            return false;
        }

        if (e.keyCode == 17) ctrlDown = true;
        
        if ((e.keyCode == 67 || e.keyCode == 86) && ctrlDown == false) {
            return false;
        }
    });

    if (indexInput.value <= indexInput.min) {
        indexInput.input.parent('.inputGroup.number').addClass('b-d');
    }

    arrayIndexInput.push(indexInput);
});

elCheckMenuTambahan.click(function() {
    let thisCheck = $(this).is(':checked');
    if (!thisCheck) {
        $.each(arrayIndexInput, function() {
            let thisObject = $(this)[0];
            if (thisObject.name != 'jumlah_menu_tambahan') {
                return;
            }
            thisObject.value = '';
            thisObject.input.val(thisObject.value);
            $('#tambahan').parent('.segment').removeClass('show');
        });
        if (jumlah_kambing > 0) {
            elRincian.find('#lanjut-step-3').removeClass('disabled').addClass('green');
        }
    } else {
        $('#tambahan').parent('.segment').addClass('show');
        elRincian.find('#lanjut-step-3').removeClass('green').addClass('disabled');
    }
});

let randerItemMenu = function(target) {
    $.each(arrayObjectMenuFromDBStep2, function() {
        let thisObject = $(this)[0];
        target.append('<div class="item" data-value="'+thisObject.nama_menu+'"><b>Paket '+thisObject.nama_menu+'</b> - (Rp. '+thisObject.harga_menu+'/kotak)</div>');
    });
};

let formatRupiah = function(nominal) {
    return new Intl.NumberFormat('id-ID', { maximumSignificantDigits: 4, style: 'currency', currency: 'IDR' }).format(nominal)
};

let setDataRincian = function(arrayIndexInput, elRincian) {
    let thisSubTotal = 0;
    const elTotalHarga = elRincian.find('#total-harga');
    $.each(arrayIndexInput, function() {
        let thisObject = $(this)[0],
            thisValue;

        if (thisObject.name == 'jumlah_anak') {
            return true;
        }
        thisValue = parseInt(thisObject.value);
        if (isNaN(thisValue)) {
            thisValue = 0;
        }
        let thisEl,
            thisNominal = 0;
        if (thisObject.name == 'jumlah_jantan') {
            thisEl = elRincian.find('#jumlah-jantan');
            thisNominal = thresholdFromDBStep2.hargaPaketKambingJantan;
        } else if (thisObject.name == 'jumlah_betina') {
            thisEl = elRincian.find('#jumlah-betina');
            thisNominal = thresholdFromDBStep2.hargaPaketKambingBetina;
        } else {
            thisEl = elRincian.find('#jumlah-tambahan');
            if (menu_tambahan) {
                const newFormat = arrayObjectMenuFromDBStep2.find(format => (menu_tambahan == format.nama_menu));
                thisNominal = newFormat.harga_menu;
            }
        }
        thisNominal = thisNominal * thisValue;
        thisSubTotal += thisNominal;
        thisEl.text(thisValue);
        thisEl.siblings('.data-rincian.nominal').text(formatRupiah(thisNominal));
    });
    if (thisSubTotal == 0) {
        thisSubTotal = '-';
    } else {
        thisSubTotal = formatRupiah(thisSubTotal);
    }
    elTotalHarga.text(thisSubTotal);
    setEDButton();
};

let setEDButton = function() {
    let button = elRincian.find('#lanjut-step-3');
    tambahan = arrayIndexInput.find(format => ('jumlah_menu_tambahan' == format.name));
    if (elCheckMenuTambahan.is(':checked')) {
        if (tambahan.value == '' || tambahan.value == 0 || menu_tambahan == undefined) {
            button.addClass('disabled').removeClass('green');
        } else {
            button.removeClass('disabled').addClass('green');
        }
    } else {
        if (jumlah_kambing < 1) {
            button.addClass('disabled').removeClass('green');
        } else {
            button.removeClass('disabled').addClass('green');
        }
    }    
};

let tambahan,
    menu_tambahan;

$('.ui.dropdown').dropdown({
    onChange(value) {
        menu_tambahan = value;
        setDataRincian(arrayIndexInput, elRincian);
    }
});

randerItemMenu(elPemesanan.find('#tambahan .menu'));

let elRincian = elPemesanan.find('#step-2 .rincian');

elRincian.find('#model-aqiqah').text(thresholdServerStep2.modelAqiqah);
elRincian.find('#jenis-kambing').addClass(thresholdFromDBStep2.warnaPaketKambing).text(thresholdFromDBStep2.namaPaketKambing);

setDataRincian(arrayIndexInput, elRincian);

elRincian.find('#lanjut-step-3').click(function() {
    if (jumlah_kambing < 1) {
        return false;
    }

    tambahan = arrayIndexInput.find(format => ('jumlah_menu_tambahan' == format.name));

    if (elCheckMenuTambahan.is(':checked') && (menu_tambahan == 'undefined' || tambahan.value == '' || tambahan.value == 0)) {
        return false;
    }
});

// STEP 3 di bawah