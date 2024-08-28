import React, { useEffect, useState } from 'react'
import { convertToElement, getAttributesAsObject, sendChromeMessage } from '../other/helpers';
import AttributeItem from './AttributeItem';
import {v4 as generateUUID} from "uuid";
import { Attribute, Job } from '../other/types';
import { ElementEvent } from '../other/types';
import { Event } from '../other/types';
import ToastInput from './ToastInput';
import ToastContainer from './ToastContainer';
import IconButton from './IconButton';
import { faClipboard, faComputerMouse, faMagnifyingGlass, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import Task from './Task';


type AddNewJobProps = {
    addJob: (job:Job) => void,
    toggleToast: (on:boolean)=>void,
    onClose:()=>void
}



const NewJob = (props: AddNewJobProps) => {
    // job
    const [id, setId] = useState(generateUUID())
    const [title, setTitle] = useState("")
    const [url, setURL] = useState("")
    // list of elementEvents
    const [elementEventList, setElementEventList] = useState<ElementEvent[]>([])
    // elementEvent
    const [tag, setTag] = useState("");
    const [attributeList, setAttributeList] = useState<Attribute[]>([{id:generateUUID(), name:"data-test-id", value:""}])

    // event
    const [eventType, setEventType] = useState("click")
    const [inputType, setInputType] = useState("random")
    const [inputValue, setInputValue] = useState("")



    const [elementString, setElementString] = useState("")
    const [isClickListenerActive, setIsClickListenerActive] = useState(false)

    function addJob(){
        const newJob : Job = {id, url:url, title, elementEvents:elementEventList} 
        props.addJob(newJob)
        props.onClose()
        if (isClickListenerActive) toggleClickListener()
    }


    /**
     * retrieves all data currently in the form for the element you have, and adds it to local storage
     * under this job, then clears the form
     */
    function addNewElementEvent(){
        const newEvent : Event = {id:generateUUID(), type:eventType, input:inputType, value:inputValue}
        const newElementEvent : ElementEvent = {id:generateUUID(), elementTag:tag, attributes:attributeList, event:newEvent} 
        setElementEventList([...elementEventList, newElementEvent])
        setTag("")
        setAttributeList([{id:generateUUID(), name:"data-test-id", value:""}])
        setElementString("")
        setEventType("click")
        setInputType("random")
        setInputValue("")
    }




    const updateAttribute = (updatedAttribute:Attribute) => {
        setAttributeList(prevList => {
            const updatedList = prevList.map(attribute => {
                if (updatedAttribute.id == attribute.id) {
                    return updatedAttribute;
                }
                return attribute;
            });

            return updatedList;
            });
        
    }



    const addAttribute = () => {
        const newAttribute:Attribute = {id: generateUUID(), name:"", value:""}
        setAttributeList([...attributeList, newAttribute])
    }

    /**
     * updates the attributes list with any object in the array with the cooresponding 
     * value in the attributes object
     * @param attributes an object contain attribute name : value pairs
     */
    const updateAttributesByName = (attributes: {[key:string]:string}) => {
        setAttributeList(prevList => {
            console.log(prevList, attributes)
            const updatedList = prevList.map(attribute => {
                if (attribute.name in attributes) {
                return { ...attribute, value: attributes[attribute.name] };
                }
                return attribute;
            });

            console.log(updatedList)
            return updatedList;
            });
    };



    const toggleClickListener = () => {
        if (isClickListenerActive){
            sendChromeMessage({action:"remove-click"})
            props.toggleToast(false)
        } else {
            sendChromeMessage({action:"add-click"})
            props.toggleToast(true)

        }

        setIsClickListenerActive(!isClickListenerActive)
    }


    function searchForElement() {
        console.log(tag, attributeList.length, attributeList)
        if (tag && attributeList.length > 0) {
            sendChromeMessage({action:"search_for_element", tag:tag, attributes:attributeList})
        }
    }
    



    useEffect(() => {  
      sendChromeMessage({action:"url"})

        //recieves messages sent to the port from background
        chrome.runtime && chrome.runtime.onMessage.addListener(
            function(message, sender, sendResponse) {
                console.log(message)
                let element
                let attributes
                switch (message.action){
                    //string of element data sent from content script
                    case "SEND_CLICKED_ELEMENT":
                        //TO DO: Populate empty attributes with values
                        element = convertToElement(message.element)
                        attributes = getAttributesAsObject(element!)
                        updateAttributesByName(attributes)
                        setElementString(message.element) 
                        setTag(element!.tagName.toLowerCase())
                        break;
                    case "SEND_SEARCHED_ELEMENT":
                        //TO DO: Provides some indication if an element was found with the desired attributes
                        element = convertToElement(message.element)
                        attributes = getAttributesAsObject(element!)
                        updateAttributesByName(attributes)
                        setElementString(message.element) 
                        setTag(element!.tagName.toLowerCase())
                    break;
                    case "url":
                      setURL(message.url)
                      break;
                }
        });
    }, []);





  return (
    <div>
      <h1>New Job</h1>
      <ToastInput value={title} setValue={setTitle} label='Title:'/>

      <h3>Element</h3>

      {elementString && 
      <ToastContainer>
        <div dangerouslySetInnerHTML={{ __html: elementString }} />
      </ToastContainer>
      }
      <ToastContainer>
        <div className='Row'>
          <IconButton icon={faComputerMouse} onClick={()=>toggleClickListener()} label='Click Element'/>
          <IconButton icon={faMagnifyingGlass} onClick={()=>searchForElement()} label='Search Element'/>

        </div>
        <ToastInput value={tag} setValue={setTag} placeholder='button, div,  a , input' label='Element Tag:'/>


        <label>HTML Attributes</label>
        {attributeList.map((attribute, index)=>{
            return <AttributeItem key={index} id={attribute.id} name={attribute.name} value={attribute.value} setAttribute={updateAttribute}/>
        })}

        <button onClick={()=>addAttribute()}>Add Attribute</button>

      </ToastContainer>

      {true &&
        <div>
          <h3>Task</h3>
            <ToastContainer>
              <div className='Row'>
                <div className='Row'>
                  <label>Click Element</label>
                <input 
                type="radio"
                value="click"
                checked={eventType === "click"}
                onChange={() => setEventType("click")}
                /> 
                </div>
          <div className='Row'>
            <label>Add Text</label>
          <input 
                type="radio"
                value="add text"
                checked={eventType === "add text"}
                onChange={() => setEventType("add text")}
                /> 
          </div>
              
              </div>
              {eventType === "add text" && (
                <div>
                  <h4>How to Add Text</h4>
                <div className='Row'>
                  <div>
                  <label>Random</label>
                    <input 
                      type="radio"
                      value="random"
                      checked={inputType === "random"}
                      onChange={() => setInputType("random")}
                    /> 
                  </div>

                  <div>
                  <label>Random Email</label>
                    <input 
                      type="radio"
                      value="random email"
                      checked={inputType === "random email"}
                      onChange={() => setInputType("random email")}
                    /> 
                  </div>

                  <div>
                  <label>Custom</label>
                    <input 
                      type="radio"
                      value="custom"
                      checked={inputType === "custom"}
                      onChange={() => setInputType("custom")}
                    /> 
                  </div>
                    
                </div>
                <div className='Center'>
                {inputType === "custom" && (
                      <ToastInput value={inputValue} setValue={setInputValue} />
                    )}
                </div>

                </div>
            )}
            <IconButton icon={faPlusCircle} onClick={()=>addNewElementEvent()} label='Add Task'/>

            </ToastContainer>
        </div>
      }

      {elementEventList.map((task, index)=>{
        return <Task key={index} elementEvent={task}/>
      })}

      <br/>
      <div className='Row'>
        <IconButton icon={faClipboard} onClick={()=>addJob()} label='Save Job'/>
      </div>
    
    </div>
    
  )
}

export default NewJob