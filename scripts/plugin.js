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

$(document).on('click',  function (e) {
    console.log('clicked on:', e.target);
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
        delay: {show: 50, hide: 200}}
    ); // tooltip |   { trigger: "hover focus click" }

}
function highlightWord(data) {
    console.log(data)
    var text = data.word;
    var query = new RegExp("(\\b" + text + "\\b)", "gim");
    var e = document.getElementsByTagName("body")[0].innerHTML;//document.getElementById("searchtext").innerHTML;
    //var enew = e.replace(/(<\s*ext.*?>)|(<\s*\/\s*ext\s*.*?>)/igm, '');
    var enew = e;
    document.getElementsByTagName("body")[0].innerHTML = enew;
    var style = 'popover__tooltip_'+data.id;
    var newe = enew.replace(query, "<ext class='popover__tooltip "+style+"' data-html='true'>$1</ext>");
    document.getElementsByTagName("body")[0].innerHTML = newe;



    var template = ' ';
    var content = '<div  class="popover--data" >'
        + '<div  class="popover--data__ta-wrapper" >'
        + '<div  class="popover--data__translation" >'
            + '<div  class="popover--data__translation popover--data__translation--label" >'
            + 'Translation: '   + '</div>'
        + data.translation
        + '</div>'
                + '<div  class="popover--data__association" >'
                + '<div  class="popover--data__association data__association--label" >'+ 'Associated image: ' + '</div>'
                + '<div  class="popover--data__association data__association--image" >'+'<img src="images/'+ data.imagename+ '" alt="image">' + '</div>'
            + '</div>'
        + '</div>'

        + '<div  class="popover--data__example" >' + '<div  class="popover--data__example popover--data__example--label" >'+'Examples: ' + '</div>' +  data.example + '</div>'
        + '<div  class="popover--data__audio" >'
            + '<div  class="popover--data__audio data__audio--label" >' + 'Pronunciation : ' + '</div>'
            + '<div  class="popover--data__audio data__audio--cont" >' + '<audio src="The_Weeknd.mp3" class="audio--control" controls >' + '</div>'
        + '</div>' ;

    var cont = '<div  class="popover-content__wrapper">'+template+content+'</div>';
    var className = '.'+style;//'popover__tooltip';
    var elems = $(className);
    var header = '<div  class="popover--header" >'
        + '<div  class="popover--header__label" >' + '<span>Translation: ' + data.word
        + ' <i class="fa fa-arrow-right fa-1" aria-hidden="true"></i> '
        + data.translation  + '</span></div>'
        + '<i class="popover--header__close fa fa-times fa-3" aria-hidden="true"></i>'
        + '</div>' ;
    for(var i=0; i<elems.length; i++){
        var item = elems[i];
        //console.log($(item))

    }
    console.log(style, cont, header);
    (function(style, cont, header){
        setTimeout(function(){
            $('.'+style).popover({
                trigger: 'click ',//hover
                //selector: ,
                content: function() {
                    return cont;//$('#popover-content').html();
                },
                title: function() {
                    return header;//$('#popover-content').html();
                },
                placement: 'auto',
                delay: {show: 50, hide: 500}}
            ); // tooltip |   { trigger: "hover focus click" }
            $('.'+style).tooltip({
                trigger: 'hover',//hover
                html: true,
                title: 'Click the word',
                placement: 'auto',
                delay: {show: 50, hide: 100}}
            ); // tooltip |   { trigger: "hover focus click" }

            $('.'+style).on('show.bs.popover', function (e) {
                //$('.js-overlay').show();
                $(this).addClass('popover--open');
                console.log('show:', e.target, this);
            });

            $('.'+style).on('shown.bs.popover', function (e) {
                //$('.js-overlay').show();
                console.log('shown:', e.target, this);
            });
            $('.'+style).on('hidden.bs.popover', function (e) {
                $('.js-overlay').hide();
                console.log('hide popover')
                $(this).removeClass('popover--open');
            });

        }, 1000)
    })(style, cont, header)



}

function menuConstructor(){
    var controller = {};

    controller.data = [
        {
            id: '1',
            word: 'language',
            language_from: 'en',
            language_to: 'ru',
            translation: 'язык',
            example: 'Выучить новый язык легко',
            imagename: 'language.jpg'
        },{
            id: '2',
            word: 'help',
            language_from: 'en',
            language_to: 'ru',
            translation: 'помощь',
            example: 'Егор предложил свою помощь другу',
            imagename: 'help.gif'
        },{
            id: '3',
            word: 'new',
            language_from: 'en',
            language_to: 'ru',
            translation: 'новый',
            example: 'Антон купил новый автомобиль',
            imagename: 'new.jpg'
        }
    ];

    controller.init = function(){
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
    //controller.init()

    return controller;
}
var menuController = menuConstructor();

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
    menuController.init();
    ko.applyBindings(new pageViewModel());
});