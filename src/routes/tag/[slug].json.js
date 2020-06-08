import tagable from "../../data/tags"

export function get(req, res, next) {
	const { slug } = req.params;

	if (tagable.tags[slug]) {
		res.writeHead(200, {
			'Content-Type': 'application/json'
		});

		res.end(JSON.stringify({
      tag: tagable.tags[slug],
      projects: tagable.getResources(slug)
    }));
	} else {
		res.writeHead(404, {
			'Content-Type': 'application/json'
		});

		res.end(JSON.stringify({
			message: `Not found`
		}));
	}
}
