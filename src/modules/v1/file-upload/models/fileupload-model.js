import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

/**
 * File Upload Schema
 * @description FileUpload model
 */
const FileUploadSchema = new Schema({

    file: {
        type: String,
        required: true
    },
    file_type: {
        type: String,
        required: true
    },
    service_type: {
        type: String,
        required: true
    },
    resized_image: {
        type: Array
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, { timestamps: false });


export const File = mongoose.model('File', FileUploadSchema);