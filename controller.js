const logger = require("./components/utils/logger");

class Assistant {
	constructor(config) {
		this.config = config;
		this.instance = [];
		this.data = {};
	}

	regsiter(src, config) {
		logger.info("Register " + src + " service");

		const instance = require(src)({
			config,
			data: this.data,
		});

		logger.info("Successfully register " + src + " service");

		this.instance.push(instance);

		return true;
	}

	start(interval) {
		logger.info("Starting components...");

		this.instance.forEach((instance) => {
			instance.start();
		});
	}

	destroy(instanceIndex) {
		this.instance.splice(instanceIndex, 1);
	}

	list() {
		return this.instance;
	}
}

module.exports = Assistant;
