const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

const app = express()
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

app.get("/",(req,res)=>{
  res.render("index")
})
app.get("/contact",(req,res)=>{
  res.render("contact")
})
app.get("/about",(req,res)=>{
  res.render("about")
})
app.get("/archive",(req,res)=>{
  res.render("archive")
})
app.listen(3000, err=>{
  if(err)console.log(err)
  else console.log("ss")
})
