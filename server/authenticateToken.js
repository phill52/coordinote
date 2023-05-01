const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const dotenv = require('dotenv').config({path:'.env'}).parsed;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: dotenv.DB_URL,
    apiKey: dotenv.REACT_APP_FIREBASEapiKey,
    authDomain: dotenv.REACT_APP_FIREBASEauthDomain,
    projectId: dotenv.REACT_APP_FIREBASEprojectId,
    storageBucket: dotenv.REACT_APP_FIREBASEstorageBucket,
    messagingSenderId: dotenv.REACT_AP_FIREBASEmessagingSenderId,
    appId: dotenv.REACT_APP_FIREBASEappId,
    measurementId: dotenv.REACT_APP_FIREBASEmeasurementId
});

async function decodeIDToken(req, res, next) {
    const header = req.headers.authorization;
    if (header !== 'Bearer null' && req.headers.authorization.startsWith('Bearer ')) {
        const idToken = req.headers.authorization.split('Bearer ')[1];
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            req['currentUser'] = decodedToken;
        } catch (err) {
            console.log(err);
        }
    }
    next();
}

module.exports = decodeIDToken;