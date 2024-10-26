import contactCollection from "../db/models/Contact.js";


export const getContacts = () => contactCollection.find();

export const getContactById = (id) => contactCollection.findById(id);


