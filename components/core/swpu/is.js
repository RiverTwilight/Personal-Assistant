const sendToWechat = require("../../push/wechat.js");
const { parseDate } = require("../../utils/parse-date");
const cheerio = require("cheerio");
const got = require("../../utils/got");
const logger = require("../../utils/logger");
const timezone = require("../../utils/timezone");
const { config } = require("dotenv");

/**
 * description: SWPU Offcialsite
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

	// const out = await Promise.all(
	// 	items.map((item) =>
	// 		ctx.cache.tryGet(item.link, async () => {
	// 			const res = await got(item.link);
	// 			const $ = cheerio.load(res.data);
	// 			if ($("title").text().startsWith("系统提示")) {
	// 				item.author = "系统";
	// 				item.description = "无权访问";
	// 			} else {
	// 				item.author = "学院";
	// 				item.description = $(".v_news_content").html();
	// 				for (const elem of $(".v_news_content p")) {
	// 					if ($(elem).css("text-align") === "right") {
	// 						item.author = $(elem).text();
	// 						break;
	// 					}
	// 				}
	// 			}
	// 			return item;
	// 		})
	// 	)
	// );

	return items[0];
}

const CHANNEL_MAP = {
	tzgg: "通知公告",
	xyxw: "学院新闻",
};

module.exports = (ctx) => {
	return {
		start: async () => {
			logger.info("Starting is service");

			var state = {
				tzgg: {
					title: "信息学院2023届应届本科毕业生免试攻读硕士研究生拟推免生及候补人选名...",
					link: "htt//www.swpu.edu.cn/is/info/2269/4631.htm",
				},
				xyxw: {
					link: "asdfasdf",
				},
			};

			setInterval(() => {
				Object.keys(CHANNEL_MAP).forEach(async (channel) => {
					logger.info("Checking " + CHANNEL_MAP[channel]);
					const latestPost = await getLatest(channel);

					const latestCache = state[channel];

					if (
						latestPost.link !== latestCache.link &&
						ctx.config.channel.includes(channel)
					) {
						console.log("New post found", latestPost);

						state[channel] = latestPost;

						if (ctx.config.push.wechat) {
							const send = await sendToWechat(
								`你订阅的西南石油大学信息学院有更新啦！\n\n <a href="${latestPost.link}">${latestPost.title}</a>
								`,
								["WangRenJie"]
							);
							console.log(send);
						}
					} else {
						console.log("No new Post", state);
					}
				});
			}, 10000);
		},
	};
};
