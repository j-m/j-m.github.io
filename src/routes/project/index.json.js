import { Tagable } from 'tagable'
import * as json from '../_tags.json'
const data = new Tagable()
data.import(json)

export function get(req, res) {
	res.writeHead(200, {
		'Content-Type': 'application/json'
	});

	res.end(data.resources);
}
