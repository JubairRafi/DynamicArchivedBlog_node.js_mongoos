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
})
const Story = mongoose.model("Story",storySchema)

const archivedSchema = new mongoose.Schema({
  storyType: String,
  archived: storySchema
})
const Archive = mongoose.model("Archive",archivedSchema)


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
  Archive.find({},(err,foundArchivedStory)=>{
    if (!err) {
      res.render("archive",{archStorys:foundArchivedStory})
    }
  })

})

app.get("/story/:id",(req,res)=>{
  const id = req.params.id
  Story.findOne({_id:id},(err,foundStory)=>{
    // if(!err){
    //   res.render("story",{story:foundStory})
    // }else{
    //   console.log("test");
    //   Archive.findOne({archived :{_id:id}},(err,foundArch)=>{
    //     console.log(foundArch);
    //     res.render("story",{story:foundArch})
    //   })
    // }


    if (err) {
      console.log(err)
    }else if (foundStory) {
      console.log(foundStory);
      res.render("story",{story:foundStory,flag:"story"})
    }else{
      console.log("test")
          Archive.findOne({"archived._id" :{_id:id}},{_id:false,"archived":true},(err,foundStory)=>{ // TODO: id null
          const arch = {
            storyTitle : foundStory.archived.storyTitle,
            content : foundStory.archived.content,
            _id : foundStory.archived._id
          }
          console.log(arch)
          res.render("story",{story:arch,flag:"arch"})
        })
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

app.post("/archive",(req,res)=>{
  const storyID = req.body.storyID
  Story.findOne({_id:storyID},(err,foundStory)=>{
    const archivedStory = new Archive({
      storyType:"Archived",
      archived : foundStory
    })
    archivedStory.save(err=>{
      if(!err){
        Story.findByIdAndRemove(storyID,err=>{
          if(!err){
            res.redirect("/")
          }
        })
      }
    })
  })
})

app.post("/delete",(req,res)=>{
  const archStoryID = req.body.archStoryID
  Archive.findByIdAndRemove(archStoryID,(err)=>{
    res.redirect("/archive");
  })
})

app.listen(3000, err=>{
  if(err)console.log(err)
  else console.log("ss")
})
