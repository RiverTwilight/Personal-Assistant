// send to wechat bot
const axios = require("axios");
const qs = require("querystring");
const dotenv = require("dotenv");

dotenv.config();

async function sendToWechat(message) {
	const res = await axios(
		"https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=" +
			process.env.WECHAT_ACCESS_TOKEN,
		{
			method: "post",
			data: JSON.stringify({
				touser: "WangRenJie",
				toparty: "PartyID1|PartyID2",
				totag: "TagID1 | TagID2",
				msgtype: "markdown",
				agentid: process.env.WECHAT_AGENT_ID,
				markdown: {
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
}

module.exports = sendToWechat;
