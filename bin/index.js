const Assistant = require("../controller");
const config = require("../assistant.config.json");

const assistant = new Assistant(config);

config.plugin.forEach((item) => {
	assistant.regsiter(item.type, item.config);
});
