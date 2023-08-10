import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

/**
 * * ChatSchema
 * @description Chat model
 */
const ChatMessageSchema = new Schema({
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
    message_id: {
        type: String,
        unique:true,
        required: [true, 'Message id must not be empty'],
    },
    message: {
        type: String,
        required: [true, 'Message must not be empty'],
    },
    message_type: {
        type: Number,
        required: [true, 'Message type must not be empty'],
    },
    message_status: {
        type: Number,
        required: [true, 'Message status must not be empty'],
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    message_status: { type: Number, default: 1 },
}, { versionKey: false });

ChatMessageSchema.plugin(mongoosePaginate);

ChatMessageSchema.index({ sender: 'text' });

export const ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema);