$(function() {
    var editorExtensionId = chrome.runtime.id;
    chrome.runtime.sendMessage(editorExtensionId, {event: "pluginState"}, function (response) {

           $('#tsWordsPlugin').prop('checked',response.data);
        setTimeout(function () {
            $('.__ts-browser-switch__label').addClass('__ts-browser-switch__label--anim');
        },500);


    });
    chrome.runtime.sendMessage(editorExtensionId, {event: "updateStats"}, function (response) {
        updateTable(response.data)

    });
    chrome.extension.onMessage.addListener(
        function (request, sender, sendResponse) {
            console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
                "from the extension");

            if (request.event == "updateStats") {
                console.log(request.data)
                updateTable(request.data)
                //sendResponse({data: statsData});
            }
        });



    $(document).on('change.tsWordsPlugin', '#tsWordsPlugin', function (e) {
        if($(this).prop('checked')){
            $('.control-stats').addClass('selected');
            $('.control-settings').removeClass('selected');
            $('.__ts-browser-settings').fadeOut();
            $('.__ts-browser-stat').fadeIn();
            chrome.runtime.sendMessage(editorExtensionId, {event: "browser_enable"}, function(response) {

                console.log(response.message);
            });
        }
        else{
            chrome.runtime.sendMessage(editorExtensionId, {event: "browser_disable"}, function(response) {
                $('.__ts-browser-stat').hide();
                $('.__ts-browser-settings').hide();
                $('.control-stats').removeClass('selected');
                $('.control-settings').removeClass('selected');
                console.log(response.message);
            });
        }
    });
    $(document).on('click', '.help-icon', function (e) {
        $('.__ts-browser-help-block').fadeIn();
    });
    $(document).on('click', '.close-icon', function (e) {
        $('.__ts-browser-help-block').fadeOut();
    })

    $(document).on('click', '.control-stats', function (e) {
        if(!$(this).hasClass('selected')){
            $(this).addClass('selected');
            $('.control-settings').removeClass('selected');
            $('.__ts-browser-settings').fadeOut();
            $('.__ts-browser-stat').fadeIn();
        }
        else {
            $(this).removeClass('selected');
            $('.__ts-browser-stat').fadeOut();
        }
    });

    $(document).on('click', '.control-settings', function (e) {

        if(!$(this).hasClass('selected')){
            $(this).addClass('selected');
            $('.control-stats').removeClass('selected');
            $('.__ts-browser-stat').fadeOut();
            $('.__ts-browser-settings').fadeIn();

        }
        else {
            $(this).removeClass('selected');
            $('.__ts-browser-settings').fadeOut();
        }
    })
});

function updateTable(data) {
    var len = data.length;
    $('.__ts-browser-stat__counter').text(len);
    console.log(data);
    if (len) {
        var html = '';
        for (var i = 0; i < len; i++) {
            html += '<tr>' +
                '<td class="__ts-browser-stat__table__word">' + data[i].word + '</td>' +
                '<td class="__ts-browser-stat__table__counter">' + data[i].counter + '</td>' +
                '<td class="__ts-browser-stat__table__counter">' + data[i].actionCount + '</td>' +
                '<td class="__ts-browser-stat__table__counter">' + data[i].learned + '</td>' +
                '</tr>';

        }

        $('.__ts-browser-stat__table tbody').html(html);
        $('.control-stats').addClass('selected');
        $('.__ts-browser-stat').show();
    }
    else {
        $('.control-stats').removeClass('selected');
        $('.__ts-browser-stat').hide();
    }
}