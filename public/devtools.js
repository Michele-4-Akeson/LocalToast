// DevTools page -- devtools.js

chrome.devtools.panels.create(
    'Local Toast',
    'icon.png',
    'index.html',
    null
  );








  
/*
// Create a connection to the background.js script
let backgroundScriptConnection = chrome.runtime.connect({
    name: "devtools-page"
});


//Handle responses from the background script, if any
backgroundScriptConnection.onMessage.addListener(function (message) {
    console.log(message)
});

// Relay the tab ID to the background page
backgroundScriptConnection.postMessage({
    tabId: chrome.devtools.inspectedWindow.tabId,
    scriptToInject: "content.js"
});
*/