import express from 'express'
const router = express.Router()
import users from '../data/users.js'
import events from '../data/events.js';

import validation from '../validation.js'

// might not be needed
router
    .route('/')
    .get(async (req, res) => {
        if(req.session && req.session.user){
            return res.status(200).json(req.session);
        }
        res.json({Get: "/"})
    })

router.route('/signup')
    .get(async (req, res) => {
        res.json({Get: "/signup"})
    })
    .post(async (req, res) => {
        let {username, uid} = req.body;
        let createdUser = false;    
        console.log(req.body);
        // Validation
        try {
            username = validation.checkUsername(username);
            uid = validation.checkNotNull(uid);
        } catch(error) {
            console.log(error);
            return res.status(400).send(error)
        }
        // Create user
        try {
            createdUser = await users.createUser(username,uid)
            return res.status(200).send(createdUser);
        } catch(error) {
            console.log(error);
            return res.status(500).send(error)
        }
    });

router.route('/checkUsername')
    .post(async (req, res) => {
        let {username} = req.body;
        let usernameExists = false;
        // Validation
        try {
            username = validation.checkUsername(username);
        } catch(error) {
            console.log(error);
            return res.status(400).send(error);
        }
        // Check if username exists
        try {
            usernameExists = await users.checkUsernameUnique(username);
            return res.status(200).send(usernameExists);
        } catch(error) {
            console.log(error);
            return res.status(400).send(error);
        }
    });


router
    .route('/yourpage')
    .get(async (req, res) => {
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
    });


router
    .route('/updateAvailability')
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
        let uid = req.currentUser.uid;
        let user;
        try {
            user = await users.getUserByFirebaseId(uid);
        } catch (e) {
            console.log(e);
            res.status(500).json(e);
            return;
        }
        uid = user._id;
        console.log("uid",uid);
        let availability = req.body.attendee;
        console.log(req.body);
        availability._id=uid;
        try {
            console.dir(req.body,{depth:null});
            updatedEvent=await events.upsertAttendee(eventId,availability);
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
    });

router
    .route('/user/:id') 
    .get(async(req,res)=> {
        let userId=undefined;
        try{
            userId=validation.checkId(req.params.id)
        }
        catch(e){
            console.log(e)
            res.send(e)
            return
        }
        let user=undefined;
        try{
            user=await users.getUserByUID(userId)
        }
        catch(e){
            console.log(e)
            res.send(e)
            return
        }
        res.json(user)
        return;
    })
    .post(async(req,res) => {
        let userId=undefined; let picture=undefined;
        try{
            userId=validation.checkId(req.params.id)
            picture=validation.checkPicture(req.body.picture)
        }
        catch(e){
            console.log(e)
            res.send(e)
            return
        }
        let user=undefined;
        try{
            user=await users.setUserPicture(userId,picture)
        }
        catch(e){
            console.log(e)
            res.send(e)
            return;
        }
        res.json(user);
        return;
    })

router
    .route('/fireuser')
    .get(async(req,res) => {
        console.log("i am called")
        let uid=req.currentUser.uid
        let user=undefined;
        try{
            user=await users.getUserByFirebaseId(uid)
        }
        catch(e){
            console.log(e)
            res.send(e)
            return
        }
        console.log(user);
        res.json(user)
        return;
    })

export default router;