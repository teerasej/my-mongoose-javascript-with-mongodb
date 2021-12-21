
// schemas/user.js

import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate: {
            validator: function (value) {

                return value == '123456'
            },
            message: props => `${props.value} is not 123456`
        }
    },
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;