import { Router } from 'express';

import * as contactsControllers from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema, updateContactSchema } from '../validation/contacts.js';
import { authenticate } from '../middlewares/authenticate.js';

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(contactsControllers.getContactsController));

contactsRouter.get('/:id', isValidId, ctrlWrapper(contactsControllers.getContactByIdController));

contactsRouter.post('/', validateBody(createContactSchema), ctrlWrapper(contactsControllers.addContactController),
);

contactsRouter.patch('/:id', isValidId, validateBody(updateContactSchema), ctrlWrapper(contactsControllers.updateContactController),
);

contactsRouter.delete('/:id', isValidId, ctrlWrapper(contactsControllers.deleteContactController),
);


export default contactsRouter;
