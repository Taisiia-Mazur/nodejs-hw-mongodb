import * as authServices from '../services/auth.js';

const setupSession = (res, session) => {
  const { _id, refreshToken, refreshTokenValidUntil } = session;
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });

  res.cookie('sessionId', _id, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });
};


export const registerController = async (req, res) => {
  const dataReq = await authServices.register(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      name: dataReq.name,
      email: dataReq.email,
    },
  });
};


export const loginController = async (req, res) => {
  const session = await authServices.login(req.body);

  setupSession(res, session);

  res.status(201).json({
    status: 201,
    message: 'Successfully logged in a user!',
    data: { accessToken: session.accessToken },
  });
};


export const refreshSessionController = async (req, res) => {
  const session = await authServices.refreshUserSession(req.cookies);

  setupSession(res, session);

  res.status(201).json({
    status: 201,
    message: 'Successfully refreshed a session!"',
    data: { accessToken: session.accessToken },
  });
};


export const logoutController = async (req, res) => {
  if (req.cookies.sessionId) {
    await authServices.logoutSession(req.cookies.sessionId);
  }
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(201).send();
};
