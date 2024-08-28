import React from 'react'
import "../styles/ToastElements.css"
type Props = {
    isPulsing:boolean
}

const ToastIcon = (props: Props) => {
  return (
    <div className={props.isPulsing ? 'IconContainer Pulse' : 'IconContainer'}>
        <img className='ToastIcon' src='./toast.png'/>
    </div>
  )
}

export default ToastIcon