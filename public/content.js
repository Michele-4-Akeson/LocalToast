/*
    Note: 

    content scripts run with the current web page active in the browser and can therefore
    interact with the content (html) on the page

 */

console.log("content.js running on page..")
const LOCATION = "CONTENT SCRIPT"
const EXTENTION_NAME = "LOCAL TOAST EXTENTION"



/**
 * recieves a message from the chrome extention via the chrome API and executes 
 * a specific action in the current web page
 */
chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        console.log(`${LOCATION} ${EXTENTION_NAME} recieved:` , message)

        switch(message.action){
            case "url":
                chrome.runtime.sendMessage({action:"url", url:window.location.href})
            case "add-click":
                addToastEventListeners()
                break;
            case "remove-click":
                removeToastEventListeners()
                break;
            case "search_for_element":
                const element = searchForElement(message.tag, message.attributes)
                chrome.runtime.sendMessage({action:"SEND_SEARCHED_ELEMENT", element: element.outerHTML})
                break;
            case "RUN_TASK":
                runTask(message.task.elementTag, message.task.attributes, message.task.event)
                break

        }
});



function getAttributesAsObject(element) {
    const attributes = element.attributes;
    const attributeObject  = {};
  
    for (let i = 0; i < attributes.length; i++) {
      const attribute = attributes[i];
      attributeObject[attribute.name] = attribute.value;
    }
  
    return attributeObject;
}





/**
 * searches for an html element will all attributes contained in attributes
 * @param {*} tag an html tag (button, div, a, input)
 * @param {*} attributes the attributes the element must have to be considered found
 */
function searchForElement(tag, attributes) {
    let foundElement = null
    const allElements = document.querySelectorAll(tag);
    for (let element of allElements){
        const elementAttributes = getAttributesAsObject(element)
        
        // if every attribute in the attributes list is an attribute of the viewed element
        let i = 0
        let length = attributes.length
        while (i < length){
            let attribute = attributes[i]
            if (attribute.value == ""){
                i++
            } else if (elementAttributes[attribute.name] == attribute.value){
                i++
                if (i == length) {
                    return element
                }
            } else {
                break
            }
        }
    }        

}






/**
 * sends the data of the element clicked to the devTools chrome extention
 * @param event a click event recieved by the element  
 */
function elementClickHandler(event){
    //stops all default behaviour of the element being clicked
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const element = event.target;

    //send element data as string (other approaches don't seem to work to send data)
    chrome.runtime.sendMessage({action:"SEND_CLICKED_ELEMENT", element: element.outerHTML})
}



function handleHoverIn(event) {
    event.target.style.backgroundColor = 'green'; // Change the style on hover
}
  



function handleHoverOut(event) {
    event.target.style.backgroundColor = ''; // Revert the style on hover out
}


/**
 * adds click, mouseover, and mouseout event listener to every element
 */
function addToastEventListeners() {
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
      element.addEventListener('click', elementClickHandler);
      element.addEventListener('mouseover', handleHoverIn);
      element.addEventListener('mouseout', handleHoverOut);
    });

}



function removeToastEventListeners(){
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
      element.removeEventListener('click', elementClickHandler);
      element.removeEventListener('mouseover', handleHoverIn);
      element.removeEventListener('mouseout', handleHoverOut);
    });
}
  







function runTask(tag, attributes, event){
    const element = searchForElement(tag, attributes)

    if (element){
        switch (event.type){
            case "click":
                element.click()
                break;
            case "add text":
                typeIntoInput(element, event.value)
                break;
        }

        setTimeout(()=>{
            chrome.runtime.sendMessage({action:"TASK_COMPLETE"})
            playDefaultSound()
        }, 2500)
    } else {
        console.log("no element foudnxs")
        setTimeout(()=>{
            //send a chrome message with not found message
            runTask(tag, attributes, event)
        }, 5000)
    }
    
}

  
  

function playDefaultSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    oscillator.connect(audioContext.destination);
  
    // Start and stop the oscillator to play the sound
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1); // Stop after 0.1 seconds (adjust as needed)
  }
  


  function typeIntoInput(inputElement, text) {
    inputElement.focus(); // Ensure the input field has focus
  
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const event = new Event('input', { bubbles: true });
  
      inputElement.value += char;
      inputElement.dispatchEvent(event);
    }
  }