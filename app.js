//jshint eversion:6
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
let items = ["wake up", "drink water", "Go for Walk"];
let workItems = [];
let title;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  let options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };

  let today = new Date();
  let currentDay = today.toLocaleDateString("en-US", options);

  res.render("index", {
    list: currentDay,
    newListItems: items,
    route: "/",
  });
});

app.post("/", function (req, res) {
  console.log(req.body);
  let item = req.body.newItem;
  items.push(item);

  res.redirect("/");
});

app.get("/work", function (req, res) {
  res.render("index", {
    list: "Work List",
    newListItems: workItems,
    route: "/work",
  });
});

app.post("/work", function (req, res) {
  let workitem = req.body.newItem;
  workItems.push(workitem);
  res.redirect("/work");
});
app.listen(8000, function () {
  console.log("server started  http://localhost:8000");
});
