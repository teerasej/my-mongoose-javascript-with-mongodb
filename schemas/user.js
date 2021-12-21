
// schemas/user.js

import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;