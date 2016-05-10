// background logics for all pages
console.log('init injected App logics');
$( '<style href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.2/css/font-awesome.min.css"></style>' ).appendTo($('head'))

chrome.extension.sendMessage({}, function(response) {
	console.log(response);
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------

	}
	}, 10);
});

var originalLeave = $.fn.popover.Constructor.prototype.leave;
$.fn.popover.Constructor.prototype.leave = function(obj){
	var self = obj instanceof this.constructor ?
			obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)
	var container, timeout;

	originalLeave.call(this, obj);

	if(obj.currentTarget) {
		container = $(obj.currentTarget).siblings('.popover')
		timeout = self.timeout;
		container.one('mouseenter', function(){
			//We entered the actual popover – call off the dogs
			clearTimeout(timeout);
			//Let's monitor popover content instead
			container.one('mouseleave', function(){
				$.fn.popover.Constructor.prototype.leave.call(self, self);
			});
		})
	}
};


$(document).on('click', '.js-overlay', function () {
	//$('.js-modal').hide();
	$(this).hide();
	$('.popover--open').trigger('click');
});
$(document).on('click', '.popover--header__close', function () {
	$('.js-overlay').trigger('click');
	$('.popover--open').trigger('click');
});

$(document).on('click', '.popover--expand', function () {
	var initialOffset = $('.popover').find('.arrow').offset();
	$('.popover').removeClass('preview').addClass('expanded');
	$('.popover').find('.preview').addClass('hidden');
	$('.popover').find('.expanding').removeClass('hidden');
	$('.popover').find('.arrow').offset({left: initialOffset.left})
	//$('.popover').css('left',parseInt($('.popover').css('left')) - 22 + 'px')
	//$('.popover--open').popover(); // tooltip |   { trigger: "hover focus click" }
});

$(document).on('click',  function (e) {
	console.log('clicked on:', e.target);
});

chrome.extension.onMessage.addListener(
		function(request, sender, sendResponse) {
			console.log(sender.tab ?
			"from a content script:" + sender.tab.url :
					"from the extension");
			if (request.greeting == "hello"){
				sendResponse({farewell: "goodbye"});
			}
			if (request.event == "disable"){
                hideSearch()
				sendResponse({farewell: "disable plugin"});
			}

		});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.greeting == "hello"){
            sendResponse({farewell: "goodbye"});
        }

        if (request.event == "disable"){
            hideSearch()
            sendResponse({farewell: "disable plugin"});
        }
        if (request.event == "enable"){
            showSearch()
            sendResponse({farewell: "enable plugin"});
        }
        if (request.event == "getData"){
            menuController.setData(request.response)
        }
    }
);


$(document).on('click', '.test', function () {
	// The ID of the extension we want to talk to.
	var editorExtensionId = "dkmlfgjcobbahijmdcomeejldoifncpj";
	// Make a simple request:
	chrome.runtime.sendMessage(editorExtensionId, {greeting: "hello"}, function(response) {
		console.log(response.farewell);
	});
});



//$('.js-overlay').show();

// setTimeout(function () {
//$('.js-overlay').trigger('click');
//}, 1500);

function highlightSearch() {
	var text = document.getElementById("query").value;
	var query = new RegExp("(\\b" + text + "\\b)", "gim");
	var e = document.getElementsByTagName("body")[0].innerHTML//document.getElementById("searchtext").innerHTML;

	var enew = e.replace(/(<\s*ext.*?>)|(<\s*\/\s*ext\s*.*?>)/igm, '');
	document.getElementsByTagName("body")[0].innerHTML = enew;
	var newe = enew.replace(query, "<ext class='popover__tooltip'>$1</ext>");
	document.getElementsByTagName("body")[0].innerHTML = newe;

	$('.popover__tooltip').popover({
		trigger: 'click hover',
		content: 'Some test content layout',
		title: 'Test popover',
		placement: 'auto',
		delay: {show: 50, hide: 100}}
	); // tooltip |   { trigger: "hover focus click" }

}

function hideSearch() {
    menuController.rollBack();
}
function showSearch(){
    menuController.init();
}

function rollbackWord(data){
    console.log(data)
    var text = data.transliteration;
    var query = new RegExp("(\\b" + text + "\\b)", "gim");
    var e = document.getElementsByTagName("body")[0].innerHTML;//document.getElementById("searchtext").innerHTML;
    var enew = e.replace(/(<\s*ext.*?>)|(<\s*\/\s*ext\s*.*?>)/igm, '');
    var newe = enew.replace(query, data.word);
    document.getElementsByTagName("body")[0].innerHTML = newe;
}

function highlightWord(data) {
	//console.log(data)
	var text = data.word;
	var query = new RegExp("(\\b" + text + "\\b)", "gim");
	var e = document.getElementsByTagName("body")[0].innerHTML;//document.getElementById("searchtext").innerHTML;
	//var enew = e.replace(/(<\s*ext.*?>)|(<\s*\/\s*ext\s*.*?>)/igm, '');
	var enew = e;
	document.getElementsByTagName("body")[0].innerHTML = enew;
	var style = 'popover__tooltip_'+data.id;
	var newe = enew.replace(query, "<ext class='popover__tooltip "+style+"' data-html='true'>"+ data.transliteration+"</ext>");
	document.getElementsByTagName("body")[0].innerHTML = newe;

    $('.'+style).textillate({
        in: {
            effect: 'wobble',
            delayScale: 1.50,
            delay: 10,
            sync: true,
            shuffle: false,
            reverse: false,
            callback: function () {}
        },
        // out animation settings.
        out: {
            effect: 'wobble',
            delayScale: 1.25,
            delay: 350,
            sync: true,
            shuffle: false,
            reverse: false,
            callback: function () {}
        }
    });


	var template = ' ';

	var popover_small = '<div  class="popover--tooltip preview" >'
			+ '<div  class="popover--tooltip__ta-wrapper" >'
				+ '<div  class="popover--tooltip__translation" >'
				+ '<div  class="popover--tooltip__translation popover--data__translation--label" >' + 'Translation: '   + '</div>'
				+ '<br><span> Translation: '   + data.translation + '</span>'
				+ '<br><span> Transliteration: '+ data.transliteration  + '</span>'
				+ '<br><span> Meaning: ' + data.meaning  + '</span>'
				+ '</div>'
			+ '</div>'
			+ '<div  class="" >' + '<button class="popover--expand">See more</button>' + '</div>'
			+ '</div>' ;

	var content = '<div  class="popover--data expanding hidden" >'
			+ '<div  class="popover--data__ta-wrapper" >'
			+ '<div  class="popover--data__translation" >'
			+ '<div  class="popover--data__translation popover--data__translation--label" >' + 'Translation: '   + '</div>'
            + '<br><span> Translation: '   + data.translation + '</span>'
            + '<br><span> Transliteration: '+ data.transliteration  + '</span>'
            + '<br><span> Meaning: ' + data.meaning  + '</span>'
			+ '</div>'

			+ '<div  class="popover--data__association" >'
			+ '<div  class="popover--data__association data__association--label" >'+ 'Associated image: ' + '</div>'
			+ '<div  class="popover--data__association data__association--image" >'+'<img src="'+ data.imageurl+ '" alt="image">' + '</div>'
			+ '</div>'
			+ '</div>'

			+ '<div  class="popover--data__example" >' + '<div  class="popover--data__example popover--data__example--label" >'+'Examples: ' + '</div>' +  data.example + '</div>'
			+ '<div  class="popover--data__audio" >'
			+ '<div  class="popover--data__audio data__audio--label" >' + 'test btn : ' + '</div>'
			+ '<div  class="popover--data__audio data__audio--cont" >' + '<button class="test">Test messaging</button>' + '<button class="nextWord">I\'m done with this word </button>'+ '</div>'
			+ '</div>'
            + '<div  class="popover--data__audio" >'
			+ '<div  class="popover--data__audio data__audio--label" >' + 'Pronunciation : ' + '</div>'
			+ '<div  class="popover--data__audio data__audio--cont" >' + '<audio src="The_Weeknd.mp3" class="audio--control" controls >' + '</div>'
			+ '</div>' ;

	var cont = '<div  class="popover-content__wrapper">'+template+popover_small+content+'</div>';
	var className = '.'+style;//'popover__tooltip';
	var elems = $(className);
	var header = '<div  class="popover--header expanding hidden" >'
			+ '<div  class="popover--header__label" >' + '<span>Translation: ' + data.word
			+ ' <i class="fa fa-arrow-right fa-1" aria-hidden="true"></i> '
			+ data.translation  + '</span></div>'
			+ '<i class="popover--header__close fa fa-times fa-3" aria-hidden="true"></i>'
			+ '</div>' ;
	var header_small = '<div  class="popover--header preview" >'
			+ '<div  class="popover--header__label" >' + '<span>Translation: ' + data.word
			+ ' <i class="fa fa-arrow-right fa-1" aria-hidden="true"></i> '
			+ data.translation  + '</span></div>'
			+ '<i class="popover--header__close fa fa-times fa-3" aria-hidden="true"></i>'
			+ '</div>' ;
	for(var i=0; i<elems.length; i++){
		var item = elems[i];
		//console.log($(item))

	}
	//console.log(style, cont, header);
	(function(style, cont, header){
		setTimeout(function(){
            //$('.'+style).textillate({
            //    in: {
            //        effect: 'tada',
            //        delayScale: 1.5,
            //        delay: 50,
            //        sync: true,
            //        shuffle: false,
            //        reverse: false,
            //        callback: function () {}
            //    },
            //    // out animation settings.
            //    out: {
            //        effect: 'tada',
            //        delayScale: 1.5,
            //        delay: 50,
            //        sync: true,
            //        shuffle: false,
            //        reverse: false,
            //        callback: function () {}
            //    }
            //});
			$('.'+style).popover({
				trigger: 'click ',//hover
				//selector: ,
				content: function() {
					return cont;//$('#popover-content').html();
				},
				title: function() {
					return header;//$('#popover-content').html();
				},
				placement: 'auto',//auto | bottom
				delay: {show: 50, hide: 200}}
			); // tooltip |   { trigger: "hover focus click" }
			//$('.'+style).tooltip({
			//	trigger: 'hover',//hover
			//	html: true,
			//	title: function() {
             //       return data.transliteration + ' is '+ data.word + '. Click the word';//$('#popover-content').html();
             //   },//'Click the word',
			//	placement: 'auto',
			//	delay: {show: 50, hide: 100}}
			//); // tooltip |   { trigger: "hover focus click" }

			$('.'+style).on('show.bs.popover', function (e) {
				//$('.js-overlay').show();
				$(this).addClass('popover--open');
				//console.log('show:', e.target, this);
			});

			$('.'+style).on('shown.bs.popover', function (e) {
				$('.js-overlay').show();
				$('.popover').addClass('preview');
				//console.log('shown:', e.target, this);
			});
			$('.'+style).on('hide.bs.popover', function (e) {
				$('.popover').removeClass('expanded').addClass('preview');
				$('.popover').find('.expanding').addClass('hidden');
				$('.popover').find('.preview').removeClass('hidden');
			});
			$('.'+style).on('hidden.bs.popover', function (e) {
				$('.js-overlay').hide();
				$(this).removeClass('popover--open');
			});

		}, 1000)
	})(style, cont, header);
    //(function(style, cont, header){
	//	setTimeout(function(){
     //       $('.'+style).textillate({
     //           in: {
     //               effect: 'wobble',
     //               delayScale: 1.25,
     //               delay: 50,
     //               sync: true,
     //               shuffle: false,
     //               reverse: false,
     //               callback: function () {}
     //           },
     //           // out animation settings.
     //           out: {
     //               effect: 'wobble',
     //               delayScale: 1.25,
     //               delay: 50,
     //               sync: true,
     //               shuffle: false,
     //               reverse: false,
     //               callback: function () {}
     //           }
     //       });
	//	}, 1000)
	//})(style, cont, header)



}

function menuConstructor(){
	var controller = {};

    controller.editorExtensionId = "dkmlfgjcobbahijmdcomeejldoifncpj";
	controller.data = [];
    //controller.data = [
	//	{
	//		id: '1',
	//		word: 'language',
	//		language_from: 'en',
	//		language_to: 'ru',
	//		translation: 'язык',
     //       transliteration: 'yazik',
	//		example: 'Выучить новый язык легко',
	//		imageurl: 'language.jpg'
	//	},{
	//		id: '2',
	//		word: 'help',
	//		language_from: 'en',
	//		language_to: 'ru',
	//		translation: 'помощь',
     //       transliteration: 'pomosh',
	//		example: 'Егор предложил свою помощь другу',
	//		imageurl: 'help.gif'
	//	},{
	//		id: '3',
	//		word: 'new',
	//		language_from: 'en',
	//		language_to: 'ru',
	//		translation: 'новый',
     //       transliteration: 'novuj',
	//		example: 'Антон купил новый автомобиль',
	//		imageurl: 'new.jpg'
	//	}
	//];

	controller.init = function(){
        chrome.runtime.sendMessage(this.editorExtensionId, {event: "getData"}, function(response) {
            console.log(response.data);
            controller.setData(response.data)
        });
	};
    controller.initWords = function(){
		var delay = 500;
		for(var i=0; i<this.data.length; i++){
			var item = this.data[i];
			(function(data, delay){
				setTimeout(function(){
					highlightWord(data)
				}, delay)
			})(item, delay*i)
		}
	};
    controller.rollBack = function(){
		var delay = 50;
		for(var i=0; i<this.data.length; i++){
			var item = this.data[i];
			(function(data, delay){
				setTimeout(function(){
					rollbackWord(data)
				}, delay)
			})(item, delay*i)


		}
	};
    controller.setData = function(newData){
        this.data = newData;
        console.log('got new data')
        this.initWords();
    };

	return controller;
}
var menuController = menuConstructor();
menuController.init();

var pageViewModel = function(data) {
	var self = this;

	this.words = ['random']
	this.activeItem = ko.observable();
	this.init = function(){

	};
	this.findItem= function(item){
		var result = null;
		for(var i=0; i<this.items.length; i++){
			var el = this.items[i];
			if(el.val == item){
				result = el;
			}
		}

		return result;
	};

};

$(document).ready(function () {
	$('.js-overlay').removeClass('hidden').hide();
	// inject fonts
	$('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.2/css/font-awesome.min.css">').appendTo('head')
	//https://maxcdn.bootstrapcdn.com/font-awesome/4.6.2/css/font-awesome.min.css
	//ko.applyBindings(new pageViewModel());
});