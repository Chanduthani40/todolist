const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const _ = require('lodash');
const { getDate } = require('./date');
const date = require(__dirname + "/date.js");
const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

mongoose.connect("mongodb+srv://chandu-admin:Test123@cluster0.sw6gphp.mongodb.net/todoList");
const ItemSchema = new mongoose.Schema({
    name:String
});
const Item = mongoose.model("item",ItemSchema);
const Item1 = new Item({
    name:"welcome to your Todo-list"
})
const Item2 = new Item({
    name:"Click the + button to add a new Item!"
})
const Item3 = new Item({
    name:"<--- Hit this to delete an Item"
})
const defaultItems = [Item1,Item2,Item3];

const listSchema = new mongoose.Schema({
    name:String,
    listitems:[ItemSchema]
})
const ListName = mongoose.model("listname",listSchema); 


app.get("/",function(req,res){
    Item.find({},function(err,foundItems){
        if(foundItems.length === 0)
        {
            Item.insertMany(defaultItems,function(err){
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    console.log("succesfully created items in DB");
                }
            })
            res.redirect("/");
        }
        else
        {
            res.render("list.ejs",{okkaticheppana:"Today", newlist:foundItems});
        }

    })
   
})
app.post("/",function(req,res){
    const itemName = req.body.list;
    const itemButton = req.body.list1;
    const item = new Item({
        name:itemName
    })
    if(itemButton === "Today")
    {
        item.save();
        res.redirect("/");
    }
    else{
        ListName.findOne({name:itemButton},function(err,foundlist){
            foundlist.listitems.push(item);
            foundlist.save();
            res.redirect("/" + itemButton);
        })
    }
})
app.post("/delete",function(req,res){
    const checkedItemByid = req.body.checkbox;
    const yeeparams = req.body.geeparams;
    if(yeeparams == "Today")
    {
        Item.findByIdAndDelete(checkedItemByid, function(err){
            if(err)
            {
                console.log(err)
            }
            else
            {
                console.log("item is successfully deleted");
                res.redirect("/");
            }
        })
    }
    else{
        ListName.findOneAndUpdate({name:yeeparams},{$pull:{listitems:{_id:checkedItemByid}}},function(err,foundlist){
            if(!err)
            {
                res.redirect("/" + yeeparams);
            }
        })
    }
    
    
})
app.get("/:Listname",function(req,res){

    const listname = _.capitalize(req.params.Listname);
    console.log(listname);
    ListName.findOne({name:listname},function(err,foundlist){
        if(!err)
        {
            if(!foundlist)
            {
                const ListValue = new ListName({
                    name:listname,
                    listitems:defaultItems
                });
                ListValue.save();
                res.redirect("/" + listname);
            }
            else
            {
                res.render("list.ejs",{okkaticheppana:foundlist.name, newlist:foundlist.listitems});
            }
        }
    })
    
})
app.get("/about",function(req,res){
    res.render("about.ejs");
})
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);

app.listen(3000,function(){
    console.log("server is listening");
})