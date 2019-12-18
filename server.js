const Koa = require('koa');
const Router = require('koa-router');
const mount = require('koa-mount');
const staticServe = require('koa-static');
const send = require('koa-send');
const koaBody = require('koa-body');
const fs = require('fs-extra');
const path = require('path');
const moment = require('moment');
const access_util = require('./access/access_util');

const app = new Koa({
	proxy: true
});
function resolvePath(relativePath) {
	return path.resolve(process.cwd(), relativePath);
}

// log
app.use(async (ctx, next) => {
	const { origin, host, url } = ctx;
	// console.log('request url', url);
	await next();
});

// cros
app.use(async (ctx, next) => {
	const { origin, host, url, method } = ctx;
	ctx.set({
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Request-Method': 'PUT,POST,GET,DELETE,OPTIONS',
		'Access-Control-Expose-Headers': '*',
		'Access-Control-Allow-Headers': '*'
	});
	await next();
});

// 静态资源代理blog目录
const staticServer = new Koa();
const staticDir = resolvePath('blog');
staticServer.use(staticServe(staticDir));
// 未知路径均返回index.html
staticServer.use(async (ctx, next) => {
	let done = false;
	if (ctx.method === 'HEAD' || ctx.method === 'GET') {
		try {
			done = await send(ctx, 'index.html', { root: staticDir });
		} catch (err) {
			if (err.status !== 404) {
				throw err;
			}
		}
	}
	if (!done) {
		await next();
	}
});

app.use(mount('/blog', staticServer));

// Restful路由接口
const router = new Router({
	prefix: '/blog_server'
});
router.get('/blog_access', async ctx => {
	ctx.body = await access_util.newAccess();
}).get('/blog_info', async ctx => {
	const {access_num, release_time} = await access_util.getAccessInfo();
	const time = +moment();
	ctx.body = {
		access_num,
		runtime: time - release_time
	}
});
app.use(router.routes()).use(router.allowedMethods());
app.listen(8500, '0.0.0.0');
