const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");

router.get("/create", blogController.createBlog);
router.post("/", blogController.insertBlog)
router.get("/edit/:id", blogController.editBlog)
router.put("/:id", blogController.updateBlog)
router.get("/", blogController.allBlogs)
router.get("/:slug", blogController.detailBlog)
router.delete("/:id", blogController.deleteBlog)

module.exports = router;