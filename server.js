const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

const app = express()

app.get("/",(req,res)=>{
  res.send("hello")
})

app.listen(3000, err=>{
  if(err)console.log(err)
  else console.log("ss")
})
