
// schemas/user.js
import Joi from 'joi';
import passwordComplexity from 'joi-password-complexity'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const emailValidator = Joi.string().email()
const SALT_ROUNDS = 12;

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (value) {
                return emailValidator.validate(value).error == undefined
            },
            message: props => `${props.value} is not a correct email, please check again`
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate: {
            validator: function (value) {

                const result = passwordComplexity({
                    min: 6,
                    max: 30,
                    lowerCase: 1,
                    upperCase: 1,
                    numeric: 1,
                    requirementCount: 4
                }).validate(value)

                return result.error == undefined
            },
            message: props => `${props.value} should contain at least 1 lowercase, 1 uppercase, and 1 number`
        }
    },
});

userSchema.pre('save', async function preSave(next) {

    // อ้างอิงถึง document หรือ model ปัจจุบัน ทำให้เราสามารถเข้าถึง field ต่างๆ ของ document ปัจจุบันที่กำลังจะทำการ save ข้อมูลได้
    const user = this

    // ถ้ารหัสผ่านไม่ได้ถูกแก้ไข เราจะใช้ function next เพื่อเริ่มกระบวนการ save
    if(!user.isModified('password')) return next()

    // แต่ถ้าเป็นรหัสผ่านใหม่ (ในทีนี้รวมถึง user ที่กำลังจะถูกสร้างใหม่ด้วย) เราจะใช้ bcrypt ในการเข้ารหัส
    try {
        const hash = await bcrypt.hash(user.password, SALT_ROUNDS)

        // กำหนด password ที่เข้ารหัสแล้วลงไปใน model 
        user.password = hash

        // เรียกใช้ function next() เพ่ิอให้เริ่มขึ้นตอนการ save
        return next()
    } catch (error) {
        return next(error)
    }
})

userSchema.methods.comparePassword = async function comparePassword(candidate) {
    return bcrypt.compare(candidate, this.password)
}

const UserModel = mongoose.model('User', userSchema);

export default UserModel;