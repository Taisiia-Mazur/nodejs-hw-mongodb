import createHttpError from 'http-errors';
import * as path from 'node:path';
import * as contactServices from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { sortByList } from '../db/models/Contact.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import {env} from "../utils/env.js"

export const getContactsController = async (req, res) => {
  const { _id: userId } = req.user;
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, sortByList);
  const filter = { ...parseFilterParams(req.query), userId };

  const data = await contactServices.getContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data,
  });
};

export const getContactByIdController = async (req, res) => {
  const { id } = req.params;
    const { _id: userId } = req.user;
  const data = await contactServices.getContactById(id, userId);

  if (!data) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully found contacts!`,
    data,
  });
};

export const addContactController = async (req, res) => {
  const { _id: userId } = req.user;
  const data = await contactServices.addContact({ ...req.body, userId });
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};

export const updateContactController = async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const { _id: userId } = req.user;
   let photo = null;
   if (req.file) {
     if (env('ENABLE_CLOUDINARY') === 'true') {
       photo = await saveFileToCloudinary(req.file, 'photo');
     } else {
       await saveFileToUploadDir(req.file);
       photo = path.join(req.file.filename);
     }
   }

  const result = await contactServices.updateContact(id, payload, userId, photo);

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.contact,
  });

};

export const deleteContactController = async (req, res) => {
  const { id } = req.params;
    const { _id: userId } = req.user;
  const contact = await contactServices.deleteContact(id, userId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};
