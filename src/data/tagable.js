import { Tagable } from 'tagable'
import * as json from './tagable.json'

const tagable = new Tagable()
tagable.import(json)

export function getResourcesByTagID(tagid) {
  return tagable.getResources(tagid)
}

export function getTagsByResourceID(resourceid) {
  return tagable.getTags(resourceid)
}

export function getResources() {
  return tagable.resources
}

export function getTags(){
  return tagable.tags
}
