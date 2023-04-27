//credit to https://javascript.plainenglish.io/lets-create-react-app-with-firebase-auth-express-backend-and-mongodb-database-805c83e4dadd
import firebase from 'firebase';
import dotenv from 'dotenv';
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASEapiKey,
  authDomain: process.env.REACT_APP_FIREBASEauthDomain,
  projectId: process.env.REACT_APP_FIREBASEprojectId,
  storageBucket: process.env.REACT_APP_FIREBASEstorageBucket,
  messagingSenderId: process.env.REACT_APP_FIREBASEmessagingSenderId,
  appId: process.env.REACT_APP_FIREBASEappId,
};

try {
  firebase.initializeApp(firebaseConfig);
} catch (err) {
  if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack);
  }
}
const fire = firebase;
export default fire;