const express = require('express');
const cors = require('cors');
const configRoutes = require('./routes');
const connection = require('./config/mongoConnection');
const path = require('path');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const decodeIDToken = require('./authenticateToken');
const dotenv = require('dotenv').config({path:'.env'}).parsed;

const app = express();

const main = async() => {
    const db = await connection.dbConnection();
    if (db === null) {
        console.log("Error: Cannot connect to database.");
        return;
    } else {
        console.log("Connected to database.");
    }
}
main()

app.use(cors());
app.use(express.json());
  
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
app.post('/user', createUser);

// protected route
app.get('/user', checkIfAuthenticated, async (req, res) => {
    try {
        const users = await admin.auth().listUsers();
        return res.status(200).send(users.users);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error });
    }
});


configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});