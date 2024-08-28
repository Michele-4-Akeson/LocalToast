import React from 'react'
import "../styles/ToastElements.css"

type Props = {
    label?:string,
    value:string,
    setValue:(value:string)=>void
    placeholder?:string
}

const ToastInput = (props: Props) => {
  return (
    <div className='ToastInput'>
        <label>{props.label}</label>
    <input
      type="text"
      value={props.value}
      placeholder={props.placeholder}
      onChange={(e) => props.setValue(e.target.value)}
    />
    </div>
  
  )
}

export default ToastInput