const axios = require("axios");
const qs = require("querystring");
const dotenv = require("dotenv");

dotenv.config();

const getAccessToken = async (id, secret) => {
	const res = await axios.get(
		`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${id}&corpsecret=${secret}`
	);
	// console.log(res.data);
	return res.data.access_token;
};

module.exports = async (message, targetUser) => {
	const tokenCache = {};
	const now = new Date();

	// if (!tokenCache.token || now.getTime() - tokenCache.time > 7200 * 1000) {
	// 	tokenCache.token = await getAccessToken(
	// 		process.env.WECHAT_CORP_ID,
	// 		process.env.WECHAT_SECRET
	// 	);
	// 	tokenCache.time = now.getTime();
	// }

	const res = await axios(
		"https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=" +
			tokenCache.token,
		{
			method: "post",
			data: JSON.stringify({
				touser: targetUser.join("|"),
				toparty: "PartyID1|PartyID2",
				totag: "TagID1 | TagID2",
				msgtype: "text",
				agentid: process.env.WECHAT_AGENT_ID,
				text: {
					content: message,
				},
				safe: 0,
				enable_id_trans: 0,
				enable_duplicate_check: 0,
				duplicate_check_interval: 1800,
			}),
		}
	);

	return res;
};
