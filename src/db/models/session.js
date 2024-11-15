import { Schema, model } from 'mongoose';
import { handleSaveError, updateHooks } from './hooks.js';

const sessionShcema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: { type: String, required: true },

    accessTokenValidUntil: { type: Date, required: true },
    refreshTokenValidUntil: { type: Date, required: true },
  },
  { versionKey: false, timestamps: true },
);
sessionShcema.post('save', handleSaveError);

sessionShcema.pre('findOneAndUpdate', updateHooks);

sessionShcema.post('findOneAndUpdate', handleSaveError);

const sessionCollection = model("session", sessionShcema);
export default sessionCollection;
