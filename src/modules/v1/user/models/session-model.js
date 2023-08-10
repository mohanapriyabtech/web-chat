import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

/**
 * User schema
 */

const SessionSchema = new Schema({

    user_id: {
        type: ObjectId,
        ref: 'user',
        required: true
    },
    session_token: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: 1
    },
    created_at: {
        type: Date,
        default: Date.now
    }

}, { versionKey: false });

export const Session = mongoose.model('session', SessionSchema);