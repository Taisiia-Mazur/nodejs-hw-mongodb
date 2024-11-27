import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import userCollection from '../db/models/user.js';
import sessionCollection from '../db/models/session.js';
import {
  accessTokenLifeTime,
  refreshTokenLifeTime,
  SMTP,
  TEMPLATES_DIR,
} from '../constants/users.js';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendMail.js';
import { getFullNameFromGoogleTokenPayload, validateCode } from '../utils/googleOAuth2.js';

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


export const requestResetToken = async (email) => {
  const user = await userCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );


  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  await sendEmail({
    from: env(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html,
  });

};

export const resetPassword = async (payload) => {
  let entries;
  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  const user = await userCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  })

  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const encryptedPassword = await bcrypt.hash(payload.password, 10)
    await userCollection.updateOne(
      { _id: user._id },
      { password: encryptedPassword },
    );

}


export const loginOrSignupWithGoogle = async (code) => {
  const loginTicket = await validateCode(code);
  const payload = loginTicket.getPayload();
  if (!payload) throw createHttpError(401);

  let user = await userCollection.findOne({ email: payload.email });
  if (!user) {
    const password = await bcrypt.hash(randomBytes(10), 10);
    user = await userCollection.create({
      email: payload.email,
      name: getFullNameFromGoogleTokenPayload(payload),
      password,
      role: 'parent',
    });
  }

  const newSession = createSession();

  return await sessionCollection.create({
    userId: user._id,
    ...newSession,
  });
};
