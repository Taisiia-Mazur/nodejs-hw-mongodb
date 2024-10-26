import { createFakeContact } from "../utils/createFakeContact.js";
import { readContacts } from "../utils/readContacts.js";
import { writeContacts } from "../utils/writeContacts.js";

export const addOneContact = async () => {
    const contact = await readContacts();
    const oneContact = createFakeContact();
    await writeContacts([...contact, oneContact]);
};

addOneContact();
