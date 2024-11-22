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
  const contactsQuery = contactCollection.find({
    userId: filter.userId || undefined,
  });

  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }
  if (filter.type) {
    contactsQuery.where('contactType').equals(filter.type);
  }


  const [totalItems, contacts] = await Promise.all([

    contactCollection.find().merge(contactsQuery).countDocuments(),
    contactsQuery
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder })
    .exec(),
  ]);

  const paginationData = calculatePaginationData({ page, perPage, totalItems });
  return {
    contacts,
    ...paginationData,
  };
};

export const getContactById = async (id, userId) => {
  const contact = await contactCollection.findOne({ _id: id, userId });

  return contact;
};


export const addContact = async (payload) => {
  const contact = await contactCollection.create(payload);
  return contact;
};


export const updateContact = async (
  id,
  payload,
  userId,
  options = {},
) => {
  const rawResult = await contactCollection.findOneAndUpdate(
    { _id: id, userId },
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

export const deleteContact = async (id, userId) => {
  const contact = await contactCollection.findOneAndDelete({_id: id, userId});

  return contact;
};
