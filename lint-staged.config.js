// const micromatch = require('micromatch')
module.exports = {
	'*.{json,css,less,scss,sass}': ['prettier --write', 'git add'],
	'*.{jsx,ts,tsx,vue}': ['prettier --write', 'git add'],
	'*!(.min).js': ['prettier --write', 'git add']
};
