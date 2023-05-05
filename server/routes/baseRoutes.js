import express from 'express'
const router = express.Router()
import users from '../data/users.js'

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
    .route('/logout')
    .get(async(req,res) => {
        if(!req.session.user) res.redirect ('/')
        req.session.destroy()
        res.redirect('/')
    });

export default router;