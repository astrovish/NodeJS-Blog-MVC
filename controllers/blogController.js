const Blog = require("../models/blog");
const { default: slugify } = require("slugify");

const createBlog = (req, res) => {
    res.render("create", {
        pageTitle: "Create New Blog",
        blog: {title: '', body: ''}
    })
}

const insertBlog = async (req, res) => {
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
}

const editBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        res.render("edit", {
            pageTitle: "Edit Blog",
            blog
        })
    } catch(e) {
        res.send(e.message);
    }
}

const updateBlog = async (req, res) => {
    try {
        let blog = {
            title: req.body['blog-title'],
            body: req.body['blog-body'],
            userId: 55,
            slug: slugify(req.body['blog-title'], {strict: true, lower:true})
        }
        await Blog.findByIdAndUpdate(req.params.id, blog);
        res.redirect("/blogs/");
    } catch (e) {
        res.send(e.message);
    }
}

const allBlogs = async (req, res) => {
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
}

const detailBlog = async (req, res) => {
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
}

const deleteBlog = async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.redirect("/blogs");
    } catch(e) {
        res.redirect("404");
    }
}

module.exports = {
    createBlog,
    insertBlog,
    editBlog,
    updateBlog,
    allBlogs,
    detailBlog,
    deleteBlog
}