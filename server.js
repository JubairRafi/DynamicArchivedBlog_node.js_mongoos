const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")


const app = express()
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/storyDB",{useNewUrlParser:true, useUnifiedTopology: true,useFindAndModify: false }) //connection and connection url
const storySchema = new mongoose.Schema({
  storyTitle:String,
  content:String
});
const Story = mongoose.model("Story",storySchema)


app.get("/",(req,res)=>{
  Story.find({},(err,foundStorys)=>{
      res.render("index",{storys: foundStorys})
  })
})

app.get("/create",(req,res)=>{
  res.render("create",{title:"", description:"", storyId:""})
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

app.get("/story/:id",(req,res)=>{
  const id = req.params.id
  Story.findOne({_id:id},(err,foundStory)=>{
    if(!err){
      res.render("story",{story:foundStory})
    }
  })
})

//post request
app.post("/",(req,res)=>{
  const title = req.body.title
  const description = req.body.description
  const storyId = req.body.sId
  if (storyId==="") {
    const newStory = new Story({
        storyTitle:title,
        content:description
      });
    newStory.save(err=>{
      if (!err) {
        res.redirect("/")
      }
    })
  } else {
    Story.findByIdAndUpdate(storyId,{storyTitle:title, content:description}, (err,foundStory)=>{
      if(!err){
        res.redirect("/")
      }
    })
  }

})

app.post("/update",(req,res)=>{
  const storyID = req.body.storyID

  Story.findOne({_id:storyID},(err,foundStory)=>{
    res.render("create",{title:foundStory.storyTitle, description:foundStory.content, storyId: foundStory._id})
  })
})

app.listen(3000, err=>{
  if(err)console.log(err)
  else console.log("ss")
})
