//jshint eversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require ("mongoose");
const date = require(__dirname + "/date.js");
const _ = require("lodash");

const app = express();
//console.log(date.getDate);
//let items = ["wake up", "drink water", "Go for Walk"];
//let workItems = [];
//let title;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.set('strictQuery', true);

mongoose.connect("mongodb+srv://Samresh:samresh7@atlascluster.al7n5nu.mongodb.net/todolistDB" ,()=>{console.log("mongo first")});
console.log("connected");
const itemsSchema = new mongoose.Schema({
  name: String
})
const Item =  mongoose.model("Item", itemsSchema);
const item =  [
  {
  name : "Welcome to your todo list"
  },
  {
    name : "Hit the + button to add new Item"
  },
  {
    name: "<-- Hit to delete the item"
  }
]

const listSchema = new mongoose.Schema({
  name:String,
  items : [itemsSchema]
})

const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
  let currentDay = date.getDate();
  Item.find({} , (err , foundItems)=>{
    if(foundItems.length === 0){
    Item.insertMany(item , (err)=>{
  if(err){console.log(err)}
  else{console.log("Successfully added")}
});
   res.redirect("/")
  } else{ 
    res.render("index", {
    list: "Today",
    newListItems: foundItems,
   
    
  }) 
   };
  })

});



app.post("/", function (req, res) {
  
  let itemName = req.body.newItem;
  let listName = req.body.list;
  const item = new Item({
    name: itemName
  })
  if (listName ==="Today"){
    item.save();
    res.redirect("/");
  }
 else{
   List.findOne({name:listName}, (err,foundList)=>{
    if(!err){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/"+listName)
    };
   })
  
 }
});

app.post("/delete" ,function(req,res){
  let itemId = req.body.checkbox;
  let listName = req.body.listName;
  if(listName === "Today"){
  Item.findByIdAndDelete(itemId).exec();
  console.log("successfully deleted");
  res.redirect("/");
  }else{
  List.findOneAndUpdate({name:listName} ,{$pull:{items:{_id:itemId}} }, (err)=>{
    if(!err){
      console.log("list deleted")
  res.redirect("/" + listName);
  
  }
  })
  

  }
  
})
//express route parameter
app.get("/:customListName", (req,res)=>{
 const customListName = _.capitalize(req.params.customListName);
 List.findOne({name:customListName} , function(error , foundlist){
  if(!error){
    if(!foundlist){
    const list = new List({
    name: customListName,
    items: item
  })
  list.save();
  res.redirect("/" + customListName);
    }else{
    res.render("index", {
    list: foundlist.name,
    newListItems: foundlist.items,
            
  }) 
    };
  }else(console.log(error));
 })
  
})

const port = process.env.port || 8000;
app.listen(port, function () {
  console.log("server started  http://localhost:8000");
});
