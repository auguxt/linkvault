const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
  if (event.httpMethod !== 'PATCH') {
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
    const { id, ...patch } = JSON.parse(event.body);

    const res = await fetch(`${SUPABASE_URL}/rest/v1/links?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(patch)
    });

    if (!res.ok) throw new Error('Update failed');
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ message: 'Failed to update link' }) };
  }
};
