
var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
$.fn.extend({
    animateCss: function (animationName, callback) {
        $(this).addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
            if(callback) {
                setTimeout(function(){
                    callback.call(this);
                }, 500);
            }

        });
    }
});

var wordsController = menuConstructor();


$(function(){
    chrome.runtime.sendMessage(wordsController.editorExtensionId , {event: "pluginState"}, function (response) {
        if(response.data){
            wordsController.init();
        }

    });

    chrome.extension.onMessage.addListener(
        function (request, sender, sendResponse) {
            console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
                "from the extension");
            if (request.event == "disable") {

                wordsController.destroy();
                sendResponse({farewell: "disable plugin"});
            }
            if (request.event == "enable") {
                wordsController.init();
                sendResponse({farewell: "enable plugin"});
            }
            if (request.event == "pause") {
                wordsController.pause();
                sendResponse({farewell: "pause plugin"});
            }

            if (request.event == "getLettersData") {
                if (request.reset == true) {
                    wordsController.resetLettersData(request.response);
                }
                else {
                    wordsController.setLettersData(request.response)
                }

            }
        }
    );
});



function menuConstructor() {
    var controller = {};

    controller.editorExtensionId = chrome.runtime.id;
    controller.random = false;
    controller.dataword = [];
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
    controller.init = function () {
        console.log('init controller');
        this.initHandlers();
        chrome.runtime.sendMessage(this.editorExtensionId, {event: "getData"}, function (response) {
            console.log(response.data);
            controller.setData(response.data);
        });

    };
    controller.initHandlers = function () {
        var self = this;

        var timer;
        $(document).on("scroll.tsWordsPlugin", function () {
            if(self.isReady){
                if ( timer ) clearTimeout(timer);
                timer = setTimeout(function(){
                    var $activeWord = $('.__ts-word--active-state');
                    if(!elementInViewport($activeWord[0])){
                        self.rollbackWord($activeWord);
                        self.randomWord();
                    }
                    if (self.noWordsFound) {
                        self.randomWord();
                    }
                }, self.timer);
            }


        });

        $(document).on("click.tsWordsPlugin", '.__ts-word', function (e) {
            e.stopPropagation();
            if($(this).hasClass('__ts-word--active')){
                $('.__ts-word').removeClass('__ts-word--active');
                self.isReady = true;
            }
            else{
                $('.__ts-word').removeClass('__ts-word--active');
                if(!$(this).hasClass('__ts-word--current-state')){
                    $(this).off(animationEnd);
                    $(this).removeClass('__ts-word--current-state animated jello').addClass('__ts-word--active');
                    if(!$(this).hasClass('__ts-word--learned-state--done')){
                        $(this).removeClass('__ts-word--learned-state').addClass('__ts-word--active-state');
                    }
                    var id = $(this).data('id');
                    var data = self.getWordById(id);
                    data.actionCount +=1;
                    data.renderCount = 1;
                    if(data.actionCount >= 3){
                        data.learned = true;
                    }
                    else{
                        // data.learned = false;
                    }

                    self.updateWord(data);
                    self.isReady = true;
                }
            }

            
        });
        var hooverTimer;
        $(document).on("mouseenter.tsWordsPlugin", '.__ts-word', function (e) {

            e.stopPropagation();
            var $el = $(this);
            hooverTimer = setTimeout(function(){
                console.log('in');
                if($el.hasClass('__ts-word--active') || $el.attr('class') == '__ts-word'){
                    clearTimeout(hooverTimer);
                    return false;
                }
                else{
                    $('.__ts-word').removeClass('__ts-word--active');
                    if(!$el.hasClass('__ts-word--current-state')){
                        $el.off(animationEnd);
                        $el.removeClass('__ts-word--current-state animated jello').addClass('__ts-word--active');
                        var id = $el.data('id');
                        var data = self.getWordById(id);
                        data.actionCount +=1;

                        data.renderCount = 1;

                        if(data.actionCount >= 3){
                            data.learned = true;
                        }
                        else{
                            // data.learned = false;
                        }
                        self.updateWord(data);
                        self.isReady = true;
                    }
                }
            }, 1000);



        });

        $(document).on("mouseleave.tsWordsPlugin", '.__ts-word', function (e) {
            console.log('out');
            clearTimeout(hooverTimer);
        });

        $(document).on("click.tsWordsPlugin", '.__ts-word-tooltip', function (e) {
            e.stopPropagation();
        });
        $(document).on("click.tsWordsPlugin", '.__ts-icon--close', function (e) {
            e.stopPropagation();
            $(document).trigger("click.tsWordsPlugin");
        });
        $(document).on("click.tsWordsPlugin", '.__ts-icon--info-showmore', function (e) {
            e.stopPropagation();
            var $tooltip = $(this).parents('.__ts-word-tooltip');
            $tooltip.addClass('__ts-word-tooltip--extended');
        });
        $(document).on("click.tsWordsPlugin", function (e) {
            $('.__ts-word').removeClass('__ts-word--active');
            $('.__ts-word-tooltip').removeClass('__ts-word-tooltip--extended');
        });

    };
    controller.initWords = function () {
        console.log('init words');
        var self = this;
        for (var i = 0; i < this.data.length; i++) {
            var item = this.data[i];
            this.findWord(item);
        }
    };
    controller.initWord = function (element, data) {
        var self = this;
        if (!data) {
            data = this.data[this.activeWordIndex];
        }

        if (!data && this.activeWordIndex >= this.data.length) {
            console.log('restart word loop');
            this.activeWordIndex = 0;
            data = this.data[this.activeWordIndex]
        }
        var index = this.activeWordIndex;
        if (this.data[index]) {
            this.data[index].renderCount += 1;

        }
        if(data.renderCount >= self.maxRender){
            data.learned = true;

            $('.__ts-word[data-id="'+data.id+'"]').removeClass('__ts-word--active-state').addClass('__ts-word--learned-state __ts-word--learned-state--done');
        }
        this.updateWord(this.data[this.activeWordIndex]);

        this.highlightWord(element, data);




    };
    controller.randomWord = function () {
        console.log('random word');
        var self = this;
        var id, data;
        var foundWords = this.words;
        var wordsInView = this.findWordsInView(foundWords) != null ? this.findWordsInView(foundWords) : [];
        var wordsLen = wordsInView.length;
        if (wordsLen > 0) {
            this.noWordsFound = false;
            for(var i =0; i< wordsLen; i++){
                id = $(wordsInView[i]).data('id');
                data = this.getWordById(id);
                if(data && data.learned){
                    $(wordsInView[i]).removeClass('__ts-word--active-state').addClass('__ts-word--learned-state __ts-word--learned-state--done');
                    if(this.activeWordIndex == data.id){
                        this.activeWordIndex = 0;
                        continue;
                    }
                }
                else{
                    if(!this.activeWordIndex){
                        this.activeWordIndex = id;
                        console.log(data);
                        this.initWord(wordsInView[i], data);
                        break;
                    }
                    else{
                       if(this.activeWordIndex == data.id){
                           console.log(data);
                           this.initWord(wordsInView[i], data);
                           break;
                       }
                    }

                }
            }




        }
        else {
            console.log('no possible matches');
            this.noWordsFound = true;
        }

    };
    controller.randomLetter = function () {
        // test letters to display
        //this.initWord(null, this.letters_data[0]);
    };
    controller.findWords = function () {
        var result = null;
        var foundWords = $('.__ts-word');
        if (foundWords.length > 0) {
            result = foundWords
        }
        return result;
    };
    controller.findWordsInView = function (words) {
        var result = null;
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

    controller.getWordById = function (id) {
        var result = null;
        var word;
        for (var k = 0; k < this.data.length; k++) {
            word = this.data[k];
            if (word.id == id) {
                result = word;
            }
        }
        for (var i = 0; i < this.letters_data.length; i++) {
            word = this.letters_data[i];
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
        for (var i = 0; i < this.letters_data.length; i++) {
            word = this.letters_data[i];
            if (word.id == id) {
                result = word;
            }
        }

        return result;
    };
    controller.show = function () {
        this.init()
    };
    controller.hide = function () {
        this.rollBack();
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
    controller.setData = function (newData) {
        this.data = newData;
        console.log('got data');
        this.initWords();
        this.words = this.findWords();
        this.randomWord();
    };

    controller.updateWord = function (word) {
        var self = this;
        console.log('update word data', word);
        var data = this.getWordById(word.id);
        data = word;
        if(data.actionCount > data.actionCap){
            data.learned = true;
            $('.__ts-word[data-id="'+data.id+'"]').removeClass('__ts-word--active-state').addClass('__ts-word--learned-state __ts-word--learned-state--done');
        }

        chrome.runtime.sendMessage(this.editorExtensionId, {event: "updateWord", word: data}, function (response) {
            console.log('updated:', response.result, response.word);
        });
    };
    controller.findWord = function (data) {
        var text = data.word;
        var word_query = new RegExp("(\\b(" + text + ")\\b)", "gim");
        // keywords to match. This *must* be a 'g'lobal regexp or it'll fail bad\
        var searchData = {
            searchRegex: word_query,
            data: data
        };


        replaceInElement(document.body, searchData, function (match) {
            var tooltipEl = document.createElement('ts3Words');
            $(tooltipEl)
                .addClass('__ts-word')
                .attr('data-id', data.id)
                .attr('id', 'ts3WordsID__' + getRandomInt(0, 1000))
                .append('<ts3Words class="__ts-word__label __ts-word__label--current">'+data.word+'</ts3Words>')
                .append('<ts3Words class="__ts-word__label __ts-word__label--translate">'+data.translation+'</ts3Words>')
                .append('<ts3Words class="__ts-word__label __ts-word__label--translit">'+data.transliteration+'</ts3Words>')
                .append('' +
                    '<ts3Words class="__ts-word-tooltip">' +
                        '<ts3Words class="__ts-word-tooltip__corner"></ts3Words>' +
                        '<ts3Words class="__ts-icon __ts-icon--info __ts-icon--info-showmore" title="show more"><svg viewBox="0 0 543.906 543.906"><path  d="M271.953,0C121.759,0,0,121.759,0,271.953s121.759,271.953,271.953,271.953 s271.953-121.759,271.953-271.953S422.148,0,271.953,0z M316.994,76.316c1.055-0.049,2.138-0.06,3.231,0 c14.724-0.484,27.533,10.622,29.578,24.987c6.576,27.581-22.719,55.228-49.631,44.192 C268.032,130.576,284.224,77.909,316.994,76.316z M303.739,196.318c20.875-1.327,24.519,22.964,18.014,47.592 c-12.695,56.583-32.455,111.403-43.175,168.442c5.178,22.523,33.575-3.312,45.721-11.558c10.329-8.213,12.124,2.083,15.637,10.71 c-25.776,18.058-51.687,36.447-80.395,50.991c-26.972,16.361-49.049-9.072-42.321-37.394 c11.128-52.841,25.776-104.882,37.736-157.564c3.737-28.468-33.728,0.511-44.872,7.136c-8.985,11.292-13.25,3.051-16.997-7.136 c29.871-21.816,60.325-48.593,93.313-65.949C293.138,198.238,298.92,196.622,303.739,196.318z"/></svg> </ts3Words>'+
                        '<ts3Words class="__ts-icon __ts-icon--close"><svg viewBox="0 0 212.982 212.982"><path style="fill-rule:evenodd;clip-rule:evenodd;" d="M131.804,106.491l75.936-75.936c6.99-6.99,6.99-18.323,0-25.312 c-6.99-6.99-18.322-6.99-25.312,0l-75.937,75.937L30.554,5.242c-6.99-6.99-18.322-6.99-25.312,0c-6.989,6.99-6.989,18.323,0,25.312 l75.937,75.936L5.242,182.427c-6.989,6.99-6.989,18.323,0,25.312c6.99,6.99,18.322,6.99,25.312,0l75.937-75.937l75.937,75.937 c6.989,6.99,18.322,6.99,25.312,0c6.99-6.99,6.99-18.322,0-25.312L131.804,106.491z"/></svg></ts3Words>' +
                        '<ts3Words class="__ts-word-tooltip__header">'+data.word+' - '+data.translation+'</ts3Words>' +
                        '<ts3Words class="__ts-word-tooltip__description">' +
                            '<ts3Words class="__ts-word-tooltip__blockquote">' +
                                '<ts3Words class="__ts-word-tooltip__blockquote__spelling">Pronounced in Russian: <ts3Words class="__ts-word-tooltip__blockquote__spelling-word">'+data.word+'</ts3Words><ts3Words class="__ts-icon __ts-icon--volume"></ts3Words></ts3Words>' +
                                '<ts3Words class="__ts-word-tooltip__blockquote__spelling">Written: <ts3Words class="__ts-word-tooltip__blockquote__spelling-word">'+data.transliteration+'</ts3Words></ts3Words>' +
                            '</ts3Words>' +
                            '<ts3Words class="__ts-word-tooltip__example">' +
                                '<ts3Words class="__ts-word-tooltip__example__title"><ts3Words class="__ts-icon __ts-icon--info"></ts3Words> Examples of usage:</ts3Words>' +
                                '<ts3Words class="__ts-word-tooltip__example__text">'+data.example+'</ts3Words>' +
                            '</ts3Words>' +
                        '</ts3Words>' +
                        '<ts3Words class="__ts-word-tooltip__figure">' +
                            '<img class="__ts-word-tooltip__img" src="'+data.imageurl+'">' +
                            '<ts3Words class="__ts-word-tooltip__figcaption">'+data.example+'</ts3Words>' +
                        '</ts3Words>' +
                    '</ts3Words>');
            if(data.learned){
                $(tooltipEl).addClass('__ts-word--learned-state __ts-word--learned-state--done');
            }
            return tooltipEl;
        });
    };
    controller.highlightWord = function (element, data) {
        var self = this;
        if (element && !$(element).hasClass('__ts-word--learned-state')) {
            console.log('-----------------')
            console.log(data.id)
            console.log(data.word)
            console.log(data.translation)
            console.log(data.renderCount)
            console.warn(this.activeWordIndex)
            self.isReady = false;
            $(element).addClass('__ts-word--current-state')
                .animateCss(self.animationClass, function(){
                $(element)
                    .removeClass('__ts-word--current-state')
                    .addClass('__ts-word--active-state')
                    .animateCss(self.animationClass, function(){

                        if($(element).hasClass('__ts-word--active')){
                            self.isReady = true;
                        }
                        else{
                            $(element).removeClass('__ts-word--active-state').addClass('__ts-word--learned-state');
                            $(element).animateCss(self.animationClass, function() {
                                $(element).removeClass('__ts-word--learned-state').addClass('__ts-word--active-state');
                                if($(element).hasClass('__ts-word--active')){
                                    self.isReady = true;
                                }
                                else{
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
    controller.createAnimation = function (selector, data, targetElement) {
        var elements = [];
        if (targetElement) {
            elements.push($(targetElement));
        }
        else {
            elements = $('.' + selector);
        }
        setTimeout(function () {
            for (var i = 0; i < elements.length; i++) {
                var item = elements[i];
                var id = $(item).attr('id');
                (function (element, data, id) {
                    var elem = $('#' + id);
                    var pluginInited = elem.data('tt');
                    if (!pluginInited) {
                        elem.textillate({
                            minDisplayTime: 100,
                            in: {
                                effect: 'tada',
                                delayScale: 1.5,
                                delay: 50,
                                sync: true,
                                shuffle: false,
                                reverse: false,
                                callback: function () {

                                }
                            },
                            // out animation settings.
                            out: {
                                effect: 'tada',
                                delayScale: 1.5,
                                delay: 125,
                                sync: true,
                                shuffle: false,
                                reverse: false,
                                callback: function () {

                                }
                            }
                        });
                        elem.data('tt', true);
                    }
                    else {
                        elem.textillate('start');
                    }

                    setTimeout(function () {
                        elem.find('.texts li:first').text(data.translation);
                        elem.textillate('start');
                    }, 750)
                    setTimeout(function () {
                        elem.find('.texts li:first').text(data.transliteration);
                        elem.textillate('start');
                    }, 1500)

                })(item, data, id)

            }

        }, 50)

    };
    controller.createPopover = function (selector, data, element) {
        var template = ' ';
        var popover_small = '<div  class="popover--tooltip preview" >'
            + '<div  class="popover--tooltip__ta-wrapper" >'
            + '<div  class="popover--tooltip__translation" >'
            + '<div  class="popover--tooltip__translation popover--data__translation--label" >' + 'Translation: ' + '</div>'
            + '<br><span> Translation: ' + data.translation + '</span>'
            + '<br><span> Transliteration: ' + data.transliteration + '</span>'
            + '<br><span> Meaning: ' + data.meaning + '</span>'
            + '</div>'
            + '</div>'
            + '<div  class="" >' + '<button type="button" class="btn btn-info popover--expand">See more</button>' + '</div>'
            + '</div>';

        var popover_big = '<div  class="popover--data expanding hidden" >'
            + '<div  class="popover--data__ta-wrapper" >'
            + '<div  class="popover--data__translation" >'
            + '<div  class="popover--data__translation popover--data__translation--label" >' + 'Translation: ' + '</div>'
            + '<br><span> Translation: ' + data.translation + '</span>'
            + '<br><span> Transliteration: ' + data.transliteration + '</span>'
            + '<br><span> Meaning: ' + data.meaning + '</span>'
            + '</div>'

            + '<div  class="popover--data__association" >'
            + '<div  class="popover--data__association data__association--label" >' + 'Associated image: ' + '</div>'
            + '<div  class="popover--data__association data__association--image" >' + '<img src="' + data.imageurl + '" alt="image">' + '</div>'
            + '</div>'
            + '</div>'

            + '<div  class="popover--data__example" >' + '<div  class="popover--data__example popover--data__example--label" >' + 'Examples: ' + '</div>' + data.example + '</div>'
            + '<div  class="popover--data__audio" >'
            + '<div  class="popover--data__audio data__audio--label" >' + 'test btn : ' + '</div>'
            + '<div  class="popover--data__audio data__audio--cont" >' + '<button class="test hidden ">Test messaging</button>' + '<button type="button" class="btn btn-success nextWord">I\'m done</button>' + '</div>'
            + '</div>'
            + '<div  class="popover--data__audio" >'
            + '<div  class="popover--data__audio data__audio--label" >' + 'Pronunciation : ' + '</div>'
            + '<div  class="popover--data__audio data__audio--cont" >'
            //+ '<audio src="audio/The_Weeknd.mp3" class="audio--control" controls >'
            + '</div>'
            + '</div>';

        var cont = '<div  class="popover-content__wrapper">' + template + popover_small + popover_big + '</div>';
        var className = '.' + selector;//'popover__tooltip';

        var header_small = '<div  class="popover--header preview " >'
            + '<div  class="popover--header__label" >' + data.word
            + ' <i class="fa fa-arrow-right fa-1" aria-hidden="true"></i> '
            + data.translation + '</span></div>'
            + '</div>';
        var header_big = '<div  class="popover--header expanding hidden" >'
            + '<div  class="popover--header__label" >' + '<span>Translation: ' + data.word
            + ' <i class="fa fa-arrow-right fa-1" aria-hidden="true"></i> '
            + data.translation + '</span></div>'
            + '<i class="popover--header__close fa fa-times fa-3" aria-hidden="true"></i>'
            + '</div>';
        var header = header_big + header_small;
        (function (selector, targetElement, cont, header) {
            setTimeout(function () {
                var elements = [];
                if (targetElement) {
                    elements.push($(targetElement));
                }
                else {
                    elements = $('.' + selector);
                }

                for (var i = 0; i < elements.length; i++) {
                    var item = elements[i];
                    var id = $(item).attr('id');
                    var element = $('#' + id);

                    element.popover({
                            trigger: 'hover ',//hover
                            //selector: ,
                            content: function () {
                                return cont;//
                            },
                            title: function () {
                                return header;//
                            },
                            placement: 'bottom',//auto | bottom | top
                            delay: {show: 50, hide: 400}
                        }
                    ); // tooltip |   { trigger: "hover focus click" }

                    //element.tooltip({
                    //	trigger: 'hover',//hover
                    //	html: true,
                    //	title: function() {
                    //		return data.transliteration + ' is '+ data.word + '. Click the word';//$('#popover-content').html();
                    //	},//'Click the word',
                    //	placement: 'auto',
                    //	delay: {show: 50, hide: 100}}
                    //); // tooltip |   { trigger: "hover focus click" }

                    element.on('show.bs.popover', function (e) {
                        //$('.js-overlay').show();
                        $(this).addClass('popover--open').removeClass('new').addClass('active');
                        var wordId = $(this).data('id');
                        var word = wordsController.getWordById(wordId);
                        if (word.renderCount != 1) {
                            word.renderCount = 1;
                            wordsController.updateWord(word);
                        }

                        //console.log('show:', e.target, this);
                    });

                    element.on('shown.bs.popover', function (e) {
                        $('.js-overlay').show();
                        $('.popover').addClass('preview');
                        //console.log('shown:', e.target, this);
                    });
                    element.on('hide.bs.popover', function (e) {
                        var popover = $('.popover');
                        popover.removeClass('expanded').addClass('preview');
                        popover.find('.expanding').addClass('hidden');
                        popover.find('.preview').removeClass('hidden');
                    });
                    element.on('hidden.bs.popover', function (e) {
                        $('.js-overlay').hide();
                        $(this).removeClass('popover--open').addClass('new').removeClass('active');
                    });
                }

            }, 1000)
        })(selector, element, cont, header);
    };

    controller.destroy = function () {
        $(document).off("scroll.tsWordsPlugin");
        $('.__ts-word').each(function(){
            var text = $(this).find('.__ts-word__label--current').text();
            $(this).replaceWith(text);
        });
        console.log('destroy plugin');
    };
    controller.pause = function () {
        $(document).off("scroll.tsWordsPlugin");
        console.log('pause plugin');
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
            if (tag != 'style' && tag != 'script' && tag != 'a' && tag != 'meta' && tag != 'noscript') {
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
    if(el){
        var top = el.offsetTop;
        var left = el.offsetLeft;
        var width = el.offsetWidth;
        var height = el.offsetHeight;

        while (el.offsetParent) {
            el = el.offsetParent;
            top += el.offsetTop;
            left += el.offsetLeft;
        }

        return (
            top >= window.pageYOffset &&
            left >= window.pageXOffset &&
            (top + height) <= (window.pageYOffset + window.innerHeight) &&
            (left + width) <= (window.pageXOffset + window.innerWidth)
        );
    }
    else{
        return false;
    }

}