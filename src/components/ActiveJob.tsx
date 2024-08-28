import React, { useEffect, useState } from 'react'
import { ElementEvent, Job } from '../other/types'
import { sendChromeMessage } from '../other/helpers'
import { v4 as generateUUID } from 'uuid'
import Task from './Task'
type Props = {
    job:Job
    onClose:()=>void
}

const ActiveJob = (props: Props) => {
    //could have a useState which references job elements and when we receive a message
    //about a given item finishing, we can change the style of that respective element
    let taskQueue = props.job.elementEvents

    useEffect(() => {  
        //recieves messages sent to the port from background
        chrome.runtime && chrome.runtime.onMessage.addListener(
            function(message, sender, sendResponse) {
                console.log(message)
                switch (message.action){
                    //string of element data sent from content script
                    case "TASK_COMPLETE":
                        console.log("task complete")
                        setTimeout(()=>{
                            runNextTask()
                        }, 1000)
                        break;
                      
                }
        });
    }, []);


    function runNextTask(){
       
        console.log(props.job.elementEvents.length, props.job.elementEvents, taskQueue)
        if (taskQueue.length != 0){
            const task : ElementEvent = taskQueue.shift()!
            const event = task.event
            if (event?.type == "add text"){
                if (event.input == "random"){
                    task.event!.value = makeid(20)
                } else if (event.input == "random email"){
                    task.event!.value = `${makeid(20)}@gmail.com`
                }
            }
    
    
            sendChromeMessage({action:"RUN_TASK", task:task})
        } else {
            props.onClose()
        }
       

    }

    function makeid(length:number) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }

    



  return (
    <div>
        <h1>{props.job.title}</h1>

        <button onClick={()=>runNextTask()}>Run Job</button>
    
        {props.job.elementEvents.map((task, index)=>{
            return <Task key={index} elementEvent={task}/>
        })}
    </div>
  )
}

export default ActiveJob