import contactCollection from '../db/models/Contact.js';

export const getContacts = () => contactCollection.find();

export const getContactById = (id) => contactCollection.findById(id);

export const addContact = (data) => contactCollection.create(data);

export const updateContact = async (id, payload, options = {}) => {
  const rawResult = await contactCollection.findOneAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    // isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteContact = async (id) => {
  const contact = await contactCollection.findOneAndDelete({
    _id: id,
  });

  return contact;
}
