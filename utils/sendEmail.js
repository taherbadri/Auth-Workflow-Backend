const nodemailer = require("nodemailer");
const { nodeMailerConfig } = require("./nodemailerConfig");

const sendMail = async ({ to, subject, html }) => {
	const testAccount = await nodemailer.createTestAccount();
	const transporter = nodemailer.createTransport(nodeMailerConfig);

	const message = {
		from: "no-reply@gmail.com",
		to,
		subject,
		// text: "Hello to myself!",
		html,
	};
	return transporter.sendMail(message);
};

module.exports = sendMail;
