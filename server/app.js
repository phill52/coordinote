const express=require('express');
const app=express();
const session=require('express-session')
const configRoutes=require('./routes')
const connection=require('./config/mongoConnection')
const validation=require('./validation');
const events=require('./data/events');
const users=require('./data/users')

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

app.use('/yourpage',(req,res,next) => {
    if(!req.session.user){
        return res.redirect('/')
    }
    else{
        next()
    }
})

app.use('/yourpage/events/createEvent',async(req,res,next) => {
    next();
})

app.use('/yourpage/events/:eventId',async(req,res,next) => {
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

app.use('/yourpage/events',(req,res,next) => {
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

app.use('/login',(req,res,next) => {
    if(req.session.user){
        return res.redirect('/yourpage')
    }
    else{
        next()
    }
})

app.use('/register',(req,res,next) => {
    if(req.session.user){
        return res.redirect('/yourpage')
    }
    else{
        next();
    }
})

configRoutes(app)

const main=async() => {
    const db = await connection.dbConnection();
}

app.listen(3001, () => {
    console.log("Your routes are running on http://localhost:3001")
})
main()