import jwt from 'jsonwebtoken';

export function verifyToken(request) {
  const authorization = request.headers.get('authorization');
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return null;
  }
  try {
    const token = authorization.split(' ')[1];
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
}
