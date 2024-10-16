const FirebaseStorage = require('multer-firebase-storage');
const fbAdmin = require('./firebase.config');
const serviceCredentials = require('/etc/secrets/e-commerce-backend-domination-firebase-adminsdk-2wrl3-6a8af59979.json');
const multer = require('multer');
const storage = FirebaseStorage({
    bucketName: 'e-commerce-backend-domination.appspot.com',
    credentials: fbAdmin.credential.cert(serviceCredentials),
    unique: true,
    public: true
})

const upload = multer({
    storage: storage
})


module.exports = upload;