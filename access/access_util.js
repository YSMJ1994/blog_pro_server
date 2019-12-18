const fs = require('fs-extra');
const path = require('path');
const moment = require('moment');
const access_log_path = path.resolve(__dirname, 'access_log.json');

function readLog() {
	if (!fs.pathExistsSync(access_log_path)) {
		fs.ensureFileSync(access_log_path);
		fs.writeJSONSync(access_log_path, {
			access_num: 0,
			release_time: +moment([2019, 8, 15])
		});
	}
	return fs.readJson(access_log_path);
}

async function writeLog(json) {
	fs.ensureFileSync(access_log_path);
	return fs.writeJSON(access_log_path, json);
}

async function newAccess() {
	const json = await readLog();
	json.access_num++;
	await writeLog(json);
	return json.access_num;
}

function getAccessInfo() {
	return readLog();
}

module.exports = {
	newAccess,
	getAccessInfo
};
