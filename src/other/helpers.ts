
/**
 * @param message message sent to content.js script running in current tab
 */
export function sendChromeMessage(message:Object){

    try{
            //send message from devTools panel
        const tabId = chrome.devtools.inspectedWindow.tabId
        if (tabId) {
            console.log(`Send Message TO content.js in tab ${tabId} from dev tools:` , message)
            chrome.tabs.sendMessage(tabId, message)
        }
    } catch (error){
        console.log(error)
        try {
            console.log(`Send Message TO content.js in active tab from popup: ${message}`)
            //send message from popup

            chrome.tabs && chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (tabs[0].id) chrome.tabs.sendMessage(tabs[0].id, message)
            })
        } catch (e) {
            console.log(e)
        }


    }
}






/**
 * Converts an HTML string into an HTML element.
 * 
 * @param {string} elementString - A string containing an HTML element.
 * @returns {HTMLElement | null} The HTML element created from the provided string, or null if conversion fails.
 */
export const convertToElement = (elementString:string) : HTMLElement | null => {
    const containerElement = document.createElement('div');
    containerElement.innerHTML = elementString;

    // Return the first child if it's an element node
    const firstChild = containerElement.firstChild;
    if (firstChild && firstChild.nodeType === 1) {
        return firstChild as HTMLElement;
    }

    return null;
}




export function getAttributesAsObject(element: HTMLElement) {
    const attributes = element.attributes;
    const attributeObject: { [key: string]: string } = {};
  
    for (let i = 0; i < attributes.length; i++) {
      const attribute = attributes[i];
      attributeObject[attribute.name] = attribute.value;
    }
  
    return attributeObject;
}


