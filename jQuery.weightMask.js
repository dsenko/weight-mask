jQuery.fn.extend({

    maskWeight: function (userOptions) {

        var plugin = {

            arr: [/*'0', '0', '0', '0', '0', '0'*/],
            insertCount: 0,

            options: {
                integerDigits: 3,
                decimalDigits: 3,
                decimalMark: '.',
                initVal: '',//'000,000',
                roundingZeros: true,
                digitsCount: 6,
            },

            initializeOptions: function (userOptions) {

                console.log(userOptions);

                if (userOptions) {

                    for(var prop in userOptions){

                        if (userOptions[prop] !== undefined && userOptions[prop] !== null) {
                            this.options[prop] = userOptions[prop];
                        }

                    }

                }

                console.log(this.options);

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

                }

                this.options.digitsCount = this.options.integerDigits + this.options.decimalDigits;
                this.arr = [];

                for (var i = 0; i < this.options.digitsCount; i++) {
                    this.arr.push('0');
                }

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

                return this.reduce(value);

            },

            reduce: function (value) {

                if (this.options.roundingZeros) {
                    return parseInt(value.substring(0, this.options.integerDigits)) + this.options.decimalMark + value.substring(this.options.integerDigits, this.options.digitsCount);
                } else {
                    return value.substring(0, this.options.integerDigits) + this.options.decimalMark + value.substring(this.options.integerDigits, this.options.digitsCount);
                }

            },

            getNumber: function (e) {
                return String.fromCharCode(e.keyCode || e.which);
            },

            setCartetOnEnd: function (selector) {
                setTimeout(function () {
                    selector.selectionStart = selector.selectionEnd = 10000;
                }, 1);
            },

            isNumberOrBackspace: function (num) {

                if (num == 'backspace') {
                    return true;
                }

                if (parseInt(num)) {
                    return true;
                }

                return false;

            },

            init: function (selector) {

                var self = this;

                selector.val(this.options.initVal);

                selector.on('focus', function (e) {
                    self.setCartetOnEnd(selector);
                });

                selector.on('keydown', function (e) {
                    var key = e.keyCode || e.which;
                    if (key == 8 || key == 46) {
                        e.preventDefault();
                        e.stopPropagation();
                        selector.val(self.mask('backspace'));
                        self.setCartetOnEnd(selector);
                    }

                });

                selector.on('keypress', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    var num = self.getNumber(e);

                    if (self.isNumberOrBackspace(num)) {
                        selector.val(self.mask(num));
                        self.setCartetOnEnd(selector);
                    }

                });

            }

        };

        plugin.initializeOptions(userOptions);
        plugin.init($(this));

    }

});




