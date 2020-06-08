import { Tagable } from 'tagable'
import * as json from './tagable.json'
const tagable = new Tagable()
tagable.import(json)

export default tagable;
