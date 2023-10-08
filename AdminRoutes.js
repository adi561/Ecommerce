const express=require('express');
const router=express.Router()
const AdminController=require('../Controllers/AdminControllers')
const ProductSchema = require('../Schemas/Products')

router.post('/add-products' , AdminController.AddProducts)

module.exports=router;