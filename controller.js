const config = require("./config.json");

class Assistant {
	constructor(config) {
		this.config = config;
		this.instance = [];
	}

	regsiter(type, config) {
		if (type === "news") {
			this.instance;
		}
	}

	destroy(instance) {}

	list() {
		return this.instance;
	}
}

module.exports = Assistant;
