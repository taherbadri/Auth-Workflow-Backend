const { StatusCodes } = require("http-status-codes");
const CustomError = require("./CustomError");

class ForbiddenAccessError extends CustomError {
	constructor(message) {
		super(message);
		this.status = StatusCodes.FORBIDDEN;
	}
}

module.exports = ForbiddenAccessError;
