
const UserSchema=require('../Schemas/Users')
const bcrypt=require('bcrypt')
const nodemailer=require("nodemailer");
const OtpSchema = require('../Schemas/Otp');
const ProductSchema = require('../Schemas/Products');
const { response } = require('express');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: "arava16543s.jaipur2@kvsrojaipuronline.in",
      pass: "ystgmvnggxujqjkt",
    },
  });
  
  

exports.getForm = (req,res)=>{
    res.send(
        `

        <form method='POST' action='/test'>
            <input placeholder="Enter the name" name='name'/>
            <input placeholder="Enter the email" name='email'/>
            <input placeholder="Enter the mobile" name='mobile'/>
            <input placeholder="Enter the password" type='password' name='password'/>
            <button type='submit'>Check it !</button>
        </form>
        `

    )
}

exports.verifyOtpAndChangePassword = (req,res)=>{
    const{email,otp,new_pass} = req.body

    UserSchema.find({email : email}).then((r1)=>{
        if(r1.length > 0)
        {
            OtpSchema.find({email : email}).then((r2)=>{
                if(r2.length > 0)
                {
                    if(r2[0].otp == otp)
                    {
                        let t = Number(new Date())
                        let temp = (t-Number(r2[0].time))/1000
                        if(temp > 30)
                        {
                            res.status(400).send({status : 400, message : "OTP has been Expired || PLease Generate Again"})   
                        }
                        else
                        {
                            bcrypt.genSalt(10,function(err,salt){
                                if(err)
                                {
                                    res.status(500).send({status : 500, message : "Something Went Wrong"})   
                                }
                                else
                                {
                                    bcrypt.hash(new_pass,salt,function(err,hash){
                                        if(err)
                                        {
                                            res.status(500).send({status : 500, message : "Something Went Wrong"})   
                                        }
                                        else
                                        {
                                            UserSchema.updateOne({email : email},{$set : {password : hash}}).then((r3)=>{
                                                if(r3.modifiedCount==1)
                                                {
                                                    OtpSchema.deleteOne({email : email}).then((r4)=>{
                                                        if(r4.deletedCount == 1)
                                                        {
                                                            transporter.sendMail({
                                                                from: '"Node-Web 👻" <arava16543s.jaipur2@kvsrojaipuronline.in>', // sender address
                                                                to:  email, // list of receivers
                                                                subject: "Password Changed ✔", // Subject line
                                                                text: "Hello" + r1[0].name, // plain text body
                                                                html: "<h2>Your password has changed just now 👻</h2>", // html body
                                                              }).then((m_res)=>{
                                                                 if(m_res.messageId)
                                                                    {
                                                                        res.status(200).send({status : 200, message : "Password has Changed Succesfully"}) 
                                                                    }
                                                                    else
                                                                    {
                                                                        res.status(400).send({status : 400,message:"Something Went Wrong|| Please try again"})   
                                                                    }
                                                                }).catch((err)=>{
                                                                res.status(400).send({status : 400,message:"Something Went Wrong|| Please try again"})
                                                              })
                                                            res.status(200).send({status : 200, message : "Password has Changed Succesfully"}) 
                                                        }
                                                        else
                                                        {
                                                            res.status(400).send({status : 400, message : "Something Went Wrong"}) 
                                                        }

                                                    }).catch((err)=>{
                                                        res.status(500).send({status : 500, message : "Something Went Wrong"}) 
                                                    })
                                                    res.status(200).send({status : 200, message : "Password has Changed Succesfully"}) 
                                                }
                                                else
                                                {
                                                    res.status(400).send({status : 400, message : "Something Went Wrong"}) 
                                                }

                                            }).catch((err)=>{
                                                res.status(500).send({status : 500, message : "Something Went Wrong"}) 
                                            })
                                        }

                                    })
                                }
                            })

                        }
                    }
                    else
                    {
                        res.status(400).send({status : 400, message : "Incorrect OTP"})   
                    }
                }
                else
                {
                    res.status(400).send({status : 400, message : "Something Went Wrong"})
                }
            }).catch((err)=>{
                res.status(500).send({status : 500,message:"Something Went Wrong"})
            })
        }
        else
        {
            res.status(400).send({status : 400, message : "You are not registered User"}) 
        }

    }).catch((err)=>{
        res.status(500).send({status : 500,message:"Something Went Wrong"})
    })
}


exports.sendOtp = (req,res)=>{
    const{email} = req.body;

    OtpSchema.deleteOne({email : email}).then((d1)=>{
        UserSchema.find({email : email}).then((r1)=>{
            if(r1.length > 0)
            {
                OtpSchema.insertMany({time : Number(new Date()) , email : r1[0].email , otp : otp}).then((r2)=>{
                    if(r2.length > 0 )
                    {
                        transporter.sendMail({
                            from: '"Node-Web 👻" <arava16543s.jaipur2@kvsrojaipuronline.in>', // sender address
                            to:  email, // list of receivers
                            subject: "Password Reset (Node-Web) ✔", // Subject line
                            text: "Hello" + r1[0].name, // plain text body
                            html: `<h2>Your 6 digit OTP to reset your password is ${otp} 👻</h2>`, // html body
                          }).then((m_res)=>{
                             if(m_res.messageId)
                                {
                                    res.send("OTP sent Succesfully")
                                }
                                else
                                {
                                    res.status(400).send({status : 400,message:"Something Went Wrong|| Please try again"})   
                                }
                            }).catch((err)=>{
                            res.status(400).send({status : 400,message:"Something Went Wrong|| Please try again"})
                          })
    
                    }
                    else
                    {
                        res.status(400).send({status : 400, message : "Something Went Wrong || Try Again"})
                    }
    
                }).catch((err)=>{
                    res.status(500).send({status : 500,message:"Something Went Wrong"}) 
                })
    
            }
            else
            {
                res.status(400).send({status : 400, message : "You are not registered User"})
            }
    
        }).catch((err)=>{
            res.status(500).send({status : 500,message:"Something Went Wrong"})   
        })


    }).catch((err)=>{
        res.status(500).send({status : 500,message:"Something Went Wrong"}) 
    })

    var otp = Math.floor(Math.random()*789454).toString().padStart(6,0)

    

}

exports.login = (req,res)=>{
    const {password,email}=req.body

    UserSchema.find({email : email}).then((r1)=>{
           if(r1.length>0)
           {
                bcrypt.compare(password , r1[0].password , function(err,status){
                    if(err)
                    {
                        res.status(500).send({status : 500,message:"Something Went Wrong"}) 
                    }
                    else
                    {
                        if(status == true)
                        {
                            res.status(200).send({status : 200,data : { name : r1[0].name,email : r1[0].email},message:"loged in Succesfully"}) 
                        }
                        else
                        {
                            res.status(400).send({status : 400,message:"Incorrect Password"}) 
                        }
                    }
                })
           }
           else
           {
            res.status(400).send({status : 400,message:"You are not a registered user || Please login first"}) 
           }
    }).catch((err)=>{
        res.status(500).send({status : 500,message:"Something Went Wrong"})     
    })
}

exports.addUser = (req,res)=>{

    const {name,email,mobile,password} = req.body

    bcrypt.genSalt(10,function(err,salt){
        if(err)
        {
            res.status(500).send({status : 500,message:"Something Went Wrong"})   
        }
        else
        {
            bcrypt.hash(password,salt,function(err,hash){
                if(err)
                {
                    res.status(500).send({status : 500,message:"Something Went Wrong"})   
                }
                else
                {
                    UserSchema.insertMany({name : name , email :email , mobile :mobile , password :hash}).then((result)=>{
         
                        console.log(result)
                        if(result.length>0)
                        {
                             transporter.sendMail({
                                from: '"Web-Web 👻" <arava16543s.jaipur2@kvsrojaipuronline.in>', // sender address
                                to:  email, // list of receivers
                                subject: "Node-Web Registration ✔", // Subject line
                                text: "Hello" + name, // plain text body
                                html: "<h2>Your Registration has succesfully done 👻</h2>", // html body
                              }).then((m_res)=>{
                                if(m_res.messageId)
                                {
                                    res.send("User Registered Succesfully")
                                }
                                else
                                {
                                    res.status(400).send({status : 400,message:"User Registration failed || Please try again"})   
                                }
                              }).catch((err)=>{
                                res.status(400).send({status : 400,message:"User Registration failed || Please try again"})
                              })
                        }

                        else
                        {
                            res.status(400).send({status : 400,message:"User Registration failed || Please try again"})
                        }
                     }).catch((err)=>{
                        console.log(err.name)
                        console.log(err.code)
                        console.log(err.message)
                
                        if(err.code==11000)
                        {
                            res.status(400).send({status : 200,message :`User already exists with this ${err.message.split('{')[1].split(":")[0]}`})
                        }
                        else if(err.name="ValidationError")
                        {
                            res.send(400).send({status : 400 ,message : `${err.message.split(":")[1].trim()} is required for registration`})
                        }
                            else
                            {
                                 res.send({status : 500,message :"Something Went wrong"})
                            }
                        
                    })   
                }
            })
        }

    })

}

exports.AllProducts = (req,res)=>{
    ProductSchema.find({}).then((result)=>{
        if(result.length > 0)
        {
            res.status(200).send({ status : 200 , data : result})
        }
        else
        {
            res.status(200).send({ status : 200 , data : []})
        }
    }).catch((err)=>{
        console.log(err)
        res.status(500).send({ status : 500 , message : "Something Went Wrong || While fetching the Products"})
    })
}