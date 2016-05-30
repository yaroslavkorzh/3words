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
        search: ['mom', 'mother', 'mummy', 'mothers'],
        type: 'word',
        language_from: 'en',
        language_to: 'ru',
        spelling: 'ponounciation',
        translation: 'мама',
        transliteration: 'mama',
        examples: ['I learned that my mama came from an amazing family.', 'In her old country, my mama saw a very poor blind woman with her young daughter.', 'My mama cooks the best pie I ever tried.'],
        imageurl: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Discussion.jpg',

    }, {
        id: '1',
        learned: false,
        active: false,
        renderCount: 0,
        renderCap: 3,
        actionCount: 0,
        actionCap: 3,
        word: 'cat',
        search: ['cat', 'kitty', 'cats', 'tomcat', 'pussycat', 'tom-cat'],
        type: 'word',
        language_from: 'en',
        language_to: 'ru',
        spelling: 'ponounciation',
        translation: 'кот',
        transliteration: 'kot',
        examples: ['My neghbours had a very cute red kot.', 'My kot licks the hair dryer every morning for 10 minutes.', 'I recently found out that my kot, Marv, hates it when I read aloud.'],
        imageurl: 'https://pbs.twimg.com/media/CbXW0yaUYAEKdlV.png'
    }, {
        id: '2',
        learned: false,
        active: false,
        renderCount: 0,
        renderCap: 3,
        actionCount: 0,
        actionCap: 3,
        word: 'how',
        search: ['how'],
        type: 'word',
        language_from: 'en',
        language_to: 'ru',
        spelling: 'ponounciation',
        translation: 'как',
        transliteration: 'kahk',
        examples: ['Kak do I get to the train station?'],
        imageurl: 'https://66.media.tumblr.com/576bbfd483bb8b775923108389358c5e/tumblr_mktqckJTqD1rnlpewo1_500.jpg'
    }, {
        id: '3',
        learned: false,
        active: false,
        renderCount: 0,
        renderCap: 3,
        actionCount: 0,
        actionCap: 3,
        word: 'act',
        search: ['act'],
        type: 'word',
        language_from: 'en',
        language_to: 'ru',
        spelling: 'ponounciation',
        translation: 'акт',
        transliteration: 'akt',
        examples: ['An akt is an instrument that records a fact or something that has been said, done, or agreed.', 'Please provide instructions as to the manner and time of the disposition of a document under this Akt.'],
        imageurl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Third_Deck_Officers_Handover_on_board_of_Soviet_cargo_ship_Sarny_on_16_of_November_1987.jpg/800px-Third_Deck_Officers_Handover_on_board_of_Soviet_cargo_ship_Sarny_on_16_of_November_1987.jpg'
    },
    {
        id: '4',
        learned: false,
        active: false,
        renderCount: 0,
        renderCap: 3,
        actionCount: 0,
        actionCap: 3,
        word: 'so',
        search: ['so'],
        type: 'word',
        language_from: 'en',
        language_to: 'ru',
        spelling: 'ponounciation',
        translation: 'так',
        transliteration: 'tahk',
        examples: ['Tak you are from the USA?'],
        imageurl: 'https://yt3.ggpht.com/-UsWDpckUytU/AAAAAAAAAAI/AAAAAAAAAAA/xEj_G-KlTa8/s88-c-k-no-rj-c0xffffff/photo.jpg'
    },
    {
        id: '5',
        learned: false,
        active: false,
        renderCount: 0,
        renderCap: 3,
        actionCount: 0,
        actionCap: 3,
        word: 'who',
        search: ['who'],
        type: 'word',
        language_from: 'en',
        language_to: 'ru',
        spelling: 'ponounciation',
        translation: 'кто',
        transliteration: 'ktoh',
        examples: ['Ktoh wants to become a millionaire.', 'Kto made the birthday cake?', 'Are you going to tell me kto he is?'],
        imageurl: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTSSlZnrYVpe3Nh49c2C5_CT7pZyJhp5MrnyeZnCUgFWTV-eoMy'
    },
    {
        id: '6',
        learned: false,
        active: false,
        renderCount: 0,
        renderCap: 3,
        actionCount: 0,
        actionCap: 3,
        word: 'theme',
        search: ['theme', 'topic'],
        type: 'word',
        language_from: 'en',
        language_to: 'ru',
        spelling: 'temah',
        translation: 'тема',
        transliteration: 'tema',
        examples: ['John sensed his anger on the tema and said nothing.', 'It wasn\'t a tema anyone wanted to speak — after all, this was supposed to be a cheery farewell dinner.'],
        imageurl: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQxxbheIWXglZffC1czmjO_LLsGD568HoxARuDwV2Me0yfWIg5F'
    },
    {
        id: '7',
        learned: false,
        active: false,
        renderCount: 0,
        renderCap: 3,
        actionCount: 0,
        actionCap: 3,
        word: 'tomato',
        search: ['tomato'],
        type: 'word',
        language_from: 'en',
        language_to: 'ru',
        spelling: 'tohmaht',
        translation: 'томат',
        transliteration: 'tomat',
        examples: ['The tomat is native to western South America and Central America.', 'Today, the tomat is a critical and ubiquitous part of Middle Eastern cuisine.'],
        imageurl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Bright_red_tomato_and_cross_section02.jpg/220px-Bright_red_tomato_and_cross_section02.jpg'
    },
    {
        id: '8',
        learned: false,
        active: false,
        renderCount: 0,
        renderCap: 3,
        actionCount: 0,
        actionCap: 3,
        word: 'model',
        search: ['maquette', 'model', 'layout'],
        type: 'word',
        language_from: 'en',
        language_to: 'ru',
        spelling: 'mahket',
        translation: 'макет',
        transliteration: 'maket',
        examples: ['Maket may be used to show the client how the finished work will fit in the proposed site.', 'I want to change the maket of my house'],
        imageurl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Scale_Model_Of_The_Tower_Of_London_In_The_Tower_Of_London.jpg/300px-Scale_Model_Of_The_Tower_Of_London_In_The_Tower_Of_London.jpg'
    },
    {
        id: '9',
        learned: false,
        active: false,
        renderCount: 0,
        renderCap: 3,
        actionCount: 0,
        actionCap: 3,
        word: 'cacao',
        search: ['cacao', 'cocoa'],
        type: 'word',
        language_from: 'en',
        language_to: 'ru',
        spelling: 'kahkahoh',
        translation: 'какао',
        transliteration: 'kakao',
        examples: ['Every country, from England to Austria, was producing confections from the fruit of the kakao tree.', 'The kakao tree is native to the Americas.'],
        imageurl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Cocoa_Pods.JPG/300px-Cocoa_Pods.JPG'
    }
];
var data = JSON.parse(JSON.stringify(dataDefaults));
var pluginState = true;
var wordsLimit = 999;
var wordsCounter = 0;
var editorExtensionId = chrome.runtime.id;
var statsData = [];
var badgeText = pluginState ? 'on' : 'off';
var badgeColor = pluginState ? '#FB5151' : '#AFAFAF';
chrome.browserAction.setBadgeText({text: badgeText});

var iconPath = pluginState ? 'Dist/imgs/icons/icon16.png' : 'Dist/imgs/icons/icon16_inactive.png';
chrome.browserAction.setIcon({path: iconPath});

chrome.tabs.onActivated.addListener(function (tab) {
    console.log('enable onactivated')
    returnMessage('enable')
});


chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {

        console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
            "from the extension", request);
        if (request.event == "browser_disable") {
            data = JSON.parse(JSON.stringify(dataDefaults));
            pluginState = false;
            statsData = [];
            wordsCounter = 0;
            updateBrowserAction();
            broadCastMessage("disable");
            sendResponse({message: "browser_disable plugin"});
        }
        if (request.event == "browser_enable") {
            broadCastMessage("enable");
            wordsCounter = 0;
            pluginState = true;
            updateBrowserAction();
            returnMessage('getData', data);
            sendResponse({message: "browser_enable plugin"});
        }

        if (request.event == "getData") {
            //returnMessage('getData', data);
            sendResponse({data: data});
            //alert('get data from background script');
        }

        if (request.event == "pluginState") {
            //getData();
            sendResponse({data: pluginState});
            //alert('get data from background script');
        }
        if (request.event == "updateStats") {
            sendResponse({data: statsData, limit: wordsLimit, counter: wordsCounter});
        }

        if (request.event == "updateWord") {
            updateWordData(request.word);
            var newData = getWordById(request.word.id);
            sendResponse({result: 'success', word: newData});
            broadCastMessage("updateWord", {result: 'success', word: newData});

        }

    });

function returnMessage(messageToReturn, data) {
    var data = !data ? {} : data;
    chrome.tabs.getSelected(null, function (tab) {

        chrome.tabs.sendMessage(tab.id, {event: messageToReturn, data: data}, function (response) {
            if (response) {
                console.log(response.message);
            }
        });
    });
}

function broadCastMessage(messageToReturn, data) {
    var data = !data ? {} : data;

    chrome.tabs.getSelected(null, function (activeTab) {

        chrome.tabs.query({}, function (tabs) {
            for (var i = 0; i < tabs.length; ++i) {
                var tab = tabs[i];
                if (tab.id != activeTab.id) {
                    chrome.tabs.sendMessage(tab.id, {
                        event: messageToReturn,
                        data: data,
                        activeTab: false
                    }, function (response) {
                        if (response) {
                            console.log(response.message);
                        }
                    });
                }
                else {
                    console.log('not sending response to itself');
                    chrome.tabs.sendMessage(tab.id, {
                        event: messageToReturn,
                        data: data,
                        activeTab: true
                    }, function (response) {
                        if (response) {
                            console.log(response.message);
                        }
                    });
                }

            }
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
    for (var k = 0; k < data.length; k++) {
        if (data[k].learned) {
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
            id: wordData.id,
            learned: wordData.learned == true ? 'learned' : 'learning'
        });
    }
    else {
        for (var i = 0; i < statsData.length; i++) {
            if (statsData[i].id == wordData.id) {
                statsData[i].counter = wordData.renderCount >= 3 ? 3 : wordData.renderCount;
                statsData[i].actionCount = wordData.actionCount >= 3 ? 3 : wordData.actionCount;
                statsData[i].learned = wordData.learned == true ? 'learned' : 'learning';
            }
        }
    }

    console.log('update browser stats', statsData)
    chrome.runtime.sendMessage(editorExtensionId, {event: "updateStats", data: statsData}, function (response) {
        updateBrowserAction()
    });

    if (wordsCounter >= wordsLimit) {
        console.log('pause plugin');
        broadCastMessage('pause');
        pluginState = false;

        //chrome.tabs.getSelected(null, function (tab) {
        //    chrome.tabs.sendMessage(tab.id, {event: 'pause'}, function (response) {
        //        console.log(response);
        //    });
        //});
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

function updateBrowserAction() {
    badgeText = pluginState ? 'on' : 'off';
    iconPath = pluginState ? 'Dist/imgs/icons/icon16.png' : 'Dist/imgs/icons/icon16_inactive.png';
    badgeColor = pluginState ? '#FB5151' : '#AFAFAF';

    if (statsData.length > 0 && pluginState) {
        badgeText = statsData.length.toString();
    }
    if (wordsCounter >= wordsLimit && !pluginState) {
        badgeText = '| |';
    }

    console.log(badgeText, badgeColor);
    chrome.browserAction.setBadgeText({text: badgeText});

    chrome.browserAction.setIcon({path: iconPath});

    chrome.browserAction.setBadgeBackgroundColor({color: badgeColor});
};
