import express from 'express'
const router = express.Router()
import users from '../data/users.js'
import events from '../data/events.js';

import validation from '../validation.js'

// might not be needed
router
    .route('/')
    .get(async (req, res) => {
        console.log('/ get')
        if(req.session && req.session.user){
            return res.status(200).json(req.session);
        }
        res.status(200).json({Get: "/"})
    })

router.route('/signup')
    .get(async (req, res) => {
        console.log('/signup get')
        res.status(200).json({Get: "/signup"})
    })
    .post(async (req, res) => {
        console.log('/signup post')
        let {username, uid} = req.body;
        let createdUser = false;    

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
        console.log('/checkUsername post')
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
        console.log('/yourpage get')
        let u=undefined;
        try{
            u=validation.checkId(req.session.user.userId)
        }
        catch(e){
            console.log(e)
            res.status(400).send(e)
            return
        }
        return res.status(200).json({User:"This is your page"})
    });


router
    .route('/updateAvailability')
    .post(async(req,res) => {
        console.log('/updateAvailability post')
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

        let availability = req.body.attendee;
        availability._id=uid;

        try {
            // console.dir(req.body,{depth:null});
            updatedEvent=await events.upsertAttendee(eventId,availability);
        }
        catch(e){
            console.log(e)
            res.status(500).send(e)
            return;
        }
        return res.status(200).json(updatedEvent);
    })

router
    .route('/logout')
    .get(async(req,res) => {
        console.log('/logout get')
        if(!req.session.user) res.status(400).redirect('/')
        req.session.destroy()
        res.status(200).redirect('/')
    });

router
    .route('/user/:id') 
    .get(async(req,res)=> {
        console.log('user/:id get')
        let userId=undefined;
        try{
            userId=validation.checkId(req.params.id)
        }
        catch(e){
            console.log(e)
            res.status(400).send(e)
            return
        }
        let user=undefined;
        try{
            user=await users.getUserByMongoId(userId)
        }
        catch(e){
            console.log(e)
            res.status(400).send(e)
            return
        }
        res.status(200).json(user)
        return;
    })
    .post(async(req,res) => {
        console.log('user/:id post')
        let userId=undefined; let {picture}=req.body;
        try{
            userId=validation.checkId(req.params.id)
            validation.checkImage(picture)
        }
        catch(e){
            console.log(e)
            res.status(400).send(e)
            return
        }
        let user=undefined;
        try{
            user=await users.setUserPicture(userId,picture)
        }
        catch(e){
            console.log(e)
            res.status(400).send(e)
            return;
        }
        res.status(200).json(user);
        return;
    })

router
    .route('/fireuser')
    .get(async(req,res) => {
        console.log("/fireuser get")
        let uid=req.currentUser.uid
        let user=undefined;
        try{
            user=await users.getUserByFirebaseId(uid)
        }
        catch(e){
            console.log(e)
            res.status(400).send(e)
            return
        }

        res.status(200).json(user)
        return;
    })

export default router;