const moment = require('moment');
const { queryBlogInfo, updateBlogInfo } = require('../dao/blog_info');

module.exports = function(router) {
	router
		.get('/blog_access', async ctx => {
			const { access_num } = await queryBlogInfo();
			const new_num = +access_num + 1;
			await updateBlogInfo({ access_num: new_num });
			ctx.body = new_num;
		})
		.get('/blog_info', async ctx => {
			const { access_num, release_time } = await queryBlogInfo();
			const time = +moment();
			ctx.body = {
				access_num: +access_num,
				runtime: time - +release_time
			};
		});
};
