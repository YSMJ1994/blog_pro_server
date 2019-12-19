process.on('unhandledRejection', err => {
	throw err;
});
require('./src/utils/env');
const Koa = require('koa');
const mount = require('koa-mount');
const staticServe = require('koa-static');
const send = require('koa-send');
const path = require('path');
const router = require('./src/controller');

const app = new Koa({
	proxy: true
});
function resolvePath(relativePath) {
	return path.resolve(process.cwd(), relativePath);
}

// log
app.use(async (ctx, next) => {
	// const { origin, host, url } = ctx;
	// console.log('request url', url);
	await next();
});

// cros
app.use(async (ctx, next) => {
	// const { origin, host, url, method } = ctx;
	ctx.set({
		'Access-Control-Allow-Origin': 'soberz.cn',
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
app.use(router.routes()).use(router.allowedMethods());
app.listen(8500, '0.0.0.0');
