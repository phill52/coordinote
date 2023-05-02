import express from 'express'
const router=express.Router()
import users from '../data/users.js'
import events from '../data/events.js'
import validation from '../validation.js'
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";


const s3 = new S3Client({
    credentials:{
        accessKeyId: 'AKIA5CTX4VB2K6XBGQAI',
        secretAccessKey: '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'
    },
    region: 'us-east-1',
});


router
    .route('/')
    // .get(async(req,res) => {        //get events for a specific user
    //     if(req.session && req.session.user){
    //         let userEvents=undefined;
    //         let userId=undefined;
    //         try{
    //             userId=validation.checkId(req.session.user.userId)
    //             userEvents=await users.getUsersEvents(userId)
    //         }
    //         catch(e){
    //             res.send(e)
    //             return;
    //         }
    //         return res.json(userEvents)
    //     }
    //     res.json({Get: "/yourpage/events/"})
    // })

router
    .post('/imageTest', upload.single('image'), async (req, res) => {
        try {
            const fileBuffer = Buffer.from(req.body.file, "base64");
            const mimeType = req.body.mimeType;
            const fileName = `${Date.now().toString()}-${req.body.filename}`;
        
            const command = new PutObjectCommand({
                Bucket: process.env.S3_BUCKET,
                Key: fileName,
                Body: fileBuffer,
                ContentType: mimeType,
            });
        
            await s3.send(command);
            res.status(200).send("File uploaded successfully");
        } catch (error) {
            console.error(error);
            res.status(500).send("Error uploading file");
        }
        });
        


router
    .route('/createEvent')
    // .get(async(req,res) => {
    //     res.json({Get: "/yourpage/events/createEvent"})
    // })
    .post(upload.single('image'), async(req,res) => {           //events post route, when you make a new event
        if(!req.body) {res.sendStatus(400); return;}
        console.log(req.body)
        let newEvent=undefined; let userId=undefined;
       /* try{
            userId=validation.checkId(req.session.user.userId)
        }
        catch(e){
            console.log(e)
            return;
        }*/
        try{
            
            newEvent=await events.createEvent(req.body.name,req.body.domainDates,req.body.location,req.body.description,req.body.attendees,req.file.location,userId)
        }
        catch(e){
            console.log(e)
            res.json({"Error":`Could not create event: ${e}`}).status(400)
            return
        }
        res.json(newEvent)
        return;
    })

router
    .route('/:id')
    .get(async(req,res) => {       //   get     /yourpage/events/:id
        console.log('im here')
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
        res.json(event)
        return;
    })
    .patch(async(req,res) => {          //      patch /yourpage/events/:id
        let eventId=undefined; let userId=undefined;
        try{
            userId=validation.checkId(req.session.user.userId)
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
                req.body.domainDates,
                req.body.location,
                req.body.description,
                req.body.attendees,
                req.body.image,
                userId
            )
        }
        catch(e){
            console.log(e)
            res.send(e).status(400)
        }
        res.json(updatedEvent)
        return;
    })
    .delete(async(req,res) => {         //  delete      /yourpage/events/:id
        let eventId=undefined; let userId=undefined;
        try{
            userId=validation.checkId(req.session.user.userId)
            eventId=validation.checkId(req.params.id)
        }
        catch(e){
            console.log(e)
            res.json({Error:e}).status(400)
            return
        }
        try{
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