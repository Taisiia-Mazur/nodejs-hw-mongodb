import { Schema, model } from 'mongoose';
import { handleSaveError, updateHooks } from './hooks.js';
import { emailRegexp } from '../../constants/users.js';

const userShema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: emailRegexp,
      unique: true,
      required: true,
    },
    password: { type: String, required: true },
  },
  { versionKey: false, timestamps: true },
);

userShema.post('save', handleSaveError);

userShema.pre('findOneAndUpdate', updateHooks);

userShema.post('findOneAndUpdate', handleSaveError);

const userCollection = model('user', userShema);

export default userCollection;
