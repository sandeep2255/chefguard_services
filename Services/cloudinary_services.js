const cloudinary = require('cloudinary').v2;
const config = require('../config/configuration.json');
const streamifier = require('streamifier');

class cloudinaryServices {

    /**
     * Configures the Cloudinary client with API credentials.
     * @returns {object} Cloudinary client instance.
     */
    static async cloudinaryConfig() {

        cloudinary.config({
            cloud_name: config.cloudName, 
            api_key: config.key, 
            api_secret: config.secret
        });

        return cloudinary;
    }

    /**
     * Uploads an image to Cloudinary.
     * @param {object} cloudinaryClient - The Cloudinary client instance.
     * @param {Buffer} imgBuffer - The image buffer to upload.
     * @param {string} fileName - The public ID for the uploaded image.
     * @returns {Promise} Resolves with the Cloudinary upload result or rejects with an error.
     */
    static async uploadFile(cloudinaryClient, imgBuffer, fileName, width,height) {
        return new Promise((resolve, reject) => {
            if (!imgBuffer || !Buffer.isBuffer(imgBuffer)) {
                return reject(new Error('Invalid image buffer.'));
            }

            if (!fileName || typeof fileName !== 'string') {
                return reject(new Error('Invalid file name.'));
            }

            const stream = cloudinaryClient.uploader.upload_stream(
                {
                    resource_type: 'image',
                    public_id: fileName,
                    width: width,
                    height: height,
                    crop: 'scale',
                },
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result);
                }
            );

            const bufferStream = streamifier.createReadStream(imgBuffer);
            bufferStream.pipe(stream);
        });
    }

    /**
     * Retrieves file metadata and URL from Cloudinary.
     * @param {object} cloudinaryClient - The Cloudinary client instance.
     * @param {string} publicId - The public ID of the file to retrieve.
     * @returns {string} The file URL if successful, or logs error if not.
     */
    static async getFileFromCloudinary(cloudinaryClient, publicId) {
        try {
            if (!publicId || typeof publicId !== 'string') {
                throw new Error('Invalid public ID.');
            }

            const result = await cloudinaryClient.api.resource(publicId);
            const { secure_url: fileUrl, format, width, height } = result;

            console.log(`File URL: ${fileUrl}, Format: ${format}, Dimensions: ${width}x${height}`);
            return fileUrl;
        } catch (error) {
            console.error('Error fetching file:', error);
            throw error; // Propagate the error so it can be handled by the caller
        }
    }

    /**
     * Deletes a file from Cloudinary by public ID.
     * @param {string} publicId - The public ID of the file to delete.
     * @returns {Promise} Resolves with the deletion result or rejects with an error.
     */
    static async deleteFile(cloudinaryClient, publicId) {
        return new Promise((resolve, reject) => {
            if (!publicId || typeof publicId !== 'string') {
                return reject(new Error('Invalid public ID.'));
            }

            cloudinaryClient.uploader.destroy(publicId, (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            });
        });
    }
}

module.exports = { cloudinaryServices };
