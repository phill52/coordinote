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
            return
        }
        res.json({Get: "/"})
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
    .route('/logout')
    .get(async(req,res) => {
        if(!req.session.user) res.redirect ('/')
        req.session.destroy()
        res.redirect('/')
    })

module.exports=router;