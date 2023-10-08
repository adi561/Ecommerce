const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/fero',{useNewUrlParser:true})


const db = mongoose.connection


db.once('open' ,  () =>{ console.log("Succesfully connected with MONGO DB")})
db.on('error' ,  () =>{console.log("Not connected with DATA BASE")})




module.exports =  db