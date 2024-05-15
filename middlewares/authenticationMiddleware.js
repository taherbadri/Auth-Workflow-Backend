const { UnauthorizedError, ForbiddenAccessError } = require("../errors");
const { verifyJWT } = require("../utils");
const { createTokenUser, checkForExistingToken } = require("../utils/jwt");
const Token = require("../models/Token");

const authenticateUser = async (req, res, next) => {
	const { refreshToken, accessToken } = req.signedCookies;
	console.log(req.signedCookies);

	try {
		if (accessToken) {
			const payload = verifyJWT(accessToken);
			req.user = payload.tokenUser;
			return next();
		}

		const payload = verifyJWT(refreshToken);
		const existingToken = await Token.findOne({
			user: payload.tokenUser.userId,
			refreshToken: payload.refreshToken,
		});
		if (!existingToken || !existingToken?.isValid) {
			throw new UnauthorizedError("Invalid Credentials");
		}
		checkForExistingToken({ existingToken, tokenUser: payload.tokenUser, res });
		req.user = payload.tokenUser;
		next();
	} catch (error) {
		throw new UnauthorizedError("Invalid Session");
	}
};

const authorizePermissions = (...roles) => {
	return (req, res, next) => {
		const { role } = req.user;
		if (!roles.includes(role)) {
			throw new ForbiddenAccessError("not authorized to access this route");
		}
		next();
	};
};

module.exports = {
	authenticateUser,
	authorizePermissions,
};
