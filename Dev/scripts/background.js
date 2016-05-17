var dataDefaults = [
    {
        id: '0',
        learned: false,
        active: false,
        renderCount: 0,
        renderCap: 3,
        actionCount: 0,
        actionCap: 3,
        word: 'mom',
        type: 'word',
        language_from: 'en',
        language_to: 'ru',
        translation: 'мама',
        transliteration: 'mama',
        example: 'My mama cooks the best pie I ever tried.',
        imageurl: 'http://youmoms.org/wp-content/uploads/2015/12/mothers-happiness.jpg',//'language.jpg'

    }, {
        id: '1',
        learned: false,
        active: false,
        renderCount: 0,
        renderCap: 3,
        actionCount: 0,
        actionCap: 3,
        word: 'cat',
        type: 'word',
        language_from: 'en',
        language_to: 'ru',
        translation: 'кот',
        transliteration: 'kot',
        example: 'My neghbours had a very cute red kot.',
        imageurl: 'http://animaliaz-life.com/data_images/cat/cat8.jpg'
    }, {
        id: '2',
        learned: false,
        active: false,
        renderCount: 0,
        renderCap: 3,
        actionCount: 0,
        actionCap: 3,
        word: 'how',
        type: 'word',
        language_from: 'en',
        language_to: 'ru',
        translation: 'как',
        transliteration: 'kahk',
        example: 'Kak do I get to the train station?',
        imageurl: 'http://www.howdesign.com/wp-content/uploads/header-logo.png'
    }, {
        id: '3',
        learned: false,
        active: false,
        renderCount: 0,
        renderCap: 3,
        actionCount: 0,
        actionCap: 3,
        word: 'so',
        type: 'word',
        language_from: 'en',
        language_to: 'ru',
        translation: 'так',
        transliteration: 'tahk',
        example: 'Tak you are from the USA?',
        imageurl: 'https://yt3.ggpht.com/-UsWDpckUytU/AAAAAAAAAAI/AAAAAAAAAAA/xEj_G-KlTa8/s88-c-k-no-rj-c0xffffff/photo.jpg'
    }, {
        id: '4',
        learned: false,
        active: false,
        renderCount: 0,
        renderCap: 3,
        actionCount: 0,
        actionCap: 3,
        word: 'who',
        type: 'word',
        language_from: 'en',
        language_to: 'ru',
        translation: 'кто',
        transliteration: 'ktoh',
        example: 'Ktoh wants to become a millionaire.',
        imageurl: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSgYNEmNh6UUZdpAlje5S4BboAC-cwjoAzKsHUcH9M1l_bxHFNb'
    }, {
        id: '5',
        learned: false,
        active: false,
        renderCount: 0,
        renderCap: 3,
        actionCount: 0,
        actionCap: 3,
        word: 'there',
        type: 'word',
        language_from: 'en',
        language_to: 'ru',
        translation: 'там',
        transliteration: 'tahm',
        example: 'I\'ll be tahm in half an hour.',
        imageurl: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcS_gMm4cnuzS_llC1qUVP1S55AXYKUsNQjycWRCGTauM6LmTscd'
    }, {
        id: '6',
        learned: false,
        active: false,
        renderCount: 0,
        renderCap: 3,
        actionCount: 0,
        actionCap: 3,
        word: 'house',
        type: 'word',
        language_from: 'en',
        language_to: 'ru',
        translation: 'дом',
        transliteration: 'dom',
        example: 'Here\'s my dohm.',
        imageurl: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSeTaZydnQeebe9W9gXyG73bYYRl-WLYWAzFoWvuyTKUnR7A_NXLg'
    }, {
        id: '7',
        learned: false,
        active: false,
        renderCount: 0,
        renderCap: 3,
        actionCount: 0,
        actionCap: 3,
        word: 'then',
        type: 'word',
        language_from: 'en',
        language_to: 'ru',
        translation: 'потом',
        transliteration: 'puhtohm',
        example: 'Go straight, puhtohm turn to the right.',
        imageurl: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQCo1HOjg5cdOPq5Adr0LLziWZAvV0CAOHNgC9WXm-MarM2l3nH'
    }, {
        id: '8',
        learned: false,
        active: false,
        renderCount: 0,
        renderCap: 3,
        actionCount: 0,
        actionCap: 3,
        word: 'place',
        type: 'word',
        language_from: 'en',
        language_to: 'ru',
        translation: 'место',
        transliteration: 'myehstah',
        example: 'Our team won the first myehstah.',
        imageurl: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSIXYEePSh2zO3c8Mi7p0YlHgtOtPPHbA6jC5LcpmrO02wHklxGsA'
    }, {
        id: '9',
        learned: false,
        active: false,
        renderCount: 0,
        renderCap: 3,
        actionCount: 0,
        actionCap: 3,
        word: 'it',
        type: 'word',
        language_from: 'en',
        language_to: 'ru',
        translation: 'оно',
        transliteration: 'ahnoh',
        example: 'Yes, time doesn\'t run, ahnoh flies really!',
        imageurl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfj4QNLo63QEmQdtuOeQTi3S-HFNo9TEc7GPrlI4zu6qMNffavkA'
    }
];
var data = JSON.parse(JSON.stringify(dataDefaults));
var pluginState = true;
var wordsLimit = 3;
var wordsCounter = 0;
var editorExtensionId = chrome.runtime.id;
var statsData = [];


chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.event == "disable") {
            data = JSON.parse(JSON.stringify(dataDefaults));
            pluginState = false;
            statsData = [];
            wordsCounter = 0;
            returnMessage("disable");
            sendResponse({farewell: "disable plugin"});
        }
        if (request.event == "enable") {
            returnMessage("enable");

            wordsCounter = 0;
            pluginState = true;
            getData();
            sendResponse({farewell: "enable plugin"});
        }

        if (request.event == "getData") {
            //getData();

            sendResponse({data: data});
            //alert('get data from background script');

        }

        if (request.event == "pluginState") {
            //getData();
            sendResponse({data: pluginState});
            //alert('get data from background script');

        }
        if (request.event == "updateStats") {
            sendResponse({data: statsData});
        }

        if (request.event == "updateWord") {
            updateWordData(request.word);
            var newData = getWordById(request.word.id)
            sendResponse({result: 'success', word: newData});
            //alert('get data from background script');

        }

    });

function returnMessage(messageToReturn) {
    chrome.tabs.getSelected(null, function (tab) {

        chrome.tabs.sendMessage(tab.id, {event: messageToReturn}, function (response) {
            console.log(response.farewell);
        });
    });
}

function getData() {
    chrome.tabs.getSelected(null, function (tab) {
        chrome.tabs.sendMessage(tab.id, {event: 'getData', response: data}, function (response) {
            console.log(response.farewell);
        });
    });
}

function updateWordData(wordData) {
    var index = getWordIndex(wordData.id);
    data[index] = wordData;
    // if(wordData.actionCount >= wordData.actionCap){
    //     wordData.learned = true;
    // }
    wordsCounter = 0;
    for(var k =0; k< data.length; k++){
        if(data[k].learned){
            ++wordsCounter;

        }
    }
    var result = $.grep(statsData, function (e) {
        return e.id == wordData.id;
    });
    if (result.length == 0) {
        statsData.push({
            word: wordData.word,
            counter: wordData.renderCount,
            actionCount: wordData.actionCount,
            id: wordData.id
        });
    }
    else {
        for (var i = 0; i < statsData.length; i++) {
            if (statsData[i].id == wordData.id) {
                statsData[i].counter = wordData.renderCount >= 3 ? 3 : wordData.renderCount;
                statsData[i].actionCount = wordData.actionCount >= 3 ? 3 : wordData.actionCount;
            }
        }
    }

    chrome.runtime.sendMessage(editorExtensionId, {event: "updateStats", data: statsData}, function (response) {
        chrome.browserAction.setBadgeText({text: statsData.length.toString()});
    });

    if (wordsCounter >= wordsLimit) {
        //todo open popup browser
        chrome.tabs.getSelected(null, function (tab) {
            chrome.tabs.sendMessage(tab.id, {event: 'pause'}, function (response) {
                console.log(response);
            });
        });
    }
}

function getWordById(id) {
    var result = null;
    for (var i = 0; i < data.length; i++) {
        var word = data[i];
        if (word.id == id) {
            result = word;
        }
    }
    return result;
};
function getWordIndex(id) {
    var result = null;
    for (var i = 0; i < data.length; i++) {
        var word = data[i];
        if (word.id == id) {
            result = i;
        }
    }
    return result;
};


chrome.tabs.sendMessage(tab.id, {event: 'getData', response: data}, function (response) {
    console.log(response.farewell);
});