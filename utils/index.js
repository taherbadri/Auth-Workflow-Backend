const { hashToken } = require("./hashToken");
const { attachCookiesToResponse, verifyJWT } = require("./jwt");
const { nodeMailerConfig } = require("./nodemailerConfig");
const sendMail = require("./sendEmail");
const { sendResetPasswordMail } = require("./sendResetPasswordMail");
const { sendVerificationEmail } = require("./sendVerificationEmail");

module.exports = {
	verifyJWT,
	attachCookiesToResponse,
	sendMail,
	sendResetPasswordMail,
	sendVerificationEmail,
	nodeMailerConfig,
	hashToken,
};
