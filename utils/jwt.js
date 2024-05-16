const { signedCookie } = require("cookie-parser");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
	const token = jwt.sign(payload, process.env.JWT_SECRET);
	return token;
};

const verifyJWT = (token) => {
	const isTokenValid = jwt.verify(token, process.env.JWT_SECRET);
	return isTokenValid;
};

const attachCookiesToResponse = ({ res, tokenUser, refreshToken }) => {
	const accessTokenJWT = createJWT({ payload: { tokenUser } });
	const refreshTokenJWT = createJWT({ payload: { tokenUser, refreshToken } });
	const oneDay = 24 * 60 * 60 * 1000;
	const oneMonth = 30 * 24 * 60 * 60 * 1000;
	res.cookie("refreshToken", refreshTokenJWT, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		expires: new Date(Date.now() + oneMonth),
		signed: true,
		sameSite: "none",
	});
	res.cookie("accessToken", accessTokenJWT, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		signed: true,
		expires: new Date(Date.now() + oneDay),
		sameSite: "none",
	});
};

const checkForExistingToken = ({ existingToken, res, tokenUser }) => {
	const { isValid } = existingToken;
	if (!isValid) {
		throw new UnauthorizedError("Invalid Credentials");
	}
	let refreshToken = existingToken.refreshToken;
	attachCookiesToResponse({ res, tokenUser, refreshToken });
	return;
};

const createTokenUser = (user) => {
	return {
		username: user.username,
		userId: user._id || user.userId,
		role: user.role,
	};
};

module.exports = {
	attachCookiesToResponse,
	verifyJWT,
	createTokenUser,
	checkForExistingToken,
};
