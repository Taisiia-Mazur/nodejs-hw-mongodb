import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import userCollection from '../db/models/user.js';
import sessionCollection from '../db/models/session.js';
import {
  accessTokenLifeTime,
  refreshTokenLifeTime,
} from '../constants/users.js';

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: Date.now() + accessTokenLifeTime,
    refreshTokenValidUntil: Date.now() + refreshTokenLifeTime,
  };
};

export const register = async (payload) => {
  const { email, password } = payload;
  const user = await userCollection.findOne({ email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  return userCollection.create({ ...payload, password: hashPassword });
};

export const login = async ({ email, password }) => {
  const user = await userCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password invalid!');
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'Email or password invalid!');
  }

  await sessionCollection.deleteOne({ userId: user._id });

  const newSession = createSession();

  return sessionCollection.create({
    userId: user._id,
    ...newSession,
  });
};

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const isSession = await sessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!isSession) {
    throw createHttpError(401, 'Session not found');
  }
  if (Date.now > sessionCollection.refreshTokenValidUntil) {
    throw createHttpError(401, 'Session token expired');
  }

  await sessionCollection.deleteOne({ _id: isSession._id });

  const newSession = createSession();

  return sessionCollection.create({
    userId: isSession.userId,
    ...newSession,
  });
};

export const logoutSession = async (sessionId) => {
  await sessionCollection.deleteOne({ _id: sessionId });
};

export const findSession = (filter) => sessionCollection.findOne(filter);

export const findUser = (filter) => userCollection.findOne(filter);
