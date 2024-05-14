const { StatusCodes } = require("http-status-codes");
const {
	BadRequestError,
	UnauthorizedError,
	ForbiddenAccessError,
	NotFoundError,
} = require("../errors");
const User = require("../models/UserModel");
const Token = require("../models/Token");
const crypto = require("crypto");
const {
	sendVerificationEmail,
	sendResetPasswordMail,
	hashToken,
} = require("../utils");
const { attachCookiesToResponse } = require("../utils");
const { createTokenUser, checkForExistingToken } = require("../utils/jwt");

const register = async (req, res) => {
	const { username, email, password } = req.body;
	if (!username || !email || !password) {
		throw new BadRequestError("Please provide all values");
	}
	const isEmailALreadyExists = await User.findOne({ email });
	if (isEmailALreadyExists) {
		throw new BadRequestError(
			"This email already exists please try entering another one"
		);
	}
	const isFirstAccount = (await User.countDocuments({})) === 0;
	const role = isFirstAccount ? "admin" : "user";
	const verificationToken = crypto.randomBytes(40).toString("hex");
	const user = await User.create({
		username,
		email,
		password,
		role,
		verificationToken,
	});

	await sendVerificationEmail({
		email: user.email,
		verificationToken: user.verificationToken,
		origin: process.env.ORIGIN,
	});
	return res.status(StatusCodes.CREATED).json({
		msg: "Success! Please check your email to verify your account",
	});
};

const login = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		throw new BadRequestError("Please provide values");
	}
	const user = await User.findOne({ email });
	if (!user) {
		throw new UnauthorizedError("Invalid Credentials");
	}
	const isPasswordCorrect = await user.comparePassword(password);
	if (!isPasswordCorrect) {
		throw new UnauthorizedError("Invalid Credentials");
	}
	if (!user.isVerified) {
		throw new ForbiddenAccessError(
			"Email not verified! Please verify your email to login."
		);
	}
	const tokenUser = createTokenUser(user);
	let refreshToken = "";

	const existingToken = await Token.findOne({ user: user._id });

	if (existingToken) {
		checkForExistingToken({ existingToken, tokenUser, res });
		res.status(StatusCodes.OK).json({ msg: "Login Successful" });
		return;
	}

	refreshToken = crypto.randomBytes(40).toString("hex");
	const userAgent = req.headers["user-agent"];
	const ip = req.ip;
	const userToken = { refreshToken, ip, userAgent, user: user._id };
	await Token.create(userToken);

	attachCookiesToResponse({ res, tokenUser, refreshToken });
	return res.status(StatusCodes.OK).json({ msg: "Login Successful" });
};

const verifyEmail = async (req, res) => {
	const { email, verificationToken } = req.body;
	if (!email || !verificationToken) {
		throw new BadRequestError("Please provide email / verification token");
	}
	const user = await User.findOne({ email });
	if (!user) {
		throw new UnauthorizedError("User not found");
	}
	if (user.verificationToken !== verificationToken) {
		throw new UnauthorizedError("Verification failed");
	}
	user.verificationToken = "";
	user.isVerified = true;
	user.verifiedOn = Date.now();
	await user.save();
	return res.status(StatusCodes.OK).json({ msg: "Email Verified" });
};

const logout = async (req, res) => {
	await Token.findOneAndDelete({ user: req.user.userId });
	req.user = null;
	res.cookie("refreshToken", "", {
		expires: new Date(Date.now()),
		httpOnly: true,
	});
	res.cookie("accessToken", "", {
		expires: new Date(Date.now()),
		httpOnly: true,
	});
	return res.status(StatusCodes.OK).json({ msg: "Logged out Successfully" });
};

const forgotPassword = async (req, res) => {
	const { email } = req.body;
	if (!email) {
		throw new BadRequestError("Please provide valid email");
	}
	const user = await User.findOne({ email });
	if (user) {
		const passwordToken = crypto.randomBytes(70).toString("hex");
		await sendResetPasswordMail({
			email: user.email,
			origin: process.env.ORIGIN,
			passwordToken,
		});
		const halfHour = 30 * 60 * 1000;
		const passwordTokenExpirationDate = new Date(Date.now() + halfHour);

		user.passwordToken = hashToken(passwordToken);
		user.passwordTokenExpirationDate = passwordTokenExpirationDate;
		await user.save();
	}
	return res
		.status(StatusCodes.OK)
		.json({ msg: "reset link sent on your registered email" });
};

const resetPassword = async (req, res) => {
	const { email, passwordToken, password, confirmPassword } = req.body;
	if (!email || !passwordToken || !password || !confirmPassword) {
		throw new BadRequestError("please provide all values");
	}
	if (password !== confirmPassword) {
		throw new BadRequestError("both inputs should be same");
	}
	const user = await User.findOne({ email });
	if (user) {
		const currentDate = new Date();
		if (
			user.passwordToken === hashToken(passwordToken) &&
			user.passwordTokenExpirationDate > currentDate
		) {
			user.password = confirmPassword;
			user.passwordToken = null;
			user.passwordTokenExpirationDate = null;
			await user.save();
		}
	}
	return res
		.status(StatusCodes.OK)
		.json({ msg: "password changed successfully" });
};

module.exports = {
	login,
	logout,
	register,
	verifyEmail,
	resetPassword,
	forgotPassword,
};
