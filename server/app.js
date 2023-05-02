import express from 'express';
const app=express();
import cors from 'cors';
import session from 'express-session'
import configRoutes from './routes/index.js'
import connection from './config/mongoConnection.js'
import validation from './validation.js';
import events from './data/events.js';
import path from 'path'
import decodeIDToken from './authenticateToken.js';
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
import {initializeApp} from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

const __dirname=path.dirname(__filename)
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

const main = async() => {
    const db = await connection.dbConnection();
    if (db === null) {
        console.log("Error: Cannot connect to database.");
        return;
    } else {
        console.log("Connected to database.");
    }
}

app.use(cors());
app.use(express.json());


app.use('/api/login',(req,res,next) => {
    if(req.session.user){
        return res.redirect('/yourpage')
    }
    else{
        next()
    }
})

app.use('/api/register',(req,res,next) => {
    if(req.session.user){
        return res.redirect('/yourpage')
    }
    else{
        next();
    }
})

// Initialize Firebase
app.use(decodeIDToken);

const getAuthToken = (req, res, next) => {
    if (req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer') {
        req.authToken = req.headers.authorization.split(' ')[1];
    } else {
        req.authToken = null;
    }
    next();
};

const createUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await admin.auth().createUser({
            email: email,
            password: password,
        });
        console.log(user);
        return res.status(200).send(user);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error });
    }
};

const checkIfAuthenticated = (req, res, next) => {
    getAuthToken(req, res, async () => {
        try {
        const { authToken } = req;
        const userInfo = await app
            .auth()
            .verifyIdToken(authToken);
        req.authId = userInfo.uid;
        return next();
        } catch (e) {
        return res
            .status(401)
            .send({ error: 'You are not authorized to make this request' });
        }
    });
};

// create a new user
app.post('/api/user', createUser);

// protected route
app.get('/api/user', checkIfAuthenticated, async (req, res) => {
    try {
        const users = await admin.auth().listUsers();
        return res.status(200).send(users.users);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error });
    }
});

configRoutes(app);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

app.listen(3001, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3001');
});

main()
