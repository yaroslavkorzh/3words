$(function() {
    var editorExtensionId = chrome.runtime.id;
    chrome.runtime.sendMessage(editorExtensionId, {event: "pluginState"}, function (response) {

           $('#tsWordsPlugin').prop('checked',response.data);
        setTimeout(function () {
            $('.__ts-browser-switch__label').addClass('__ts-browser-switch__label--anim');
        },500);


    });
    chrome.runtime.sendMessage(editorExtensionId, {event: "updateStats"}, function (response) {
        var len = response.data.length;
        console.log(response);
        if(len){
            var html='';
            for(var i =0; i< len; i++){
                html += '<tr>' +
                    '<td class="__ts-browser-stat__table__word">'+response.data[i].word+'</td>' +
                    '<td class="__ts-browser-stat__table__counter">'+response.data[i].counter+'</td>' +
                    '<td class="__ts-browser-stat__table__counter">'+response.data[i].actionCount+'</td>' +
                    '</tr>';

            }

            $('.__ts-browser-stat__table tbody').html(html);
            $('.__ts-browser-stat').show();
        }
        else{
            $('.__ts-browser-stat').hide();
        }

    });


    $(document).on('change.tsWordsPlugin', '#tsWordsPlugin', function (e) {
        if($(this).prop('checked')){
            chrome.runtime.sendMessage(editorExtensionId, {event: "enable"}, function(response) {

                console.log(response.farewell);
            });
        }
        else{
            chrome.runtime.sendMessage(editorExtensionId, {event: "disable"}, function(response) {
                console.log(response.farewell);
            });
        }
    })
});