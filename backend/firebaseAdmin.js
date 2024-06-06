const admin = require('firebase-admin');
const serviceAccount = require('C:/Users/Enoch Cobbina/Desktop/mern-firebase-auth/backend/firebaseServiceAccount.json');

// Check if Firebase Admin has been initialized, if not, initialize it
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

module.exports = admin;
