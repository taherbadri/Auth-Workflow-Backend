const verificationEmailHTML = ({ origin, verificationToken, email }) => {
	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Email Verification</title>
<style>
  body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 0;
  }
  .container {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  h2 {
    color: #333;
  }
  p {
    color: #666;
  }
  .btn {
    display: inline-block;
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }
  .btn:hover {
    background-color: #0056b3;
  }
</style>
</head>
<body>
  <div class="container">
    <h2>Email Verification</h2>
    <p>Thank you for signing up! To verify your email address, please click the button below:</p>
    <a href="${origin}/verify-email?verificationToken=${verificationToken}&email=${email}" class="btn">Verify Email</a>
    <p>If you did not sign up for an account, you can ignore this email.</p>
  </div>
</body>
</html>
`;
};

module.exports = {
	verificationEmailHTML,
};
