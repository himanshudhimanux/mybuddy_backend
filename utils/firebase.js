const admin = require('firebase-admin');
const serviceAccount = require('../config/google-services.json'); // adjust path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
