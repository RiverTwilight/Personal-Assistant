class Assistant {
	constructor(config) {
		this.config = config;
		this.instance = [];
	}

	regsiter(src, config) {
		const instance = require(src)(config);
		this.instance.push(instance);
	}

	destroy(instance) {}

	list() {
		return this.instance;
	}
}

module.exports = Assistant;
