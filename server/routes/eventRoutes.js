import express from 'express'
const router=express.Router()
import users from '../data/users.js'
import events from '../data/events.js'
import validation from '../validation.js'
import aws from 'aws-sdk'
import multer from 'multer'
import dotenv from 'dotenv';
import {spawn} from 'child_process'
import fs from 'fs';
import sharp from 'sharp';

dotenv.config({path:'../.env'})
aws.config.update({
    secretAccessKey: process.env.AWS_secretkey,
    accessKeyId: process.env.AWS_keyid,
    region: process.env.AWS_region 
});
const s3 = new aws.S3();
const upload = multer({ dest: 'uploads/' });



router
.route('/bestTimes/:id')
.get(async (req,res)=>{
    console.log('/bestTimes/:id get')
    let eventId=undefined;
    try{
        eventId=validation.checkId(req.params.id)
    }
    catch(e){
        console.log(e)
        res.status(400).json({Error:e})
        return
    }
    let event=undefined;
    try{
        event=await events.getEventById(eventId)
    }
    catch(e){
        console.log(e)
        res.json({"Error retrieving event":e}).status(500)
        return
    }
    let bestTimes=undefined;
    try{
        bestTimes=await events.findCommonDates(event.attendees);
    }
    catch(e){
        console.log(e);
        res.json({"Error, did not properly recieve common dates":e}).status(500);
        return
    }
    res.status(200).json(bestTimes);
})

router
    .route('/myEvents')
    .get(async(req,res) => {        //get events for a specific user
        console.log('/myEvents get')
        let uid = req.currentUser.uid;
        let userEvents=undefined;
        let userId=undefined;
        let user=undefined;
        try {
            // console.log(uid)
            user = await users.getUserByFirebaseId(uid);
        } catch (e) {
            console.log(e);
            res.status(500).json(e);
            return;
        }
        uid = user._id;
        try{
            userId=validation.checkId(uid)
            userEvents=await users.getUsersEvents(uid)
        }
        catch(e){
            res.status(400).json(e)
            console.log(e)
            return;
        }
        // console.log(userEvents)
        return res.status(200).json(userEvents)
    })

    // Your existing imports...
    
    router.post('/imageTest', upload.single('image'), async (req, res) => {
        try {
            const imagePath = req.file.path;
            const resizedImagePath = `uploads/${Date.now().toString()}.jpg`;
    
            // Use sharp to resize the image
            await sharp(imagePath).resize(1920, 1080).toFile(resizedImagePath);
    
            const outputBuffer = fs.readFileSync(resizedImagePath);
            
            s3.upload({
                Bucket: 'coordinote',
                Key: Date.now().toString(),
                Body: outputBuffer,
                ContentType: 'image/jpg',
                ACL: 'public-read'
            }, (e, data) => {
                if (e) {
                    console.error(e);
                    res.status(500).json({Error: "not uploaded to S3"});
                } else {
                    res.status(200).json({imageUrl: data.Location});
                    fs.unlinkSync(req.file.path);
                    fs.unlinkSync(resizedImagePath);
                }
            });
    
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Server error' });
        }
    });
    
    router.post('/resizePFP', upload.single('image'), async (req, res) => {
        try {
            const imagePath = req.file.path;
            const resizedImagePath = `uploads/${Date.now().toString()}.jpg`;
    
            // Use sharp to resize the image
            await sharp(imagePath).resize(500, 500).toFile(resizedImagePath);
    
            const outputBuffer = fs.readFileSync(resizedImagePath);
            
            s3.upload({
                Bucket: 'coordinote',
                Key: Date.now().toString(),
                Body: outputBuffer,
                ContentType: 'image/jpg',
                ACL: 'public-read'
            }, (e, data) => {
                if (e) {
                    console.error(e);
                    res.status(500).json({Error: "not uploaded to S3"});
                } else {
                    res.status(200).json({imageUrl: data.Location});
                    fs.unlinkSync(req.file.path);
                    fs.unlinkSync(resizedImagePath);
                }
            });
    
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Server error' });
        }
    });
    


router
    .route('/createEvent')
    // .get(async(req,res) => {
    //     res.json({Get: "/yourpage/events/createEvent"})
    // })
    .post(upload.single('image'), async(req,res) => {           //events post route, when you make a new event
        console.log('/createEvent post')
        if(!req.body) {res.sendStatus(400); return;}
        // console.log(req.body)
        let newEvent=undefined; let userId=undefined;
       /* try{
            userId=validation.checkId(req.session.user.userId)
        }
        catch(e){
            console.log(e)
            return;
        }*/
        try{
            // console.log(req.currentUser.uid)
            let usr= await users.getUserByFirebaseId(req.currentUser.uid);

            // console.log(usr)
            newEvent=await events.createEvent(req.body.name, req.body.location, req.body.description, req.body.domainDates,
                req.body.image,usr._id);
        }
        catch(e){
            console.log(e)
            // console.log("here")
            res.json({"Error":`Could not create event: ${e}`}).status(400)
            return
        }
        res.status(200).json(newEvent)
        return;
    }, (error, req, res, next) => {
        console.log(error)
        return res.status(400).json({ error: error.message })
        });

router
    .route('/:id')
    .get(async(req,res) => {       //   get     /yourpage/events/:id
        console.log('/:id get')
        let eventId=undefined;
        try{
            eventId=validation.checkId(req.params.id)
        }
        catch(e){
            console.log(e)
            res.json({Error:e}).status(400)
            return
        }
        let event=undefined;
        try{
            event=await events.getEventById(eventId)
        }
        catch(e){
            console.log(e)
            res.json({"Error retrieving event":e}).status(500)
            return
        }
        res.status(200).json(event)
        return;
    })
    .patch(async(req,res) => {          //      patch /yourpage/events/:id
        console.log('/:id patch')
        let eventId=undefined; let userId=undefined;
        try{
            userId=validation.checkId(req.body.userId)
            eventId=validation.checkId(req.params.id)
        }
        catch(e){
            console.log(e)
            res.json({Error:e}).status(400)
            return
        }
        let updatedEvent=undefined;
        try{
            updatedEvent=await events.updateEvent(eventId,
                req.body.name,
                req.body.location,
                req.body.description,
                req.body.domainDates,
                req.body.attendees,
                req.body.image,
                userId
            )
        }
        catch(e){
            console.log(e)
            res.send(e).status(400)
        }
        res.status(200).json(updatedEvent)
        return;
    })
    .delete(async(req,res) => {         //  delete      /yourpage/events/:id
        let eventId=undefined; //let userId='6449858e039651db9d8beed2';
        console.log('/:id delete')
        // console.log(req.currentUser.uid)
        let usr= await users.getUserByFirebaseId(req.currentUser.uid);
        let userId = usr._id;
        try{
            //userId=validation.checkId(req.session.user.userId)
            eventId=validation.checkId(req.params.id)
        }
        catch(e){
            console.log(e)
            res.json({Error:e}).status(400)
            return
        }
        try{
            console.log("delete route")
            await events.deleteEvent(eventId,userId)
        }
        catch(e){
            console.log(e)
            res.send(e).status(500)
            return
        }
        res.json({deleted:true})
        return
    })

export default router;