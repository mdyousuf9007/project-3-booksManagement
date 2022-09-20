const express = require('express')
const router =express.Router()


const userController=require("../controllers/userController")
router.get('/test-me',function(req,res){
    res.send({msg : "working properly"})
})

router.post("/register",userController.createUser)
router.post("/login",userController.createLogin)










module.exports=router

