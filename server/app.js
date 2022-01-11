const authenticate = require("./middleware/authenticate");
const express = require("express");
const app = express(); 
const PORT = process.env.PORT || 5000;
const cookieparser = require("cookie-parser");


require("dotenv").config();


app.use(cookieparser());

// it will understand the json data to our application
app.use(express.json());


// it will work for route's authentication
app.use(require('./router/auth'));


// for connecting to port number PORT
app.listen(PORT, () => {
    console.log(`server is running at port no ${PORT}`);
});


app.get('/userdata', authenticate, async (req, res) => {
    const data = await req.rootUser;
    console.log(data.name);
    check = data;
    res.send(data); 
})

// app.get('/api', (req,res) => {
    
//     fetch('/getdata')
//     .then(response => response.json())
//     .then(data => {res.send(data);
//     })
// })