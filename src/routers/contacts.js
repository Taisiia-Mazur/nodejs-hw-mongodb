import { Router } from 'express';

import * as contactsControllers from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema, updateContactSchema } from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';

const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(contactsControllers.getContactsController));

contactsRouter.get('/:id', isValidId, ctrlWrapper(contactsControllers.getContactByIdController));

contactsRouter.post('/', validateBody(createContactSchema), ctrlWrapper(contactsControllers.addContactController),
);

contactsRouter.patch('/:id', isValidId, validateBody(updateContactSchema), ctrlWrapper(contactsControllers.updateContactController),
);

contactsRouter.delete('/:id', isValidId, ctrlWrapper(contactsControllers.deleteContactController),
);


export default contactsRouter;
