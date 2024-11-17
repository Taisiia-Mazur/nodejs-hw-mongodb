import contactCollection from '../db/models/Contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = 'asc',
  filter = {},
  userId,
}) => {
  const skip = (page - 1) * perPage;
  const contactsQuery = contactCollection.find({userId});

  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }
  if (filter.type) {
    contactsQuery.where('contactType').equals(filter.type);
  }
    if (filter.userId) {
      contactsQuery.where('userId').equals(filter.userId);
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

export const getContactById = async ({id, userId}) => {
  const contact = await contactCollection.findOne({ userId, _id: id });

  return contact;
};


export const addContact = async ({ userId, data }) => {
  const newContact = await contactCollection.create({ userId, ...data });

  return newContact;
};


export const updateContact = async (id, payload, options = {}, userId) => {
  const rawResult = await contactCollection.findOneAndUpdate(
    { _id: id, userId},
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

export const deleteContact = async ({id, userId}) => {
  const contact = await contactCollection.findOneAndDelete({_id: id, userId});

  return contact;
};
