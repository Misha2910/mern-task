import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

function createToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required');
  }
  return jwt.sign({}, process.env.JWT_SECRET, { subject: userId, expiresIn: '7d' });
}

function authResponse(user) {
  return {
    token: createToken(user.id),
    user: { id: user.id, name: user.name, email: user.email },
  };
}

export async function register(req, res) {
  const { name, email, password } = req.validated.body;
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email: email.toLowerCase(), passwordHash });
  return res.status(201).json(authResponse(user));
}

export async function login(req, res) {
  const { email, password } = req.validated.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  const passwordMatches = user && (await bcrypt.compare(password, user.passwordHash));
  if (!passwordMatches) {
    return res.status(401).json({ error: { message: 'Email or password is incorrect.' } });
  }

  return res.json(authResponse(user));
}

export async function currentUser(req, res) {
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(401).json({ error: { message: 'Your account could not be found.' } });
  }
  return res.json({ user: { id: user.id, name: user.name, email: user.email } });
}