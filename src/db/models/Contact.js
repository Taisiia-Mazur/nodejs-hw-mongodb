import { Schema, model } from 'mongoose';
import { typeList } from '../../constants/contacts.js';
import { handleSaveError, updateHooks } from './hooks.js';

const contactShema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: { type: String },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: typeList,
      required: true,
      default: 'personal',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    photo: {
      type: String,
    },
    },
  { versionKey: false, timestamps: true },
);


contactShema.post('save', handleSaveError);

contactShema.pre('findOneAndUpdate', updateHooks);

contactShema.post('findOneAndUpdate', handleSaveError);

export const sortByList = [
  'name',
  'phoneNumber',
  'email',
  'isFavourite',
  'contactType',
];

const contactCollection = model('contacts', contactShema);

export default contactCollection;
