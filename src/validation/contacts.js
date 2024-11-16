import Joi from 'joi';
import { typeList } from '../constants/contacts.js';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should have at least {#limit} characters',
    'string.max': 'Name should have at most {#limit} characters',
    'any.required': 'Name is required!',
  }),
  phoneNumber: Joi.string().min(11).max(14).required().messages({
    'string.min': 'Phone number should have at least {#limit} characters',
    'string.max': 'Phone number should have at most {#limit} characters',
    'any.required':
      'Phone number is required! Please enter you number at format "+380...',
  }),
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required!',
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .valid(...typeList)
    .required(),
  userId: Joi.string().required(),
});


export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(11).max(14),
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid(...typeList),
  userId: Joi.string(),
});
