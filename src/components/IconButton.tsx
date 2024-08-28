import { IconDefinition, faTable } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'

type Props = {
    icon:IconDefinition,
    label:string,
    onClick:()=>void
}

const IconButton = ({ icon, label, onClick }: Props) => {
    return (
        <button onClick={onClick}>
            <FontAwesomeIcon icon={icon}/>
            {label}
        </button>
      );
}

export default IconButton