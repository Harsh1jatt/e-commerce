const fbAdmin = require('firebase-admin')
const serviceCredentials = require('../etc/secrets/e-commerce-backend-domination-firebase-adminsdk-2wrl3-6a8af59979.json');


fbAdmin.initializeApp({
    credential: fbAdmin.credential.cert(serviceCredentials),
    storageBucket: 'e-commerce-backend-domination.appspot.com'
})


module.exports = fbAdmin;