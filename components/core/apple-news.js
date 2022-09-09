const puppeteer = require("puppeteer");
const sendToWechat = require("../push/wechat.js");

const HEADLESS = true;

(async function trackAppleNews(config) {
	const latedtNews = "";

	const browers = await puppeteer.launch({ headless: HEADLESS });
	const page = await browers.newPage();

	await page.setRequestInterception(true);
	await page.on("request", (interceptedRequest) => {
		if (
			interceptedRequest.url().endsWith(".jpg") ||
			interceptedRequest.url().endsWith(".png") ||
			interceptedRequest.url().endsWith(".gif") ||
			interceptedRequest.url().endsWith(".jpeg") ||
			interceptedRequest.url().endsWith(".webp") ||
			interceptedRequest.url().endsWith(".woff")
		) {
			interceptedRequest.abort();
		} else {
			interceptedRequest.continue();
		}
	});

	await page.setViewport({
		width: 400,
		height: 1080,
	});

	await page.goto("https://www.apple.com/newsroom/");

	const news = page.$$eval("ul.section-tiles > li", async (el) => {
		const latest = el[0];
		try {
			return {
				title: latest.getElementsByClassName("tile__headline")[0]
					.textContent,
				date: latest.getElementsByClassName("tile__timestamp")[0]
					.textContent,
				link: latest.getElementsByTagName("a")[0].attributes.link,
			};
		} catch (error) {
			console.log(error);
			return false;
		}
	});

	if (!HEADLESS) {
		return console.log("网页已打开，不再监控");
	}

	await news.then(async (b) => {
		if (b) {
			console.log(b);
			if (news.title !== latedtNews) {
				const send = await sendToWechat(`
                     Apple has just publish a news: ${b.title}
                    Click [here](${b.link}) to read
                `);
				console.log(send);
			}
			await page.waitFor(2000);
			await browers.close();
			return requestUrl(false);
		} else {
			console.log("还没货");
			console.log("三十分钟后再尝试");
			await page.waitFor(1800000);
			await browers.close();
			return requestUrl(true);
		}
	});
})();

// module.exports = trackAppleNews;
