'use strict';

const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');
const readFile = function(filePath) {
	return fs.readFileSync(filePath, { encoding: 'utf-8' });
};

let dotenvConfig = {};
const dotenvFiles = ['.env', `.env.local`].map(n => path.resolve(process.cwd(), n));
dotenvFiles.forEach(dotenvFile => {
	if (fs.existsSync(dotenvFile)) {
		const envConfig = dotenv.parse(readFile(dotenvFile));
		dotenvConfig = {
			...dotenvConfig,
			...envConfig
		};
	}
});

Object.keys(dotenvConfig).forEach(key => {
	process.env[key] = dotenvConfig[key];
});

const raw = {
	...dotenvConfig
};
const stringified = {
	'process.env': Object.keys(raw).reduce((env, key) => {
		env[key] = JSON.stringify(raw[key]);
		return env;
	}, {})
};
module.exports = { raw, stringified };
