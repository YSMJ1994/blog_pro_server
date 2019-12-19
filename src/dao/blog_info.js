const { executeSql, escape } = require('../utils/mysql');

function queryBlogInfo() {
	return executeSql(`select * from blog.blog_info`).then(result => {
		return result.reduce((pre, { keyword, value }) => {
			pre[keyword] = value;
			return pre;
		}, {});
	});
}

function updateBlogInfo(info) {
	const rows = Object.keys(info).map(key => ({ keyword: escape(key), value: escape(String(info[key])) }));
	const sql = `update blog.blog_info set 
        value = case keyword
	        	${rows.map(({ keyword, value }) => `WHEN ${keyword} THEN ${value}`).join('\n')}
            end
                where keyword in (${rows.map(t => t.keyword).join(',')})`;
	return executeSql(sql).then(res => res.message);
}

module.exports = {
	queryBlogInfo,
	updateBlogInfo
};
