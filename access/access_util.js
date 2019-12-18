const fs = require('fs-extra');
const path = require('path');
const access_log_path = path.resolve(__dirname, 'access_log.json');
if (!fs.pathExistsSync(access_log_path)) {
	fs.ensureFileSync(access_log_path);
	fs.writeJSONSync(access_log_path, {
		access_num: 0,
		access_log: []
	});
}
function readLog() {
	return fs.readJson(access_log_path);
}

async function writeLog(json) {
	return fs.writeJSON(access_log_path, json);
}

async function newAccess(ip, time) {
	const json = await readLog();
	json.access_log.push({ ip, time });
	json.access_num = json.access_log.length;
	await writeLog(json);
	return json.access_num;
}

module.exports = {
	newAccess
};
