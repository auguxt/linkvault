const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method not allowed' }) };
  }

  try {
    const { username, password } = JSON.parse(event.body);

    // Get credentials from Netlify environment variables
    const validUsername = process.env.ADMIN_USERNAME;
    const validPassword = process.env.ADMIN_PASSWORD;
    const jwtSecret    = process.env.JWT_SECRET;

    // Check username and password
    if (username === validUsername && password === validPassword) {
      // Create a token that expires in 24 hours
      const token = jwt.sign(
        { username, role: 'admin' },
        jwtSecret,
        { expiresIn: '24h' }
      );

      return {
        statusCode: 200,
        body: JSON.stringify({ ok: true, token })
      };
    }

    // Wrong credentials
    return {
      statusCode: 401,
      body: JSON.stringify({ ok: false, message: 'Invalid username or password' })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, message: 'Server error' })
    };
  }
};
