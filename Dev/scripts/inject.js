var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
$.fn.extend({
    animateCss: function (animationName, callback) {
        $(this).addClass('animated ' + animationName).one(animationEnd, function () {
            $(this).removeClass('animated ' + animationName);
            if (callback) {
                setTimeout(function () {
                    callback.call(this);
                }, 500);
            }

        });
    }
});

var wordsController = menuConstructor();


$(function () {
    chrome.runtime.sendMessage(wordsController.editorExtensionId, {event: "pluginState"}, function (response) {
        if (response.data) {
            wordsController.init();
        }

    });

    chrome.extension.onMessage.addListener(
        function (request, sender, sendResponse) {
            //console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");

            if (request.event == "disable") {
                wordsController.destroy();
                sendResponse({message: "disable plugin"});
            }
            if (request.event == "enable") {
                if (request.activeTab == true) {
                    wordsController.init();
                }
                sendResponse({message: "enable plugin"});
            }
            if (request.event == "pause") {
                wordsController.pause();
                sendResponse({message: "pause plugin"});
            }
            if (request.event == "reset") {
                wordsController.reset();
                sendResponse({message: "reset plugin"});
            }

            if (request.event == "updateWord" && request.activeTab == false) {
                wordsController.updateWordData(request.data.word);
            }
        }
    );
});


function menuConstructor() {
    var controller = {};

    controller.editorExtensionId = chrome.runtime.id;
    controller.states = {
        enabled: 'enabled',
        disabled: 'disabled',
        paused: 'paused',
        active: 'active'
    }
    controller.pluginState = controller.states.enabled;
    controller.random = false;
    controller.data = [];
    controller.letters_data = [];
    controller.activeWord = {};
    controller.activeWordIndex = 0;
    controller.retryCount = 0;
    controller.maxRender = 4;
    controller.retryCap = 1000;
    controller.noWordsFound = false;
    controller.words = [];
    controller.timer = 400;
    controller.animationClass = 'jello';
    controller.isReady = true;

    /* Workflow functions */
    controller.init = function () {
        console.log('init controller');
        this.initHandlers();
        chrome.runtime.sendMessage(this.editorExtensionId, {event: "getData"}, function (response) {
            console.log(response.data);
            controller.setData(response.data);
        });

    };
    controller.destroy = function () {
        $(document).off("scroll.tsWordsPlugin");
        $('.__ts-word').each(function () {
            var text = $(this).find('.__ts-word__label--current').text();
            $(this).replaceWith(text);
        });
        console.log('destroy plugin');
    };
    controller.pause = function () {
        this.pluginState = this.states.paused;
        $(document).off("scroll.tsWordsPlugin");
        $(document).off("click.tsWordsPlugin");
        $(document).off("mouseenter.tsWordsPlugin");
        $(document).off("mouseleave.tsWordsPlugin");
        this.clearHighlight();
        console.log('pause plugin');
    };

    /* Initialization functions */
    controller.initHandlers = function () {
        var self = this;

        console.log('init handlers');
        $(document).on('ajaxComplete', function (event, xhr, settings) {
            console.log('content loaded', "Triggered ajaxComplete handler. The result is " +
                xhr.responseText);
            self.initWords();
            self.words = self.findWords();
            self.pickRandomWord();
        });

        var timer;
        $(document).on("scroll.tsWordsPlugin", function () {
            var target = $('.__ts-word--active');
            self.adjustPopover(target);

            if (self.isReady) {
                if (timer) clearTimeout(timer);
                timer = setTimeout(function () {
                    var $activeWord = $('.__ts-word--active-state');
                    console.log('scroll end');
                    if (!elementInViewport($activeWord[0])) {
                        self.rollbackWord($activeWord);
                        self.pickRandomWord();
                    }
                    if (self.pluginState = self.states.enabled && self.noWordsFound) {
                        self.pickRandomWord();
                    }
                }, self.timer);
            }


        });

        $(document).on("click.tsWordsPlugin", '.__ts-word', function (e) {
            e.stopPropagation();
            self.adjustPopover(this);
            if ($(this).hasClass('__ts-word--active')) {
                if (!$(this).find('.__ts-word-tooltip').hasClass('__ts-word-tooltip--extended')) {
                    $(this).find('.__ts-word-tooltip').addClass('__ts-word-tooltip--extended');
                    adjustPosition($(this));
                }
                else {
                    $('.__ts-word').removeClass('__ts-word--active');
                    $('.__ts-word-tooltip').removeClass('__ts-word-tooltip--extended');
                    adjustPosition($(this));
                }

                self.isReady = true;
            }
            else {
                $('.__ts-word').removeClass('__ts-word--active');
                if (!$(this).hasClass('__ts-word--current-state') || true) {
                    $(this).off(animationEnd);
                    $(this).removeClass('__ts-word--current-state animated jello').addClass('__ts-word--active');
                    if (!$(this).hasClass('__ts-word--learned-state--done')) {
                        $(this).removeClass('__ts-word--learned-state').addClass('__ts-word--active-state');
                    }
                    var $tooltip = $(this).find('.__ts-word-tooltip');
                    $tooltip.addClass('__ts-word-tooltip--extended');

                    adjustPosition($(this));
                    var id = $(this).data('id');
                    var data = self.getWordById(id);
                    data.actionCount += 1;
                    data.renderCount = 1;
                    if (data.actionCount >= 3) {
                        data.learned = true;
                    }
                    else {
                        // data.learned = false;
                    }

                    self.updateWord(data);
                    self.isReady = true;
                }
            }


        });
        var hooverTimer;
        $(document).on("mouseenter.tsWordsPlugin", '.__ts-word', function (e) {
            self.adjustPopover(this);
            e.stopPropagation();
            var $el = $(this);
            hooverTimer = setTimeout(function () {
                console.log('in');
                if ($el.hasClass('__ts-word--active') || $el.attr('class') == '__ts-word') {
                    clearTimeout(hooverTimer);
                    return false;
                }
                else {
                    $('.__ts-word').removeClass('__ts-word--active');
                    if (!$el.hasClass('__ts-word--current-state' || true)) {
                        $el.off(animationEnd);
                        $el.removeClass('__ts-word--current-state animated jello').addClass('__ts-word--active');
                        if (!$el.hasClass('__ts-word--learned-state--done')) {
                            $el.removeClass('__ts-word--learned-state').addClass('__ts-word--active-state');
                        }
                        adjustPosition($el);
                        var id = $el.data('id');
                        var data = self.getWordById(id);
                        data.actionCount += 1;

                        data.renderCount = 1;

                        if (data.actionCount >= 3) {
                            data.learned = true;
                        }
                        else {
                            // data.learned = false;
                        }
                        self.updateWord(data);
                        self.isReady = true;
                    }
                }
            }, 700);


        });

        $(document).on("mouseleave.tsWordsPlugin", '.__ts-word', function (e) {
            console.log('out');
            clearTimeout(hooverTimer);
        });

        $(document).on("click.tsWordsPlugin", '.__ts-word-tooltip', function (e) {
            e.stopPropagation();
            if (!$(this).hasClass('__ts-word-tooltip--extended')) {
                $('.__ts-icon--info-showmore').trigger("click.tsWordsPlugin");
            }
        });
        $(document).on("click.tsWordsPlugin", '.__ts-icon--close', function (e) {
            e.stopPropagation();
            $(document).trigger("click.tsWordsPlugin");
        });
        $(document).on("click.tsWordsPlugin", '.__ts-icon--info-showmore', function (e) {
            e.stopPropagation();
            var $tooltip = $(this).parents('.__ts-word-tooltip');
            $tooltip.addClass('__ts-word-tooltip--extended');
            adjustPosition($(this).parents('.__ts-word'));
        });
        $(document).on("click.tsWordsPlugin", function (e) {
            $('.__ts-word').removeClass('__ts-word--active').removeClass('__ts-pos-left').removeClass('__ts-pos-right');
            $('.__ts-word-tooltip').removeClass('__ts-word-tooltip--extended');

        });

    };
    controller.setData = function (newData) {
        var self = this;
        this.data = newData;
        console.log('got data');
        this.initWords();
        this.words = this.findWords();
        var interval;
        if (!this.words) {
            console.log('no words');
            // interval =  setInterval(function () {
            //     if(self.retryCount >= self.retryCap){
            //         console.log('retry limit reached, stop loop');
            //         clearInterval(interval);
            //     }
            //     else {
            //         //self.initWords();
            //         self.words = self.findWords();
            //         self.pickRandomWord();
            //     }
            //
            //}, 3000)
        }
        else {
            this.pickRandomWord();
            //clearInterval(interval);
        }

    };
    controller.initWords = function () {
        console.log('init words');
        var self = this;
        for (var i = 0; i < this.data.length; i++) {
            var item = this.data[i];
            this.findWord(item);
        }
    };
    controller.pickRandomWord = function () {
        console.log('random word');
        var self = this;
        var id, data;
        var foundWords = this.words;
        var wordsInView = this.findWordsInView(foundWords) != null ? this.findWordsInView(foundWords) : [];
        var wordsLen = wordsInView.length;
        if (this.retryCount >= this.retryCap) {
            console.log('retry limit reached, stop loop');
            return false;
        }

        if (wordsLen > 0) {
            this.noWordsFound = false;

            var activeWord = false;
            for (var k = 0; k < self.data.length; k++) {
                if (self.data[k].active && !self.data[k].learned) {
                    activeWord = self.data[k];
                    break;
                }
            }

            // if(!activeWord){
            //     for(var i= 0; i< self.data.length; i++){
            //         if(!self.data[i].learned){
            //             activeWord = self.data[i];
            //             break;
            //         }
            //     }
            // }


            for (var i = 0; i < wordsLen; i++) {

                id = $(wordsInView[i]).data('id');
                data = this.getWordById(id);
                if (data && data.learned) {
                    $(wordsInView[i]).removeClass('__ts-word--active-state')
                        .addClass('__ts-word--learned-state __ts-word--learned-state--done');
                    data.active = false;
                    // if(this.activeWordIndex == data.id){
                    //     this.activeWordIndex = 0;
                    //     continue;
                    // }
                }
                else {
                    if (data) {
                        if (activeWord) {
                            if ($(wordsInView[i]).data('id') == activeWord.id) {
                                this.initWord(wordsInView[i], data);
                                break;
                            }
                            else {
                                console.log('no possible matches');
                                this.noWordsFound = true;
                                this.retryCount++;
                            }
                        }
                        else {
                            activeWord = data;
                            activeWord.active = true;
                            this.initWord(wordsInView[i], data);
                            break;
                        }

                    }

                    /******/
                    // if(!this.activeWordIndex){
                    //     this.activeWordIndex = id;
                    //     console.log(data);
                    //     this.initWord(wordsInView[i], data);
                    //     break;
                    // }
                    // else{
                    //    if(this.activeWordIndex == data.id){
                    //        console.log(data);
                    //        this.initWord(wordsInView[i], data);
                    //        break;
                    //    }
                    // }

                }
            }


        }
        else {
            console.log('no possible matches');
            this.noWordsFound = true;
            this.retryCount++;
        }

    };

    controller.initWord = function (element, data) {
        var self = this;
        // if (!data) {
        //     data = this.data[this.activeWordIndex];
        // }

        // if (!data && this.activeWordIndex >= this.data.length) {
        //     console.log('restart word loop');
        //     this.activeWordIndex = 0;
        //     data = this.data[this.activeWordIndex]
        // }
        // var index = this.activeWordIndex;
        // if (this.data[index]) {
        //     this.data[index].renderCount += 1;
        //
        // }
        // for(var i =0; i<this.data.length; i++ ){
        //     if(i == index){
        //         this.data[index].active = true;
        //     }
        //     else{
        //         this.data[index].active = false;
        //     }
        //
        // }
        data.renderCount += 1;
        if (data.renderCount >= self.maxRender) {
            data.learned = true;

            $('.__ts-word[data-id="' + data.id + '"]').removeClass('__ts-word--active-state').addClass('__ts-word--learned-state __ts-word--learned-state--done');
        }
        this.updateWord(data);

        this.highlightWord(element, data);


    };
    controller.randomLetter = function () {
        // test letters to display
        //this.initWord(null, this.letters_data[0]);
    };

    /* Search functions */
    controller.findWord = function (data) {
        var self = this;
        var searchStr = '';
        for (var i = 0; i < data.search.length; i++) {
            var wordVar = data.search[i];
            if (i > 0) {
                searchStr = searchStr + '|' + wordVar;
            }
            else {
                searchStr = wordVar;
            }
        }
        var word_query = new RegExp("(\\b(" + searchStr + ")\\b)", "gim");
        // keywords to match. This *must* be a 'g'lobal regexp or it'll fail bad\
        var searchData = {
            searchRegex: word_query,
            data: data
        };

        replaceInElement(document.body, searchData, function (matches) {
            var popOver = self.generatePopover(data, matches);
            return popOver;
        });
    };
    controller.findWordsInView = function (words) {
        var result = null;
        if (!words) return result;
        for (var i = 0; i < words.length; i++) {
            var randWord = words[i];
            var id = $(randWord).data('id');
            var inView = elementInViewport(randWord);

            if (inView) {
                if (!result) {
                    result = []
                }
                result.push(randWord)
            }
        }
        return result;
    };
    controller.findWordsAvailable = function (words) {
        var result = null;
        for (var i = 0; i < words.length; i++) {
            var randWord = words[i];
            var id = $(randWord).data('id');
            var data = this.getWordById(id);

            if (!data.learned) {
                if (!result) {
                    result = []
                }
                result.push(randWord)
            }
        }
        return result;
    };


    controller.show = function () {
        this.init()
    };
    controller.reset = function () {
        $('.__ts-word').attr('class', '__ts-word');
        $('.__ts-word').find('.__ts-word-tooltip').attr('class', '__ts-word-tooltip');

    };
    controller.markLearnedWord = function (word) {
        $('.__ts-word[data-id="' + word.id + '"]').removeClass('__ts-word--active-state').addClass('__ts-word--learned-state __ts-word--learned-state--done');
    };
    controller.rollBack = function () {
        var self = this;
        var delay = 50;
        for (var i = 0; i < this.data.length; i++) {
            var item = this.data[i];
            (function (data, delay) {
                setTimeout(function () {
                    self.rollbackWord(data)
                }, delay)
            })(item, delay * i)
        }
    };


    controller.updateWord = function (word) {
        var self = this;
        //console.log('update word data', word);
        var data = this.getWordById(word.id);
        data = word;
        if (data.actionCount > data.actionCap) {
            data.learned = true;
            this.markLearnedWord(data);
        }

        chrome.runtime.sendMessage(this.editorExtensionId, {event: "updateWord", word: data}, function (response) {
            console.log('updated  word data:', response.result, response.word);
        });
    };
    controller.updateWordData = function (word) {
        var self = this;
        console.info('recieved word update', word);
        var data = this.getWordById(word.id);
        var index = this.getWordIndex(word.id);
        if (word.learned) {
            this.markLearnedWord(word);
        }

        this.data[index] = word;
    };

    controller.generatePopover = function (data, match) {
        var examplesList = '';

        for (var k = 0; k < data.examples.length; k++) {
            var example = data.examples[k];
            examplesList += '<li><ts3Words class="__ts-word-tooltip__example__text">' + example + '</ts3Words></li>';
        }

        var tooltipEl = document.createElement('ts3Words');
        $(tooltipEl)
            .addClass('__ts-word')
            .attr('data-id', data.id)
            .attr('id', 'ts3WordsID__' + getRandomInt(0, 1000))
            .append('<ts3Words class="__ts-word__label __ts-word__label--match">' + match[0] + '</ts3Words>')
            .append('<ts3Words class="__ts-word__label __ts-word__label--current">' + match[0] + '</ts3Words>')// not data.word because many searches to one word
            .append('<ts3Words class="__ts-word__label __ts-word__label--translate">' + data.translation + '</ts3Words>')
            .append('<ts3Words class="__ts-word__label __ts-word__label--translit">' + data.transliteration + '</ts3Words>')
            .append('' +
                '<ts3Words class="__ts-word-tooltip">' +
                '<ts3Words class="__ts-word-tooltip__corner"></ts3Words>' +
                '<ts3Words class="__ts-icon __ts-icon--info __ts-icon--info-showmore" title="show more"><svg viewBox="0 0 543.906 543.906"><path  d="M271.953,0C121.759,0,0,121.759,0,271.953s121.759,271.953,271.953,271.953 s271.953-121.759,271.953-271.953S422.148,0,271.953,0z M316.994,76.316c1.055-0.049,2.138-0.06,3.231,0 c14.724-0.484,27.533,10.622,29.578,24.987c6.576,27.581-22.719,55.228-49.631,44.192 C268.032,130.576,284.224,77.909,316.994,76.316z M303.739,196.318c20.875-1.327,24.519,22.964,18.014,47.592 c-12.695,56.583-32.455,111.403-43.175,168.442c5.178,22.523,33.575-3.312,45.721-11.558c10.329-8.213,12.124,2.083,15.637,10.71 c-25.776,18.058-51.687,36.447-80.395,50.991c-26.972,16.361-49.049-9.072-42.321-37.394 c11.128-52.841,25.776-104.882,37.736-157.564c3.737-28.468-33.728,0.511-44.872,7.136c-8.985,11.292-13.25,3.051-16.997-7.136 c29.871-21.816,60.325-48.593,93.313-65.949C293.138,198.238,298.92,196.622,303.739,196.318z"/></svg> </ts3Words>' +
                '<ts3Words class="__ts-icon __ts-icon--close"><svg viewBox="0 0 212.982 212.982"><path style="fill-rule:evenodd;clip-rule:evenodd;" d="M131.804,106.491l75.936-75.936c6.99-6.99,6.99-18.323,0-25.312 c-6.99-6.99-18.322-6.99-25.312,0l-75.937,75.937L30.554,5.242c-6.99-6.99-18.322-6.99-25.312,0c-6.989,6.99-6.989,18.323,0,25.312 l75.937,75.936L5.242,182.427c-6.989,6.99-6.989,18.323,0,25.312c6.99,6.99,18.322,6.99,25.312,0l75.937-75.937l75.937,75.937 c6.989,6.99,18.322,6.99,25.312,0c6.99-6.99,6.99-18.322,0-25.312L131.804,106.491z"/></svg></ts3Words>' +
                '<ts3Words class="__ts-word-tooltip__header">' + match[0] + ' - ' + data.translation + '</ts3Words>' +
                '<ts3Words class="__ts-word-tooltip__description">' +
                '<ts3Words class="__ts-word-tooltip__blockquote">' +
                '<ts3Words class="__ts-word-tooltip__blockquote__spelling">Pronounced in Russian: <ts3Words class="__ts-word-tooltip__blockquote__spelling-word">' + data.transliteration + '</ts3Words><ts3Words class="__ts-icon __ts-icon--volume"><svg viewBox="0 0 31.237 31.237"><path d="M4.363,10.761H0v9.715h4.363l8.244,6.114c0,0,1.512,1.268,1.512-0.041c0-1.312,0-20.858,0-22.051 c0-1.028-1.33-0.024-1.33-0.024L4.363,10.761z"/><path d="M18.816,8.865c-0.436-0.434-1.137-0.434-1.568,0c-0.436,0.434-0.436,1.138,0,1.568 c1.426,1.431,2.133,3.286,2.135,5.157c-0.002,1.875-0.709,3.742-2.135,5.166c-0.436,0.434-0.436,1.136,0,1.573 c0.215,0.218,0.498,0.324,0.785,0.324c0.281,0,0.566-0.106,0.783-0.324c1.855-1.859,2.787-4.306,2.785-6.739 C21.604,13.155,20.672,10.721,18.816,8.865z"/><path d="M21.824,5.37c-0.438-0.436-1.139-0.436-1.572,0c-0.43,0.435-0.43,1.137,0,1.572 c2.398,2.396,3.592,5.52,3.596,8.657c-0.004,3.154-1.193,6.292-3.596,8.702c-0.432,0.434-0.43,1.133,0,1.57 c0.219,0.212,0.502,0.322,0.787,0.322c0.283,0,0.568-0.11,0.785-0.322c2.832-2.84,4.242-6.562,4.242-10.272 C26.066,11.901,24.645,8.194,21.824,5.37z"/> <path d="M25.508,1.79c-0.432-0.436-1.135-0.436-1.57,0c-0.43,0.434-0.43,1.138,0,1.568 c3.387,3.387,5.078,7.809,5.078,12.245c0,4.449-1.686,8.884-5.078,12.278c-0.434,0.433-0.43,1.139,0,1.57 c0.219,0.215,0.504,0.322,0.789,0.322c0.281,0,0.564-0.107,0.781-0.322c3.822-3.825,5.73-8.845,5.729-13.849 C31.238,10.607,29.32,5.602,25.508,1.79z"/></svg> </ts3Words></ts3Words>' +
                '<ts3Words class="__ts-word-tooltip__blockquote__spelling">Written: <ts3Words class="__ts-word-tooltip__blockquote__spelling-word">' + match[0] + '</ts3Words></ts3Words>' +
                '</ts3Words>' +
                '<ts3Words class="__ts-word-tooltip__example">' +
                '<ts3Words class="__ts-word-tooltip__example__title"><ts3Words class="__ts-icon __ts-icon--info __ts-icon--info--example"><svg viewBox="0 0 543.906 543.906"><path  d="M271.953,0C121.759,0,0,121.759,0,271.953s121.759,271.953,271.953,271.953 s271.953-121.759,271.953-271.953S422.148,0,271.953,0z M316.994,76.316c1.055-0.049,2.138-0.06,3.231,0 c14.724-0.484,27.533,10.622,29.578,24.987c6.576,27.581-22.719,55.228-49.631,44.192 C268.032,130.576,284.224,77.909,316.994,76.316z M303.739,196.318c20.875-1.327,24.519,22.964,18.014,47.592 c-12.695,56.583-32.455,111.403-43.175,168.442c5.178,22.523,33.575-3.312,45.721-11.558c10.329-8.213,12.124,2.083,15.637,10.71 c-25.776,18.058-51.687,36.447-80.395,50.991c-26.972,16.361-49.049-9.072-42.321-37.394 c11.128-52.841,25.776-104.882,37.736-157.564c3.737-28.468-33.728,0.511-44.872,7.136c-8.985,11.292-13.25,3.051-16.997-7.136 c29.871-21.816,60.325-48.593,93.313-65.949C293.138,198.238,298.92,196.622,303.739,196.318z"/></svg></ts3Words> Examples of usage:</ts3Words>' +
                '<ul>' + examplesList + '</ul>' +
                '</ts3Words>' +
                '</ts3Words>' +
                '<ts3Words class="__ts-word-tooltip__figure">' +
                '<img class="__ts-word-tooltip__img" src="' + data.imageurl + '">' +
                '<ts3Words class="__ts-word-tooltip__figcaption">' + data.examples[0] + '</ts3Words>' +
                '</ts3Words>' +
                '</ts3Words>');
        if (data.learned) {
            $(tooltipEl).addClass('__ts-word--learned-state __ts-word--learned-state--done');
        }
        return tooltipEl;

    };
    controller.highlightWord = function (element, data) {
        var self = this;
        if (element && !$(element).hasClass('__ts-word--learned-state')) {
            console.log('---------highlight--------');
            console.info('id:', data.id, '| word:', data.word, '| translation:', data.translation, '| render count:', data.renderCount);
            self.isReady = false;
            $(element).addClass('__ts-word--current-state')
                .animateCss(self.animationClass, function () {
                    $(element)
                        .removeClass('__ts-word--current-state')
                        .addClass('__ts-word--active-state')
                        .animateCss(self.animationClass, function () {

                            if ($(element).hasClass('__ts-word--active')) {
                                self.isReady = true;
                            }
                            else {
                                $(element).removeClass('__ts-word--active-state').addClass('__ts-word--learned-state');
                                $(element).animateCss(self.animationClass, function () {
                                    $(element).removeClass('__ts-word--learned-state').addClass('__ts-word--active-state');
                                    if ($(element).hasClass('__ts-word--active')) {
                                        self.isReady = true;
                                    }
                                    else {
                                        self.isReady = true;
                                        $(element).animateCss(self.animationClass);
                                    }


                                });
                            }

                        });
                });

        }
    };
    controller.rollbackWord = function ($el) {
        $('.__ts-word').removeClass('__ts-word--active');
        $el.removeClass('__ts-word--active-state');
    };
    controller.clearAll = function (data) {
        var text = data.transliteration;
        var query = new RegExp("(\\b" + text + "\\b)", "gim");
        var style = 'popover__tooltip_' + data.id;
        var elements = $('.' + style);
        for (var i = 0; i < elements.length; i++) {
            var item = elements[i];
            //$(item).html(data.word);
            $(item).removeClass('new');

        }
        //var e = document.getElementsByTagName("body")[0].innerHTML;//
        //var enew = e.replace(/(<\s*ext.*?>)|(<\s*\/\s*ext\s*.*?>)/igm, '');
        //var newe = enew.replace(query, data.word);
        //document.getElementsByTagName("body")[0].innerHTML = newe;
    };
    controller.clearHighlight = function () {
        $('.__ts-word--learned-state--done').removeClass('__ts-word--learned-state--done');
        $('.__ts-word--learned-state').removeClass('__ts-word--learned-state');
        $('.__ts-word--active').removeClass('__ts-word--active');
        $('.__ts-word--active-state').removeClass('__ts-word--active-state');
    };

    /* Utility functions */
    controller.getWordById = function (id) {
        var result = null;
        var word;
        for (var k = 0; k < this.data.length; k++) {
            word = this.data[k];
            if (word.id == id) {
                result = word;
            }
        }

        return result;
    };
    controller.getWordIndex = function (id) {
        var result = null;
        var word;
        for (var k = 0; k < this.data.length; k++) {
            word = this.data[k];
            if (word.id == id) {
                result = k;
            }
        }

        return result;
    };
    controller.findWords = function () {
        var result = null;
        var foundWords = $('.__ts-word');
        if (foundWords.length > 0) {
            result = foundWords
        }
        return result;
    };
    controller.adjustPopover = function (target) {

        var activeEl = target ? $(target) : $('.__ts-word--active-state');
        if (activeEl.length > 0) { //$('.__ts-word--active')
            var activeOffset = activeEl.offset();
            var activePosition = activeEl.position();
            var activeOParent = activeEl.offsetParent();
            var aHeight = activeEl.height();
            var aWidth = activeEl.width();
            var aScrollTop = activeEl.scrollTop();
            var dScroll = $(document).scrollTop();
            var tooltip = activeEl.find('.__ts-word-tooltip');
            var adjustTop = activeOffset.top - dScroll + aHeight;
            var adjustLeft = activeOffset.left + aWidth / 2;
            tooltip.css('top', adjustTop + 'px');
            tooltip.css('left', adjustLeft + 'px');

        }


        console.log(adjustTop, adjustLeft, dScroll, activeOffset, activePosition, activeOParent, aScrollTop, aHeight, aWidth);

    };   

    return controller;
}
function replaceInElement(element, searchData, replace) {
    // iterate over child nodes in reverse, as replacement may increase
    // length of child node list.
    var find = searchData.searchRegex;
    for (var i = element.childNodes.length; i-- > 0;) {
        var child = element.childNodes[i];
        if (child.nodeType == 1) { // ELEMENT_NODE
            var tag = child.nodeName.toLowerCase();
            if (tag != 'style' && tag != 'script' &&
                tag != 'a' && tag != 'meta' && tag != 'noscript' &&
                tag != 'link') {
                // special case, don't touch CDATA elements and URLs
                replaceInElement(child, searchData, replace);
            }
        } else if (child.nodeType == 3) { // TEXT_NODE
            replaceInText(child, searchData, replace);
        }
    }
}
function replaceInText(text, searchData, replace) {
    var match;
    var matches = [];
    var find = searchData.searchRegex;
    var data = searchData.data;
    while (match = find.exec(text.data))
        matches.push(match);
    for (var i = matches.length; i-- > 0;) {
        match = matches[i];
        text.splitText(match.index);
        text.nextSibling.splitText(match[0].length);
        text.parentNode.replaceChild(replace(match), text.nextSibling);
    }
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function elementInViewport(el) {
    if (el) {
        //special bonus for those using jQuery
        if (typeof jQuery === "function" && el instanceof jQuery) {
            el = el[0];
        }

        var rect = el.getBoundingClientRect();


        var result = rect.bottom > 0 &&
            rect.right > 0 &&
            rect.left < (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */ &&
            rect.top < (window.innerHeight || document.documentElement.clientHeight);

        return result;
    }
    else {
        return false;
    }

}

function adjustPosition($el) {
    $el.removeClass('__ts-pos-left').removeClass('__ts-pos-right');
    var left = $el.find('.__ts-word-tooltip').offset().left;
    var space = 20;
    if (left < space) {
        $el.removeClass('__ts-pos-right').addClass('__ts-pos-left');
    }
    else {
        if (($(window).width() - ($el.find('.__ts-word-tooltip').offset().left + $el.find('.__ts-word-tooltip').width())) < space) {
            $el.removeClass('__ts-pos-left').addClass('__ts-pos-right');
        }
        else {
            $el.removeClass('__ts-pos-left').removeClass('__ts-pos-right');
        }
    }
}