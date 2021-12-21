
// schemas/user.js

import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;