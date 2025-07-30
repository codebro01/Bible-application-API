const mongoose = require('mongoose')
import type { Document } from 'mongoose'
const validator = require('validator')
const bcryptjs = require('bcryptjs')

export interface UserDocument extends Document {
  username: string
  email: string
  password: string
  role?: string[]
  verified?: boolean
}

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'username is required'],
      minlength: [3, 'Name must be at least 3 characters'],
      maxlength: [50, 'Name must not exceed 50 characters'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: 'Please provide a valid email address',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Hide it by default
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

UserSchema.pre('save', async function (this: UserDocument) {
  if (this.isModified('password')) {
    const salt = await bcryptjs.genSalt(10)
    this.password = await bcryptjs.hash(this.password, salt)
  }
})

UserSchema.methods.comparePwd = async function (userPwd: string) {
  const compare = bcryptjs.compare(userPwd, this.password)
  return compare
}
UserSchema.methods.compareRefreshToken = async function (refreshToken: string) {
  const compare = bcryptjs.compare(refreshToken, this.refreshToken)
  return compare
}

const User = mongoose.model('User', UserSchema)

module.exports = User

