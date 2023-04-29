//credit to https://javascript.plainenglish.io/lets-create-react-app-with-firebase-auth-express-backend-and-mongodb-database-805c83e4dadd
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASEapiKey,
  authDomain: process.env.REACT_APP_FIREBASEauthDomain,
  projectId: process.env.REACT_APP_FIREBASEprojectId,
  storageBucket: process.env.REACT_APP_FIREBASEstorageBucket,
  messagingSenderId: process.env.REACT_APP_FIREBASEmessagingSenderId,
  appId: process.env.REACT_APP_FIREBASEappId,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };