//jshint esversion:6
const port = process.env.PORT || 3000;

var url = "mongodb+srv://admin-amitesh:";

const fs = require("fs");
const { promisify } = require("util");
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const keyChecker = require(__dirname + "/checkPost.js");
const posts = [];
require("dotenv").config();
const password = process.env.MONGODB_PASSWORD;
url = url + password + "@cluster0.4fk5puh.mongodb.net/blogPostDB";
//localhost:27017/populationDB
mongoose.connect(url, {
  useNewUrlParser: true,
});

const postSchema = new mongoose.Schema({
  postTitle: String,
  postContent: String,
});

const Post = mongoose.model("post", postSchema);

const homeStartingContent = new Post({
  postTitle: "/",
  postContent:
    "Welcome to the Journal of Curious Minds! Unleash your curiosity, explore boundless horizons, and savor the thrill of discovery. Our journal is a portal to captivating stories, insightful reflections, and the wonders of human imagination. Journey with us through the realms of art, science, history, and more, as we celebrate the unending pursuit of knowledge. Each page invites you to embrace the joy of learning and the magic of ideas. Let your mind wander, as we embark on a quest to uncover the hidden gems of wisdom and creativity. Welcome to a world where curiosity finds its home, and the journey of a curious mind never ends. Happy reading and journaling!",
});
const aboutContent = new Post({
  postTitle: "about",
  postContent:
    "Welcome to our About Page! At our journal, we are driven by a shared passion for technology and creativity, and we take pride in bringing innovative solutions to the forefront. Our team consists of skilled individuals with a knack for problem-solving and a keen eye for detail. Our expertise lies in video editing and content creation, where we showcase our creative abilities to captivate and engage audiences. With a finger on the pulse of the latest technological advancements, we continuously explore new avenues to push the boundaries of what's possible. We take pride in our crowd control abilities, ensuring that our content resonates with our audience and leaves a lasting impact. Our engaging personality and strong administrative skills contribute to an efficient workflow management, allowing us to deliver top-notch content consistently. Driven by a desire to make a meaningful impact, we strive for excellence in everything we do. Our commitment to quality and passion for technology defines our journal, and we are excited to share our insights and discoveries with you. Join us on this exciting journey, where curiosity meets creativity, and let's explore the world of technology and innovation together!",
});
const contactContent = new Post({
  postTitle: "contact",
  postContent:
    "Name: Amitesh Kumar Sinha , Number: +91-8409742400 , Email: acc.amitesh@gmail.com",
});

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  Post.find()
    .exec()
    .then((posts) => {
      res.render("home", {
        Content: homeStartingContent.postContent,
        postsArray: posts,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error connecting to database");
    });
});

app.get("/about", (req, res) => {
  res.render("about", { Content: aboutContent.postContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", { Content: contactContent.postContent });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  let postContentNew = new Post({
    postTitle: req.body.form_input_title,
    postContent: req.body.form_input_post,
  });
  postContentNew
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get("/posts/:post_name", (req, res) => {
  let title = req.params.post_name;
  keyChecker
    .checkKey(Post, title)
    .then((obj) => {
      if (obj.found) {
        res.render("post", { Title: obj.postTitle, Content: obj.postContent });
      } else {
        res.redirect("/");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error connecting to database");
    });
});

app.all("*", (req, res) => {
  res.redirect("/");
});
app.listen(port, "0.0.0.0", function () {
  console.log(`Server started on port ${port}`);
});

// http://localhost:3000/compose
