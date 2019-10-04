import { Tagable } from 'tagable'

const tagable = new Tagable()

export function getTags(source) {
  return tagable.getTagsByResourceID(source)
}

export async function load(){
  const data = await fetch(`./tagable.json`, {
    headers : { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
     }
  }).then(response => response.json());
  tagable.import(data)
  return tagable._resources.data
}
