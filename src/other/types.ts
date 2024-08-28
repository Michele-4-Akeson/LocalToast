// ENUMS




// DATA TYPES

export type Attribute = {
    id: string,
    name:string,
    value:string
  }


export type Event = {
    id:string,
    type: string, 
    input: string,
    value?:string
}


export type ElementEvent = {
    id:string,
    elementTag:string,
    attributes: Attribute[]
    event?: Event
}


export  type Job = {
  url?:string,
    id:string,
    title:string,
    elementEvents: ElementEvent[]
  }

  
