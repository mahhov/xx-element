const fs = require('fs');
const path = require('path');

module.exports = fileName => ({
	template: fs.readFileSync(fileName.replace(/\.js$/, '.html'), 'utf8'),
	name: 'x-' + path.parse(fileName).name.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`),
});
