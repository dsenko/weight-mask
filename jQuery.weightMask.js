jQuery.fn.extend({


    maskWeight: function (userOptions) {

        window._maskData = {

            selector: $(this),
            arr: [/*'0', '0', '0', '0', '0', '0'*/],
            insertCount: 0,
            numberPressed: false,

            options: {
            },

            defOptions: {
                integerDigits: 3,
                decimalDigits: 3,
                decimalMark: '.',
                initVal: '',//'000,000',
                roundingZeros: true,
                digitsCount: 6,
            },

            initializeOptions: function (userOptions) {

                this.options = $.extend(true, this.defOptions);
                this.arr = [];
                this.insertCount = 0;
                this.numberPressed = false;

                if (userOptions) {

                    for (var prop in userOptions) {

                        if (userOptions[prop] !== undefined && userOptions[prop] !== null) {
                            this.options[prop] = userOptions[prop];
                        }

                    }

                }

                if (this.options.decimalDigits == 0) {
                    this.options.decimalMark = '';
                }

                var initValFromUser = false;

                if (this.options.initVal == '') {

                    if (this.options.roundingZeros) {
                        this.options.initVal += '0';
                    } else {
                        for (var i = 0; i < this.options.integerDigits; i++) {
                            this.options.initVal += '0';
                        }
                    }

                    this.options.initVal += this.options.decimalMark;

                    for (var i = 0; i < this.options.decimalDigits; i++) {
                        this.options.initVal += '0';
                    }

                } else {
                    initValFromUser = true;
                }

                this.options.digitsCount = this.options.integerDigits + this.options.decimalDigits;
                this.arr = [];

                for (var i = 0; i < this.options.digitsCount; i++) {
                    this.arr.push('0');
                }

                if (initValFromUser && parseInt(this.options.initVal) > 0) {
                    this.createInitialValueArr();
                }

            },

            createInitialValueArr: function () {

                this.options.initVal = this.options.decimalDigits == 0 ? parseInt(this.options.initVal) : parseFloat(this.options.initVal.toString().replace(',', '.')).toFixed(this.options.decimalDigits).replace('.', this.options.decimalMark);

                var splitted = this.options.initVal.toString().replace('.', '').replace(',', '').split('');

                for (var i = 0; i < splitted.length; i++) {
                    this.insert(splitted[i]);
                }

            },

            insert: function (num) {

                var insert = this.mask(num);
                this.selector.val(insert);
                this.setCartetOnEnd();

            },

            mask: function (num) {

                if (num == 'backspace') {

                    if (this.insertCount > 0) {
                        this.arr.pop();
                        this.arr.unshift('0');
                        this.insertCount--;
                    }

                } else {

                    if (this.insertCount < this.options.digitsCount) {
                        this.arr.shift();
                        this.arr.push(num.toString());
                        this.insertCount++;
                    }

                }

                var value = '';

                for (var i = 0; i < this.arr.length; i++) {
                    value += this.arr[i];
                }


                value = this.reduce(value);

                return value;

            },

            reduce: function (value) {

                if (this.options.decimalDigits == 0) {
                    if (this.options.roundingZeros) {
                        return parseInt(value);
                    } else {
                        return value;
                    }
                } else {
                    if (this.options.roundingZeros) {
                        return parseInt(value.substring(0, this.options.integerDigits)) + this.options.decimalMark + value.substring(this.options.integerDigits, this.options.digitsCount);
                    } else {
                        return value.substring(0, this.options.integerDigits) + this.options.decimalMark + value.substring(this.options.integerDigits, this.options.digitsCount);
                    }
                }


            },

            getNumber: function (e) {
                return String.fromCharCode(e.keyCode || e.which);
            },

            setCartetOnEnd: function () {

                var self = this;

                setTimeout(function () {

                    var len = self.selector.val().length;
                    self.selector[0].focus();
                    self.selector[0].setSelectionRange(len, len);

                    //self.selector.selectionStart = self.selector.selectionEnd = 10000;

                }, 1);

            },

            isNumberOrBackspace: function (num) {

                if (num == 'backspace') {
                    return true;
                }

                if (parseInt(num) || parseInt(num) == 0) {
                    return true;
                }

                return false;

            },

            init: function () {

                var self = this;

                this.selector.val(this.options.initVal);

                this.selector.on('click', function (e) {
                    self.setCartetOnEnd();
                });

                var ua = navigator.userAgent.toLowerCase();
                var isAndroid = ua.indexOf("android") > -1;
                if (isAndroid) {


                    this.selector.unbind('keydown');
                    this.selector.on('keydown', function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        self.numberPressed = true;

                        var num = this.value.charAt(this.value.length - 1);

                        self.insert(num);

                    });

                    this.selector[0].removeEventListener('input', window._maskDataAndroidMaskHandler, false);

                    setTimeout(function(){

                        window._maskDataAndroidMaskHandler = function (e) {
                            e.preventDefault();
                            e.stopPropagation();

                            setTimeout(function () {

                                if (!self.numberPressed) {
                                    self.insert('backspace');
                                }

                                self.numberPressed = false;

                            }, 0);

                        };

                        self.selector[0].addEventListener('input', window._maskDataAndroidMaskHandler, false);

                    }, 0);


                } else {

                    this.selector.on('keydown', function (e) {
                        var key = e.keyCode || e.which;

                        if (key == 8 || key == 46) {
                            e.preventDefault();
                            e.stopPropagation();
                            self.insert('backspace');
                        }

                    });

                    this.selector.on('keypress', function (e) {

                        var key = e.keyCode || e.which;

                        e.preventDefault();
                        e.stopPropagation();

                        var num = self.getNumber(e);

                        if (self.isNumberOrBackspace(num)) {
                            self.insert(num);
                        }

                    });

                }

            }

        };

        window._maskData.initializeOptions(userOptions);
        window._maskData.init();

    },

    removeMask: function () {

        if (window._maskData) {
            $(this).unbind();
            window._maskData = null;
        }

    },

});




