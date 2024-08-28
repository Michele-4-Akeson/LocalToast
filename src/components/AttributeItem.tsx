import React, { FormEvent, useEffect, useState } from 'react'
import { Attribute } from '../other/types';
import ToastInput from './ToastInput';
import "../styles/ToastElements.css"

type AttributeProps = Attribute & {
    setAttribute:(attribute:Attribute)=>void
}


const AttributeItem = ({id, name, value, setAttribute}:AttributeProps) => {
  const [attributeName, setAttributeName] = useState(name)
  const [attributeValue, setAttributeValue] = useState(value)

  useEffect(()=>{
    //this is so dumb
    setAttributeName(name)
    setAttributeValue(value)
  }, [name, value])


  const hasAttributeChanged = () =>{
    return name != attributeName || 
           value != attributeValue
  }

  const handleNameChange = (name:string) => {

    if (name != attributeName){
      setAttributeName(name)
      setAttribute({id:id, name:name, value:attributeValue})

    }
  };

  const handleValueChange = (value:string) => {

    if (value != attributeValue){
      setAttributeValue(value)
      setAttribute({id:id, name:attributeName, value:value})

    } 
  };

  const handleSubmit = (e:FormEvent) => {
    e.preventDefault();
    if (hasAttributeChanged()){
      setAttribute({id:id, name:attributeName, value:attributeValue})
    }
  };

  return (
    <form className='ToastForm' onSubmit={handleSubmit}>
        <ToastInput value={attributeName} setValue={handleNameChange} placeholder='Attribute:'/>
        <ToastInput value={attributeValue} setValue={handleValueChange} placeholder='Value:'/>
    </form>

  );
};

export default AttributeItem;


