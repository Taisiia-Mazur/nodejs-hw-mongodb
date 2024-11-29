/* eslint-disable no-unused-vars */
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import { UPLOAD_DIR } from './constants/users.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

const port = Number(env('PORT', 3000));

export const setupServer = () => {
  const app = express();

  app.use(cors());
  const logger = pino({
    transport: {
      target: 'pino-pretty',
    },
  });
  // app.use(logger);

  app.use(express.json());

  app.use(cookieParser());

  app.use('/auth', authRouter);

  app.use('/contacts', contactsRouter);

  app.use('/uploads', express.static(UPLOAD_DIR));

  app.use('/uploads', express.static(UPLOAD_DIR));

  app.use('/api-docs', swaggerDocs());

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(port, () => console.log(`Server running on ${port} PORT`));
};
