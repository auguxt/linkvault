const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method not allowed' }) };
  }

  // Verify token
  try {
    const token = event.headers.authorization?.replace('Bearer ', '');
    if (!token) return { statusCode: 401, body: JSON.stringify({ message: 'No token provided' }) };
    jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return { statusCode: 401, body: JSON.stringify({ message: 'Invalid or expired token. Please login again.' }) };
  }

  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
    const link = JSON.parse(event.body);

    const res = await fetch(`${SUPABASE_URL}/rest/v1/links`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(link)
    });

    const data = await res.json();
    return { statusCode: 201, body: JSON.stringify(data) };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ message: 'Failed to add link' }) };
  }
};
