const Assistant = require("../controller");
const config = require("../assistant.config.json");

const assistant = new Assistant(config);

console.log("Start assistant");

assistant.regsiter("./components/core/swpu/is.js", {
	channel: ["tzgg", "xyxw"],
	uid: "123456",
	push: {
		wechat: {
			username: "WangRenJie",
		},
	},
}) && assistant.start();
