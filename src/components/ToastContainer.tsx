import React, { ReactNode } from 'react';

type Props = {
  onClick?:()=>void
  children: ReactNode; // This will allow any valid React children to be passed as props
}

const ToastContainer = (props: Props) => {


  return (
    <div onClick={()=>props.onClick} className='ToastContainer'>
      {props.children}
    </div>
  );
}

export default ToastContainer;