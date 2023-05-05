import express from 'express'
const router=express.Router()
import users from '../data/users.js'
import events from '../data/events.js'
import validation from '../validation.js'
import aws from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'
import dotenv from 'dotenv';
dotenv.config({path:'../.env'})
aws.config.update({
    secretAccessKey: process.env.AWS_secretkey,
    accessKeyId: process.env.AWS_keyid,
    region: process.env.AWS_region 
});
const s3 = new aws.S3();
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'coordinote',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        },
        contentType: multerS3.AUTO_CONTENT_TYPE,
    })
})



router
.route('/bestTimes/:id')
.get(async (req,res)=>{
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
    let bestTimes=undefined;
    try{
        bestTimes=await events.findCommonDates(event.attendees);
    }
    catch(e){
        console.log(e);
        res.json({"Error, did not properly recieve common dates":e}).status(500);
        return
    }
    res.json(bestTimes);
})

router
    .route('/myEvents')
    .get(async(req,res) => {        //get events for a specific user
        let uid = req.currentUser.uid;
        let userEvents=undefined;
        let userId=undefined;
        let user=undefined;
        try {
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
        return res.json(userEvents)
    })
router
    .post('/imageTest',upload.single('image'),  async (req, res) => {
        console.log('i made it into the images')
        if (req.file) {
            return res.json({ imageUrl: req.file.location });
        }
    }, (error, req, res, next) => {
        console.log(error)
        return res.status(400).json({ error: error.message })
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
            newEvent=await events.createEvent(req.body.name,req.body.domainDates,req.body.location,req.body.description,
            req.body.attendees,req.body.image,req.currentUser.uid);
        }
        catch(e){
            console.log(e)
            res.json({"Error":`Could not create event: ${e}`}).status(400)
            return
        }
        res.json(newEvent)
        return;
    }, (error, req, res, next) => {
        console.log(error)
        return res.status(400).json({ error: error.message })
        });

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
        let eventId=undefined; let userId='6449858e039651db9d8beed2';
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