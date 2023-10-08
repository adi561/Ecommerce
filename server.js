const express =require('express')
const req = require('express/lib/request')
const app=express()
const PORT=8124
const bodyParser=require("body-parser")
const MyRoutes=require('./Routes/UserRoute')
const AdminRoutes=require('./Routes/AdminRoutes')
const db=require('./DB/Db') 

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use('/',MyRoutes)
app.use('/admin',AdminRoutes)

app.listen(PORT, ()=>{
    console.log(`Server is running on PORT :${PORT}`)
})