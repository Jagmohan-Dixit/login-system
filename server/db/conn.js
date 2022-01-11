const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/merndb', {
    // useNewUrlParser:true,
    // useCreateIndex:true,
    // useUnifiedTopology:true,
    // useFindAndModify:false 
}).then(
    () =>{
        console.log("Database Connected Successful");
    }).catch((err) => {
        console.log(err);
    }
);