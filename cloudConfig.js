//Requiring cloudinary + multer-storage-cloudinary packages
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

//Configuring cloudinary with credentials (It is used to connect the third party service (i.e cloudinary) to the backend which is written in node.js)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET
});

//Creating a storage path where files will be stored
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "RoamScape_DEV",
        allowedFormats: ["png", "jpg", "jpeg"]
    },
});

module.exports = { cloudinary, storage };