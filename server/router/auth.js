const express = require("express");
const router = express.Router();
const User = require('../model/user');
// const jwt = require('jsonwebtoken');
const authenticate = require("../middleware/authenticate");

// connecting to database
require('../db/conn');


// Posting Data to Database using Register Route


router.post('/register', async (req, res) => {
    const { name , email, phoneno, password, confirmpassword } = req.body;
    
    if(!name || !email || !phoneno || !password || !confirmpassword)
    {
        return res.status(421).json({error : "Please Filled All the Fields"});
    }
    try{
            const userExist = await User.findOne({email : email});
            const userExist1 = await User.findOne({phoneno : phoneno});

            if(userExist || userExist1) {
                return res.status(422).json({error : "User Already Exists"});
            } else if (password.length < 8){
                return res.status(423).json({error : "Password should have min length of 8 characters"});
            } else if (password !== confirmpassword) {
                return res.status(420).json({error : "Passwords are not Matching"});
            } else {
                const user = new User({name, phoneno, email, password, confirmpassword});
                await user.save();
                return res.status(201).json({message : "User Registered Successfully"});
            }
    } catch(err) { console.log(err); }
});

// checking login details if they exist or not in database

router.post('/signin', async (req, res) => {
    try{
        const { email, password } = req.body; 
        
        if(!email || !password) {
            return res.status(400).json({error : "Please Filled All the Fields"});
        }

        const userlogin = await User.findOne({email : email});

        if(userlogin) {
            const token = await userlogin.generateAuthToken(); 
            res.cookie("jwttoken", token, {  
                expires:new Date(Date.now() + 25892000000), 
                httpOnly:true 
            });
            if(password === userlogin.password){
                console.log("password match");
                res.json({message : "User Login Successfully"}); 
            } else { 
                res.status(402).json({error : "Wrong Password"});
            } 
        } else {
                res.status(401).json({error : "Invalid Details"})
            }
    } catch (err) {
        console.log(err);
    }
})

// Contact Us Page 

router.get('/getdata', authenticate, async (req, res) => {
    console.log("Hello Mycontact");
    res.send(req.rootUser);
})


router.post('/contact', authenticate, async (req, res) => {
    try{
        const { name, email, phoneno, message } = req.body; 
        
        if(!email || !name || !phoneno || !message) {
            console.log("Please Filled All the Fields");
            return res.status(400).json({error : "Please Filled All the Fields"});
        }

        const userContact = await User.findOne({_id : req.userid});

        if(userContact) {
            
            const userMessage = await userContact.addMessage(name, email, phoneno, message);

            await userContact.save(); 

            res.status(201).json({message : "Message Sent Successfully"});
            } else {
               res.status(401).json({error : "Invalid Credentials"})
            }
        } catch (err) {
        console.log(err);
    }
})

// sending post data to database

router.post('/postdata', authenticate, async(req, res) => {

    try{ 
        const {postmessage} = req.body;  
        console.log(postmessage); 
        if(!postmessage){ 
            return res.status(600).json({error : "Post can't be empty"});
        }

        const useridVerify = await User.findOne({_id : req.userid})

        if(useridVerify){

            const userPost = await useridVerify.addPost(postmessage);

            await useridVerify.save();
            console.log("posting post data");

            res.status(602).json({message : "Posted Successfully"});
        } else {
            res.status(601).json({error : "User Not Found"});
        } 
    } catch (err) {
            console.log(err);
        }
})

router.post('/uploadimage', authenticate, async(req, res) => {

    try {
        const {image} = req.body;

        if(!image) {
            res.status(600).json({error : "Insufficient data"});
        }
        const useridVerify = await User.findOne({_id : req.userid})
        const name = req.name;
        if(useridVerify) {
            const userPost = await useridVerify.addImage(name, image);

            await useridVerify.save();
            console.log("posting image data");

            res.status(602).json({message : "Posted Successfully"});
        } else {
            res.status(601).json({error : "User Not Found"});
        } 

    } catch (err) {
        console.log(err);
    }
})

// About us Page

router.get('/about', authenticate, async (req, res) => {
    console.log("Hello Myabout");
    res.send(req.rootUser);
});
    
router.get('/home', (req, res) => {
    console.log("Hello MyHome");
    res.send(req.rootUser);
})

router.get('/logout', (req, res) => {
    console.log("Hello Logout");
    res.clearCookie('jwttoken', {path:'/'});
    res.status(200).send("User Logout Successfully");
});



module.exports = router;