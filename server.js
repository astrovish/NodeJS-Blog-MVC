const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Blog = require("./models/blog");
const methodOverride = require("method-override");

// creating an express application
const app = express();

// path to the config file
dotenv.config({path: './config/config.env'});

mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(result => {
    // listening server on to assign port
    const PORT = process.env.PORT || 3500;
    app.listen(PORT, () => {
        console.log(`Application is up and running on port: ${PORT}`);
    })

    console.log("Application successfully connected with database.")
})
.catch(err => {
    console.log(`Following error received while connecting with database: ${err}`);
})

// setting up view engine
app.set("view engine", "ejs");

// setting up view folder
app.set("views", process.env.VIEW_FOLDER)

// use /public directory for static files
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
// parse request of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({extended: false}));

// home page
app.get("/", (req, res) => {
    res.render("index", {
        pageTitle: "Home Page"
    })
})

// create blog
app.get("/blogs/create", (req, res) => {
    res.render("create", {
        pageTitle: "Create New Blog"
    })
})

// insert new blog
app.post("/blogs", async (req, res) => {
    try {
        const blog = new Blog({
            title: req.body['blog-title'],
            body: req.body['blog-body'],
            userId: 23
        });
        
        await blog.save();
        res.status(201).redirect("/blogs");
    } catch(e) {
        console.log(e.message);
        res.send(e.message);
    }
})

// all blogs
app.get("/blogs", async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.render("blogs", {
            pageTitle: "All Blogs",
            blogs
        })
    } catch(e) {
        console.log(e.message);
        res.send(e.message);
    }
})

// single blog
app.get("/blogs/:slug", async (req, res) => {
    try {
        const blog = await Blog.findOne({slug: req.params.slug});
        res.render("blog", {
            pageTitle: blog.title,
            blog
        })
    } catch(e) {
        console.log(e.message);
        res.send(e.message);
    }
})

app.delete("/blogs/:id", async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.redirect("/blogs");
    } catch(e) {
        res.redirect("404");
    }
})

app.use((req, res) => {
    res.render("404", {
        pageTitle: "OOPS!!! Page Not Found."
    })
})