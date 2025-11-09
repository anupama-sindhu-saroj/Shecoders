import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("🧠 Decoded user ID:", decoded.id);
      req.user = await User.findById(decoded.id).select('-password');
      console.log("👤 User from DB:", req.user);
      next();
    } catch (error) {
      console.error("❌ Token verification failed:", error.message); // 👈 Helpful log
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
