const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
    
const mySchema = new mongoose.Schema({
    name : {
        type:String,
        lowercase:true,
        trim:true,
        required:true
    },
    phoneno : {
        type:Number,
        maxlength: [13, "Phone Number length should not be greater than 13"],
        required:true
    },
    email : {
        type : String,
        maxlength : [30, "Email length should not be greater than 30"],
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    },
    date : {
        type: Date,
        default : Date.now
    },
    images : [
        {
            name : {
                type : String, 
                required : true
            },
            image : {
                type : String, 
                required : true
            }
        }
    ], 
    postmessage : [
        {
            postdata : {
                type : String,
                required : true
            }
        }
    ],
    messages : [ 
        {
            name : {
                type:String, 
                required:true
            },
            email : {
                type:String, 
                required:true
            },
            phoneno : {
                type:Number, 
                required:true
            },
            message : {
                type:String, 
                required:true
            }
        }
    ],
    tokens : [
        {
            token : {
                type : String,
                required : true
            }
        }
    ]
})

mySchema.methods.generateAuthToken = async function() {
    try {
        let token = jwt.sign({_id:this._id}, `${process.env.SECRET_KEY}`);
        this.tokens = this.tokens.concat({token : token});
        await this.save();
        return token;
    } catch (err) {
        console.log(err);
    }
}

//  storing the message

mySchema.methods.addMessage = async function(name, email, phoneno, message) {
    try{
        this.messages  = this.messages.concat({name, phoneno, email, message});
        await this.save();
        return this.messages;
    } catch (err) {
        console.log(err);
    }
}

// posting the post to database

mySchema.methods.addPost = async function(postdata) {
    try{
        this.postmessage  = this.postmessage.concat({postdata : postdata});
        await this.save();
        return this.postdata;
    } catch (err) {
        console.log(err);
    } 
}

// adding image data to database

mySchema.methods.addImage = async function(name, image) {
    try {
        this.images = this.images.concat({name:name, image:image});
        await this.save();
        return this.image;
    } catch (err) {
        console.log(err);
    }
}

const Mydocuments = new mongoose.model("user",mySchema);

module.exports = Mydocuments;

