

$(document).ready(function () {
    $("[name='my-checkbox']").bootstrapSwitch({ onColor: 'success', offColor: 'info'});

    $('input[name="my-checkbox"]').on('switchChange.bootstrapSwitch', function(event, state) {
        console.log(this); // DOM element
        console.log(event); // jQuery event
        console.log(state); // true | false
        var editorExtensionId = "dkmlfgjcobbahijmdcomeejldoifncpj";
        // Make a simple request:
        if(!state){
            chrome.runtime.sendMessage(editorExtensionId, {event: "disable"}, function(response) {
                console.log(response.farewell);
            });
        }
        else if(state) {
            chrome.runtime.sendMessage(editorExtensionId, {event: "enable"}, function(response) {
                console.log(response.farewell);
            });
        }
    });

    $('.dropdown').dropdown({
        onChange: function(value, text, $selectedItem) {
            // custom action
            console.log(value, text, $selectedItem)
        }
    });
});