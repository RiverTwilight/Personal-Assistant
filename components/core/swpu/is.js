const sendToWechat = require("../../push/wechat.js");
const { parseDate } = require("../../utils/parse-date");
const cheerio = require("cheerio");
const got = require("../../utils/got");
const timezone = require("../../utils/timezone");

/**
 * ../..description: SWPU Offcialsite
 */

async function getLatest(channel) {
	const url = `https://www.swpu.edu.cn/is/xydt/${channel}.htm`;

	const res = await got(url);
	const $ = cheerio.load(res.data);

	let title = $("title").text();
	title = title.substring(0, title.indexOf("-"));

	const items = $('tr[height="20"]')
		.toArray()
		.map((elem) => ({
			title: $("a[title]", elem).text().trim(),
			pubDate: timezone(
				parseDate($("td:eq(1)", elem).text(), "YYYY年MM月DD日"),
				+8
			),
			link: `https://www.swpu.edu.cn/is/${
				$("a[href]", elem).attr("href").split("../")[1]
			}`,
		}));

	const out = await Promise.all(
		items.map((item) =>
			ctx.cache.tryGet(item.link, async () => {
				const res = await got(item.link);
				const $ = cheerio.load(res.data);
				if ($("title").text().startsWith("系统提示")) {
					item.author = "系统";
					item.description = "无权访问";
				} else {
					item.author = "学院";
					item.description = $(".v_news_content").html();
					for (const elem of $(".v_news_content p")) {
						if ($(elem).css("text-align") === "right") {
							item.author = $(elem).text();
							break;
						}
					}
				}
				return item;
			})
		)
	);

	return {
		title: `西南石油大学信息学院 ${title}`,
		link: url,
		description: `西南石油大学信息学院 ${title}`,
		language: "zh-CN",
		item: out,
	};
}

const CHANNEL_MAP = {
	xydt: "学院动态",
	xwgg: "学术公告",
	xwzx: "学术资讯",
};

module.exports = async (config) => {
	const channel = user.channel || "xydt";
	const channelName = CHANNEL_MAP[channel];
	const out = await getLatest(channel);

	config.user.forEach(async (user) => {
		if (user.push.wechat) {
			const send = await sendToWechat(
				`
					你订阅的西南石油大学信息学院有更新啦！
					
					** ${asdff} **

					[立即阅读](${asdfasdf})
				`,
				[user.push.wechat.username]
			);
		}

		console.log(send);
	});
};
