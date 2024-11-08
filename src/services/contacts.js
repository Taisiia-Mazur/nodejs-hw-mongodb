import contactCollection from '../db/models/Contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = 'asc',
  filter = {},
}) => {
  const skip = (page - 1) * perPage;
  const query = contactCollection
    .find()
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder })
    .where('isFavourite')
    .equals(true);
  if (filter.type) {
    query.where('contactType').equals(filter.type);
  }

  const data = await query;

  const totalItems = await contactCollection
    .find()
    .merge(query)
    .countDocuments();
  const paginationData = calculatePaginationData({ page, perPage, totalItems });
  return {
    data,
    ...paginationData,
  };
};

export const getContactById = (id) => contactCollection.findById(id);

export const addContact = (data) => contactCollection.create(data);

export const updateContact = async (id, payload, options = {}) => {
  const rawResult = await contactCollection.findOneAndUpdate(
    { _id: id },
    payload,
    {
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteContact = async (id) => {
  const contact = await contactCollection.findOneAndDelete({
    _id: id,
  });

  return contact;
};
