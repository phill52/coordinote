const express=require('express')
const router=express.Router()
const path=require('path')

const validation=require('../validation')

router
    .route('/')
    .get(async(req,res) => {
        res.json({Get: "/"})
    })

module.exports=router;