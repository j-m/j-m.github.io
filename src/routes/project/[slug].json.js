import tagable from "../../data/tags"

export function get(req, res, next) {
	const { slug } = req.params;

	if (tagable.resources[slug]) {
		res.writeHead(200, {
			'Content-Type': 'application/json'
		});

		res.end(JSON.stringify({
      project: tagable.resources[slug],
      tags: tagable.getTags(slug)
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
