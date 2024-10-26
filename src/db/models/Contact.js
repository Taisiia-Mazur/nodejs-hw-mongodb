import { Schema, model } from "mongoose";

const contactShema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
     type: String,
        required: true,
},
email: { type: String,
        },
isFavourite: {
        type: Boolean,
        default: false,
    },
    contactType: {
        type: String,
        enum: ['work', 'home', 'personal'],
        required: true,
        default: 'personal',
    }

})

const contactCollection = model("contacts", contactShema);

export default contactCollection;
