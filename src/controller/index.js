const Router = require('koa-router');
const router = new Router({
	prefix: process.env.base_url
});

const baseInfo = require('./baseInfo');
const github = require('./github');

baseInfo(router);
github(router);

module.exports = router;
