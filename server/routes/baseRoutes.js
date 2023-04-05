const express=require('express')
const router=express.Router()
const path=require('path')
const users=require('../data/users')

const validation=require('../validation')

router
    .route('/')
    .get(async(req,res) => {
        if(req.session && req.session.user){
            res.json(req.session)
        }
        res.json({Get: "/"})
    })

router
    .route('/register')
    .get(async(req,res) => {
        res.json({Get: "/register"})
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
            // req.session.user={username:username, userId:check.userId}
        }
        res.send("Logged in")
    })

module.exports=router;