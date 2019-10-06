import { Tagable } from 'tagable'

const tagable = new Tagable()

export function getTags(source) {
  return tagable.getTagsByResourceID(source)
}

export async function load(){
  const data = require('./tagable.json')
  tagable.import(data)
  return tagable._resources.data
}
