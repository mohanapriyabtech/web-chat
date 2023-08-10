import { responseHandler } from "../../../../utils/response-handler";
import { File } from "../models/fileupload-model";


class FileUpload {
    /**
     * @description API for File upload
     * @param {*} req
     * @param {*} res
     */
    async create(req, res) {
        try {
            const { files, body: { service = '' } } = req;
            if (!files || Object.keys(files).length === 0) {
                return responseHandler.errorResponse(res, {}, 'No files were uploaded.', 400);
            }

            if (!service) {
                return responseHandler.errorResponse(res, {}, 'Service field is required', 400);
            }

            const fileUploads = Array.isArray(files.media) ? files.media : [files.media];
            const uploadedFiles = await Promise.all(fileUploads.map(async (file) => {
                const fileType = getFileType(file.mimetype.split('/')[1]);
                if (fileType === 0) {
                    return responseHandler.errorResponse(res, {}, `File type "${file.mimetype}" is not supported.`, 400);
                }

                const name = `${file.md5}${Date.now()}.${file.name.split(".").pop()}`;
                const imageFolderName = new Date().valueOf();
                const uploadPath = `/var/www/html/${process.env.UPLOADS_PATH}/${service}/${imageFolderName}/${name}`;

                await file.mv(uploadPath);

                const url = `http://${process.env.MONGODB_HOST}/${process.env.UPLOADS_PATH}/${service}/${imageFolderName}/${name}`;
                await storeFile(url, fileType, service);

                return { name: file.name, url };
            }));

            return responseHandler.successResponse(res, uploadedFiles, 'Files uploaded successfully');
        } catch (err) {
            console.log(err);
            return responseHandler.errorResponse(res, err);
        }
    }
}

const getFileType = (extension) => {
    switch (extension) {
        case 'jpg':
        case 'png':
        case 'jpeg':
        case 'gif':
        case 'heic':
            return 'image';
        case 'mp3':
        case 'wav':
        case 'wave':
        case 'x-wav':
        case 'x-m4a':
            return 'audio';
        case 'mp4':
        case 'mov':
        case 'MOV':
            return 'video';
        case 'pdf':
        case 'doc':
        case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
        case 'msword':
            return 'file';
        default:
            return 0;
    }
};

const storeFile = async (file, fileType, service) => {
    const fileModel = new File({ file, file_type: fileType, service_type: service });
    try {
        const result = await fileModel.save();
        return result;
    } catch (error) {
        throw error;
    }
};

export default new FileUpload();
