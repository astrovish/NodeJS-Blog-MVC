const mongoose = require("mongoose");
const { default: slugify } = require("slugify");

const blogSchema = new mongoose.Schema({
    title: {
        desc: "Title of a blog",
        trim: true,
        type: String,
        required: true
    },
    body: {
        desc: "Complete blog description will be written here.",
        trim: true,
        type: String,
        required: true
    },
    userId: {
        type: Number,
        required: true
    },
    slug: {
        desc: "Slug for pretty url & SEO purpose",
        trim: true,
        type: String,
        required: true,
        unique: true
    }
});

blogSchema.pre("validate", function(next) {
    if( this.title ) {
        this.slug = slugify(this.title, {
            strict: true,
            lower: true
        })
    }
    next();
})

module.exports = mongoose.model("Blog", blogSchema);