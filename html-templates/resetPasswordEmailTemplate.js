const resetPasswordEmailHTML = ({ origin, passwordToken, email }) => {
	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Password Reset</title>
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
    <h2>Password Reset</h2>
    <p>You recently requested to reset your password. To reset your password, please click the button below:</p>
    <a href="${origin}/reset-password?email=${email}&passwordToken=${passwordToken}" class="btn">Reset Password</a>
    <p>This link will expire in 30 minutes.</p>
    <p>If you didn't request a password reset, you can safely ignore this email.</p>
  </div>
</body>
</html>
`;
};

module.exports = {
	resetPasswordEmailHTML,
};
