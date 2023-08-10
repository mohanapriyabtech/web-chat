import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

/**
 * * ChatSchema
 * @description Chat model
 */
const ChatListSchema = new Schema({
    sender_id: {
        type: ObjectId,
        ref : "User",
        required: [true, 'sender must not be empty'],
    },
    receiver_id: {
        type: ObjectId,
        ref : "User",
        required: [true, 'receiver must not be empty'],
    },
    last_message: {
        type: String,
        required: [true, 'Message must not be empty'],
    },
    
    last_message_at: {
        type: String,
        required: [true, 'last Message time must not be empty'],
    },
    unread_message_count: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    message_status: { type: Number, default: 1 },
}, { versionKey: false });

ChatMessageSchema.plugin(mongoosePaginate);

ChatMessageSchema.index({ sender: 'text' });

export const ChatList = mongoose.model('ChatList', ChatListSchema)