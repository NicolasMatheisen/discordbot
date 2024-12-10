const fs = require('fs');
const path = require('path');

function loadEmbeds(embedsPath) {
	let embeds = [];
	fs.readdir(embedsPath, (err, files) => {
		if (err) throw err;
		embeds = files.map(file => require(path.join(embedsPath, file)));
	});
	return embeds;
}

module.exports = loadEmbeds;
