import express from 'express';
const app=express();
import cors from 'cors';
import session from 'express-session'
import configRoutes from './routes/index.js'
import connection from './config/mongoConnection.js'
import validation from './validation.js';
import users from './data/users.js';
import events from './data/events.js'
import path from 'path'
import decodeIDToken from './authenticateToken.js';
import {fileURLToPath} from 'url';
import { Server } from 'socket.io';
import http from 'http';
  

const __filename = fileURLToPath(import.meta.url);
// import {initializeApp} from 'firebase/app';
// import { getAnalytics } from "firebase/analytics";
// import {getAuth} from 'firebase/auth';
// import {getFirestore} from 'firebase/firestore';
// import {initializeApp} from 'firebase/app';
// import { getAnalytics } from "firebase/analytics";
// import {getAuth} from 'firebase/auth';
// import {getFirestore} from 'firebase/firestore';


import admin from 'firebase-admin';
// import {initializeApp} from 'firebase/app';
// import { getAnalytics } from "firebase/analytics";
// import {getAuth} from 'firebase/auth';
// import {getFirestore} from 'firebase/firestore';

  
// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const __dirname=path.dirname(__filename)
app.use(cors())
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

/*app.use('/api/yourpage',(req,res,next) => {
    if(!req.session.user){
        return res.redirect('/')
    }
    else{
        next()
    }
})*/

app.use('/api/yourpage/events/imageTest',async(req,res,next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Custom-Header');
    next();
})

app.use('/api/yourpage/events/createEvent',async(req,res,next) => {
    next();
})

app.use('/api/yourpage/events/:eventId',async(req,res,next) => {
    // if(!req.session.user){
    //     return res.redirect('/')
    // }
  //  console.dir(req.headers,{depth:null})
   // console.log('im in the app');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Custom-Header');


    let eventId=req.params.eventId
    //let userId=req.session.user.userId
    try{        //user and event id need to be checked separately
      //  userId=validation.checkId(userId)
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
       // if(event.creatorID.toString()!=userId.toString()){
        //    console.log("You do not own that event")
          //  return res.redirect('/yourpage/events')
      //  }
    }
    next();
})

app.use('/api/yourpage/events/myEvents/:userId',async (req,res,next)=>{
    //console.dir(req.headers,{depth:null})
    //console.log(req.body)
    //console.log('im in the app');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Custom-Header');
    next();
})

// app.use('/api/yourpage/events',(req,res,next) => {
//     // if(!req.session.user){
//     //     return res.redirect('/')
//     // }
//     let userId=req.session.user.userId
//     try{
//         userId=validation.checkId(userId)
//     }
//     catch(e){
//         console.log(e)
//     }
//     next()
// })

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

// https://stackoverflow.com/questions/27117337/exclude-route-from-express-middleware
var unless = function(path, middleware) {
    return function(req, res, next) {
        if (path === req.path) {
            return next();
        } else {
            return middleware(req, res, next);
        }
    };
};
// Initialize Firebase, unless signup
app.use(unless('/api/signup', decodeIDToken));

const getAuthToken = (req, res, next) => {
    if (req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer') {
        req.authToken = req.headers.authorization.split(' ')[1];
    } else {
        req.authToken = null;
    }
    next();
};

// Create firebase user
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

// create a new firebase user
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

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

const main = async() => {
    const db = await connection.dbConnection();
}

const server = http.createServer(app);
let io = new Server(server);


io.on('connection', async (socket) => {
    console.log('new client connected', socket.id);
  
    socket.on('user_join', async (name, room) => {
      console.log('A user joined their name is ' + name);
      console.log('The user joined room ' + room);
      socket.join(room);
      // socket.broadcast.emit('user_join', name);
      let evnt = await events.getEventById(room);
      let tempArr= evnt.chatLogs;
      io.to(room).emit('user_join', tempArr);
    });
  
    socket.on('message', async ({name, message, room}) => {
      console.log(name, message, room, socket.id);
      let evnt = await events.getEventById(room);
      let tempArr= evnt.chatLogs;
      tempArr=[...tempArr,{name:name, message:message}];
      let noErr=true;
      try{
      await events.updateChatLogs(room,tempArr);
      console.log('hi')
      }
      catch(e){
        noErr=false
      }
      if(noErr){

      io.to(room).emit('message', {name:name, message:message});
      console.log('no error')
      }
      else{
        io.to(room).emit('message',{name,message})
        console.log('error');
      }
    });
  
    socket.on('disconnect', () => {
      console.log('Disconnect Fired');
    });
  });

server.listen(3001, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3001');
});

main()
