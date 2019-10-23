import { Tagable } from 'tagable'

const tagable = new Tagable()
const data = fetch(`resources/data/tagable.json`, {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})
const json = data.then(response => response.json())
const imported = json.then(json => tagable.import(json))

export async function getResourcesByTagID(tagid) {
  return imported.then(() => tagable.getResources(tagid))
}

export async function getTagsByResourceID(resourceid) {
  return imported.then(() => tagable.getTags(resourceid))
}

export async function getResources() {
  return imported.then(() => tagable.resources)
}

export async function getTags(){
  return imported.then(() => tagable.tags)
}
