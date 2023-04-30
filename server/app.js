import express from 'express';
const app=express();
import session from 'express-session'
import configRoutes from './routes/index.js'
import connection from './config/mongoConnection.js'
import validation from './validation.js';
import events from './data/events.js';
import path from 'path'
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
import {initializeApp} from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBvQFCYXieHigezCeHgi9wSHSir05uSiIE",
    authDomain: "coordinote-5ff91.firebaseapp.com",
    projectId: "coordinote-5ff91",
    storageBucket: "coordinote-5ff91.appspot.com",
    messagingSenderId: "571076300379",
    appId: "1:571076300379:web:a30a91a731e83a7f0e797e",
    measurementId: "G-WRRBZPTJG5"
};
  
// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const __dirname=path.dirname(__filename)
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(            //authentication middleware
    session({
        name:'AuthCookie',
        secret: "Oh the middleware, everybody wants to be my checkId",
        resave: false,
        saveUninitialized: true,
        cookie: {maxAge: 1800000}
    })
)

app.use('/api/yourpage',(req,res,next) => {
    if(!req.session.user){
        return res.redirect('/')
    }
    else{
        next()
    }
})

app.use('/api/yourpage/events/createEvent',async(req,res,next) => {
    next();
})

app.use('/api/yourpage/events/:eventId',async(req,res,next) => {
    // if(!req.session.user){
    //     return res.redirect('/')
    // }
    let eventId=req.params.eventId
    let userId=req.session.user.userId
    try{        //user and event id need to be checked separately
        userId=validation.checkId(userId)
    }
    catch(e){
        console.log(e)
    }
    try{
        eventId=validation.checkId(eventId)
    }
    catch(e){
        next()
        return
    }
    let event=undefined;
    if(req.method!='GET'){      //if not just a get request, we need to check who owns the event
        try{
            event=await events.getEventById(eventId)
        }
        catch(e){
            console.log(e)
            return res.json(e)
        }
        if(event.creatorID.toString()!=userId.toString()){
            console.log("You do not own that event")
            return res.redirect('/yourpage/events')
        }
    }
    next();
})

app.use('/api/yourpage/events',(req,res,next) => {
    // if(!req.session.user){
    //     return res.redirect('/')
    // }
    let userId=req.session.user.userId
    try{
        userId=validation.checkId(userId)
    }
    catch(e){
        console.log(e)
    }
    next()
})

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
app.use(cors)
configRoutes(app)

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

const main=async() => {
    const db = await connection.dbConnection();
}

app.listen(3001, () => {
    console.log("Your routes are running on http://localhost:3001")
})
main()