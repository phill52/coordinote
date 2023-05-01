import express from 'express'
const router=express.Router()
import users from '../data/users.js'
import events from '../data/events.js';

import validation from '../validation.js'

router
    .route('/')
    .get(async(req,res) => {
        if(req.session && req.session.user){
            res.json(req.session)
            return
        }
        res.json({Get: "/"})
    })

router
    .route('/signup')
    .get(async(req,res) => {
        res.json({Get: "/signup"})
    })
    .post(async(req,res) => {
        let createdUser=false;
        try{
            let username=validation.checkUsername(req.body.username);
            let password=validation.checkPassword(req.body.password,false);
            createdUser=await users.createUser(username,password)
        }
        catch(e){
            res.status(400).send(e)
            console.log(e);
            return;
        }
        if(!createdUser){
            res.status(500).send("Internal server error (POST /register");
            return
        }
        res.send("Account created")
    })

router
    .route('/login')
    .get(async(req,res) => {
        res.json({Get: "/login"})
        return
    })
    .post(async (req,res) => {          //  logging in
        let check=false
        let username=false; let password=false;
        try{
            username=validation.checkUsername(req.body.username)
            password=validation.checkPassword(req.body.password,true)
            check=await users.checkUser(username,password)
        }
        catch(e){     //if the user puts in bad data
            res.status(400).send(e)
            console.log(e)
            return
        }
        if(!check.authenticatedUser){
            res.status(500).send("Internal Server Error (POST /login)")
            return
        }
        if(check.authenticatedUser){
            req.session.user={username:username, userId:check.userId}
            res.redirect('/yourpage')
        }
    })

router
    .route('/yourpage')
    .get(async(req,res) => {
        let u=undefined;
        try{
            u=validation.checkId(req.session.user.userId)
        }
        catch(e){
            console.log(e)
            res.send(e)
            return
        }
        return res.json({User:"This is your page"})
    })

router
    .route('/api/updateAvailability')
    .post(async(req,res) => {
        let eventId=undefined; let updatedEvent=undefined;
        try{
            eventId=validation.checkId(req.body.eventId)
        }
        catch(e){
            console.log(e)
            res.status(400).send(e)
            return;
        }
        try {
            console.dir(req.body,{depth:null});
            updatedEvent=await events.upsertAttendee(eventId,req.body.attendee)
        }
        catch(e){
            console.log(e)
            res.status(500).send(e)
            return;
        }
        return res.json(updatedEvent);
    })

router
    .route('/logout')
    .get(async(req,res) => {
        if(!req.session.user) res.redirect ('/')
        req.session.destroy()
        res.redirect('/')
    })

export default router;