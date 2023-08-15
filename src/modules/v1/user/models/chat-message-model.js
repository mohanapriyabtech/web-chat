import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

/**
 * * ChatSchema
 * @description Chat model
 */
const ChatMessageSchema = new Schema({
    sender: {
        type: ObjectId,
        ref : "User",
        required: [true, 'sender must not be empty'],
    },
    receiver: {
        type: ObjectId,
        ref : "User",
        required: [true, 'receiver must not be empty'],
    },
    message_id: {
        type: String,
        required: [true, 'message id must not be empty'],
    },
    message: {
        type: String,
        required: [true, 'Message must not be empty'],
    },
    message_type: {
        type: Number,
        required: [true, 'Message type must not be empty'],
    },
    event: {
        type: String
    },
    message_status: { 
        type: Number, 
        default: 1 
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    
}, { versionKey: false });

ChatMessageSchema.plugin(mongoosePaginate);

ChatMessageSchema.index({ sender: 'text' });

export const ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema);