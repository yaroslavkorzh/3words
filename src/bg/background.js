// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

 //var settings = new Store("settings", {
 //    "sample_setting": "This is how you use Store.js to remember values"
 //});

var data = [
    {
        id: '1',
        word: 'language',
        language_from: 'en',
        language_to: 'ru',
        translation: 'язык',
        transliteration: 'yazik',
        example: 'Выучить новый язык легко',
        imageurl: 'http://www.arrowpointe.com/wp-content/uploads/2015/10/languages_for-geopointe.jpg'//'language.jpg'
    },{
        id: '2',
        word: 'help',
        language_from: 'en',
        language_to: 'ru',
        translation: 'помощь',
        transliteration: 'pomosh',
        example: 'Егор предложил свою помощь другу',
        imageurl: 'https://quitsmokingcommunity.org/wp-content/uploads/2015/01/help-someone-quit-smoking.png'
    },{
        id: '3',
        word: 'new',
        language_from: 'en',
        language_to: 'ru',
        translation: 'новый',
        transliteration: 'novuj',
        example: 'Антон купил новый автомобиль',
        imageurl: 'http://wanjuhrahlaw.com.my/wp-content/uploads/2016/03/new2.png'
    }
];

//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
      console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
          "from the extension");
      if (request.greeting == "hello"){
          sendResponse({farewell: "goodbye"});
      }
      if (request.event == "disable"){
          returnMessage("disable");
          //sendResponse({farewell: "disable plugin"});
      }
      if (request.event == "enable"){
          returnMessage("enable");
          getData();
          sendResponse({farewell: "enable plugin"});
      }

      if (request.event == "getData"){
          //getData();
          sendResponse({data: data});

      }

  });


var backgroundScriptMessage = " purple monkey dishwasher";
function returnMessage(messageToReturn)
{
    chrome.tabs.getSelected(null, function(tab) {
        var joinedMessage = messageToReturn + backgroundScriptMessage;
        //alert("Background script is sending a message to "+tab.id+": '" + joinedMessage +"'");
        chrome.tabs.sendMessage(tab.id, {event: messageToReturn}, function(response) {
            console.log(response.farewell);
        });
    });
}

function getData()
{
    chrome.tabs.getSelected(null, function(tab) {
        var data = [
            {
                id: '1',
                word: 'language',
                language_from: 'en',
                language_to: 'ru',
                translation: 'язык',
                transliteration: 'yazik',
                meaning: 'Language is the ability to acquire and use complex systems of communication, particularly the human ability to do so, and a language is any specific example of such a system.',
                example: 'Выучить новый язык легко',
                imageurl: 'http://www.arrowpointe.com/wp-content/uploads/2015/10/languages_for-geopointe.jpg'//'language.jpg'
            },{
                id: '2',
                word: 'help',
                language_from: 'en',
                language_to: 'ru',
                translation: 'помощь',
                meaning: 'Help is any form of assisting others.',
                transliteration: 'pomosh',
                example: 'Егор предложил свою помощь другу',
                imageurl: 'https://quitsmokingcommunity.org/wp-content/uploads/2015/01/help-someone-quit-smoking.png'// 'help.gif'
            },{
                id: '3',
                word: 'new',
                language_from: 'en',
                language_to: 'ru',
                translation: 'новый',
                transliteration: 'novuj',
                meaning: 'New is an adjective referring to something recently made, discovered, or created.',
                example: 'Антон купил новый автомобиль',
                imageurl: 'http://wanjuhrahlaw.com.my/wp-content/uploads/2016/03/new2.png' //'new.jpg'
            }
        ];
        chrome.tabs.sendMessage(tab.id, {event: 'getData', response: data}, function(response) {
            console.log(response.farewell);
        });
    });
}


chrome.tabs.sendMessage(tab.id, {event: 'getData', response: data}, function(response) {
    console.log(response.farewell);
});