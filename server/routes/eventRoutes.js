const express=require('express')
const router=express.Router()
const usersFunctions=require('../data/users')
const events=require('../data/events')
const validation=require('../validation')

router
    .route('/')
    .get(async(req,res) => {
        if(req.session && req.session.user){
            res.json(req.session)
        }
        res.json({Get: "/events/"})
    })

router
    .route('/createEvent')
    .get(async(req,res) => {
        res.json({Get: "/events/createEvent"})
    })
    .post(async(req,res) => {           //events post route, when you make a new event
        if(!req.body) {res.sendStatus(400); return;}
        let name,location,dates,participants=undefined; 
        let newEvent=undefined; let userId=undefined;
        try{
            // userId=validation.checkId(req.session.user.userId)
        }
        catch(e){
            console.log(e)
            return;
        }
        try{
            newEvent=await events.createEvent(req.body.name,req.body.location,req.body.participants,req.body.dates,req.body.timeRange,userId)
        }
        catch(e){
            console.log(e)
            res.json({"Error":`Could not create event: ${e}`}).status(400)
            return
        }
        res.json(newEvent)
        return;
    })

module.exports = router;