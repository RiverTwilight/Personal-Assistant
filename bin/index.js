const Assistant = require("../controller");
const config = require("../assistant.config.json");

const assistant = new Assistant(config);

config.service.forEach((item) => {
	assistant.regsiter(item.src, item.config);
});
