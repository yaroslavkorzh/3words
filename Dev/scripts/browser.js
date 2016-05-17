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
            chrome.runtime.sendMessage(editorExtensionId, {event: "enable"}, function(response) {

                console.log(response.message);
            });
        }
        else{
            chrome.runtime.sendMessage(editorExtensionId, {event: "disable"}, function(response) {
                $('.__ts-browser-stat').hide();
                console.log(response.farewell);
            });
        }
    })
});

function updateTable(data) {
    var len = data.length;
    chrome.browserAction.setBadgeText({text: len.toString()});
    $('.__ts-browser-stat__counter').text(len);
    console.log(data);
    if (len) {
        var html = '';
        for (var i = 0; i < len; i++) {
            html += '<tr>' +
                '<td class="__ts-browser-stat__table__word">' + data[i].word + '</td>' +
                '<td class="__ts-browser-stat__table__counter">' + data[i].counter + '</td>' +
                '<td class="__ts-browser-stat__table__counter">' + data[i].actionCount + '</td>' +
                '</tr>';

        }

        $('.__ts-browser-stat__table tbody').html(html);
        $('.__ts-browser-stat').show();
    }
    else {
        $('.__ts-browser-stat').hide();
    }
}