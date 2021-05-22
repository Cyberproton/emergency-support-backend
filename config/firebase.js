const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("./emergency-support-3d510-firebase-adminsdk.json");

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount)
});

module.exports = firebaseAdmin