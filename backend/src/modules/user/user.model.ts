import { Schema, model } from "mongoose"
import bcrypt from "bcrypt"

export enum userRole {
    USER = "USER",
    ADMIN = "ADMIN"
}

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        select: false
    },
    role: {
        type: String,
        enum: Object.values(userRole),
        default: userRole.USER
    },
    emailVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return
    }
    this.password = await bcrypt.hash(this.password, 8)
})
export const User = model('User', userSchema)