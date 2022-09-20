const express = require('express')
const route =express.Router()

route.get('/test-me',function(req,res){
    res.send({msg : "working properly"})
})











module.exports=route

