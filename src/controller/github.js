const fetch = require('../utils/fetch');

module.exports = function(router) {
	router.get('/github_user', async ctx => {
		ctx.body = await fetch.get('https://api.github.com/user', {
			params: {
				access_token: process.env.github_token
			}
		});
	});
};
