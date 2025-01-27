const cloudinary = require('cloudinary').v2;
const {
    CloudinaryStorage
} = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:"diytyjnla", // Replace with your Cloudinary cloud name
    api_key:"555319435542324", // Replace with your Cloudinary API key
    api_secret:"jv1VUCLK8c7P_kpyuv4h_pxeomc", // Replace with your Cloudinary API secret
});
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder:'template_uploads', // Replace with your desired folder name in Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    },
});

const upload = require('multer')({
    storage
});

module.exports = {
    upload
};