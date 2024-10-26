import { readContacts } from "../utils/readContacts.js";

export const countContacts = async () => {
    const contact = await readContacts();
    return contact.length;
};

console.log(await countContacts());
