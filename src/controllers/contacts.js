import createHttpError from 'http-errors';
import * as contactServices from '../services/contacts.js';

export const getContactsController = async (req, res) => {
  const data = await contactServices.getContacts();

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data,
  });
};

export const getContactByIdController = async (req, res) => {
  const { id } = req.params;
    const data = await contactServices.getContactById(id);

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
    const data = await contactServices.addContact(req.body);
    res.status(201).json({
        status: 201,
        message: "Successfully created a contact!",
        data,
    });
}

export const updateContactController = async (req, res) => {

    const { id } = req.params;
    const payload = req.body;
  const result = await contactServices.updateContact(id, payload);

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

    res.json({
        status: 200,
        message: `Successfully patched a contact!`,
        data: result.contact,
    });
}

export const deleteContactController = async (req, res) => {
     const { id } = req.params;
       const contact = await contactServices.deleteContact(id);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
}
