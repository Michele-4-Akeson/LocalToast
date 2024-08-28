/*
    Note:

    content scripts run with the current web page active in the browser and can therefore
    interact with the content on the page

    background scripts (such as this) is run as a service worker for the chrome extention (console.logs will be seen 
    in the inspector for the extention) and continues to run (it listens for events that occur in the browser even when the popup isn't open):
*/

console.log("Background.js running with extention as part of entire browser..");

let tabId = null;
let connections = {};

chrome.runtime.onConnect.addListener(function(port) {

  let extensionListener = function (message, sender, sendResponse) {

    // The original connection event doesn't include the tab ID of the
    // DevTools page, so we need to send it explicitly, paring the tabID with the respective port
    switch (message.action){
       //perform action to pair tab id with port
      case "pair-local-toast-with-tab":
        console.log(port.name + " connected to " + message.tabId)
        connections[message.tabId] = port;
        break;
      default:
        console.log("BACKGROUND SCRIPT Message recieved ", message)

    }
  }

  // Listen to messages sent from the DevTools page
  port.onMessage.addListener(extensionListener);

  port.onDisconnect.addListener(function(port) {
      port.onMessage.removeListener(extensionListener);

      let tabs = Object.keys(connections);
      for (let i = 0; i < tabs.length; i++) {
        if (connections[tabs[i]] == port) {
          delete connections[tabs[i]]
          break;
        }
      }
    
    });
})



// Receive message from content script and relay to the devTools page for the
// current tab
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log(`BACKGROUND SCRIPT RECIVED: ${message}`)

    // Messages from content scripts
    try {
      // the content script sending is sent from a given tab with an id
      let tabId = sender.tab.id
      // relat message to chrome extention (local toast dev tool)
      if (tabId in Object.keys(connections)){
        connections[tabId].postMessage(message)
      }
    } catch (error){
      console.error(error)
    }

});



/*
onActivated event fired when the active tab is switched; sends message to previous tab
to stop recording, and sets the tabId to the active tab
*/
chrome.tabs.onActivated.addListener(()=>{
  if (tabId){
      chrome.tabs.sendMessage(tabId, "On Activated Message")
  }

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      tabId = tabs[0].id ? tabs[0].id : null
    });
})

chrome.runtime.onInstalled.addListener(async () => {
  for (const cs of chrome.runtime.getManifest().content_scripts) {
    for (const tab of await chrome.tabs.query({url: cs.matches})) {
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: cs.js,
      });
    }
  }
});



/**
 * @param {string} text the type of message being sent to the content.js script
 * in the current tab
 */
function sendChromeMessage(message){
  try {
      console.log("Message sent by background.js")
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          if (tabs[0].id) chrome.tabs.sendMessage(tabs[0].id, message) 
        });

  } catch (error) {
      console.log(error)

  }
}
