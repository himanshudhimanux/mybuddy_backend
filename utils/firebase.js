const admin = require('firebase-admin');
const serviceAccount = require('../mybuddy-3073a-firebase-adminsdk-fbsvc-5f76455842.json');


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
