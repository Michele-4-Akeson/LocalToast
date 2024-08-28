import React, { useState } from 'react'
import { ElementEvent } from '../other/types'
import ToastContainer from './ToastContainer'

type Props = {
    elementEvent:ElementEvent
}

const Task = (props: Props) => {
    const [isOpened, setIsOpened] = useState(false)

  return (
    <ToastContainer  onClick={()=>setIsOpened(!isOpened)}>
        <div className='Row'>
            <h3>{"<"}{props.elementEvent.elementTag}{"/>"}</h3>
            <p>{props.elementEvent.event?.type}</p>
        </div>

        {isOpened && props.elementEvent.attributes.map((a, index)=>{
            return (
                <div key={index} className='Row'>
                    <label>{a.name}</label> <label>{a.value}</label>
                </div>
            )
        })}
    </ToastContainer>
  )
}

export default Task