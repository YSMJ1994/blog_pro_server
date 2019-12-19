const axios = require('axios');

const service = axios.create({
	timeout: 5000
});
service.interceptors.response.use(
	response => {
		const { status, data, config } = response;
		if (status === 200) {
			return Promise.resolve(data);
		} else {
			return Promise.reject(data);
		}
	},
	error => {
		console.log('response error', error);
	}
);
module.exports = service;
