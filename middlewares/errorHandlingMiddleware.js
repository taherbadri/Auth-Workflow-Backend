const { StatusCodes } = require("http-status-codes");

const errorHandlingMiddleware = (err, req, res, next) => {
	const customErrorObject = {
		message:
			err.message || "Something went wrong, please try again after sometime",
		status: err.status || StatusCodes.INTERNAL_SERVER_ERROR,
	};
	if (err.name === "ValidationError") {
		customErrorObject.message = Object.values(err.errors)
			.map((item) => item.message)
			.join(", ");
		customErrorObject.status = StatusCodes.BAD_REQUEST;
	}
	if (err.code && err.code === 11000) {
		customErrorObject.message = `Duplicate value entered for  ${Object.keys(
			err.keyValue
		)} field please choose another value`;
		customErrorObject.status = StatusCodes.BAD_REQUEST;
	}
	if (err.name === "CastError") {
		customErrorObject.message = `No item found with id  : ${err.value}`;
		customErrorObject.status = StatusCodes.NOT_FOUND;
	}
	return res
		.status(customErrorObject.status)
		.json({ message: customErrorObject.message, err });
};

module.exports = errorHandlingMiddleware;
