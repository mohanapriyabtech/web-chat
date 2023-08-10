import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

/**
 * UserSchema
 * @description User model
 */

const UserSchema = new Schema({

    name: {
        type: String,
        required: [true, 'name must not be empty'],
    },
    email: {
        type: String,
        required: [true, 'email must not be empty'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'password must not be empty'],
    },
    phone_number: {
        type: Number
    },
    is_online: {
        type: Boolean
    },
    last_online_at: {
        type: Date,
        default: Date.now 
    },
    auth_token: {
        type: String
    },
    fcm_device_token: {
        type: String
    },
    profile_picture: {
        type: String,
        required: [true, 'Profile picture must not be empty'],
    },
    email_verified: {
        type: Number,
        default: 0
    },
    contacts: [ObjectId],
    blocked: [ObjectId],
    status: {
        type: Number,
        default: 1
    },
    created_at: {
        type: Date,
        default: Date.now
    }

}, { versionKey: false });

// UserSchema.plugin(mongoosePaginate);

// UserSchema.index({ name: 'text' });

export const User = mongoose.model('User', UserSchema);