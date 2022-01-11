const jwt = require("jsonwebtoken");
const User = require('../model/user')

const authenticate = async (req, res, next) => {
    try{ 
        const token = req.cookies.jwttoken;
        if(!token){
            console.log("token not found", token); 
        }
        const verifytoken = jwt.verify(token, `${process.env.SECRET_KEY}`);

        const rootUser = await User.findOne({_id:verifytoken._id, "tokens.token":token});

        if(!rootUser){
            res.status(401).send("User Not Found");
        }

        req.token = token;
        req.rootUser = rootUser;
        req.name = rootUser.name;
        req.userid = rootUser._id; 

        next();

    } catch (err) {
        res.status(401).send("Unauthorised : No Token Provided");
        console.log(err);
    }
}

module.exports = authenticate;