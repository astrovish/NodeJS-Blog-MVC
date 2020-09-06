const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const blogRoutes = require("./routes/blogRoutes");

// creating an express application
const app = express();

// path to the config file
dotenv.config({path: './config/config.env'});

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true,
    useFindAndModify: false
})
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

// blog routes
app.use("/blogs", blogRoutes);

app.use((req, res) => {
    res.render("404", {
        pageTitle: "OOPS!!! Page Not Found."
    })
})