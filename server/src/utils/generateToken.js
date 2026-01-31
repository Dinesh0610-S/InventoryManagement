import jwt from 'jsonwebtoken';

/**
 * Generate JWT Token
 * Creates a signed JWT token for user authentication
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};
