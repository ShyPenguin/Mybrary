const express = require("express");
const router = express.Router();
const bookControllers = require("../controllers/bookControllers")
const Book = require("../models/book")
const multer = require('multer')
const path = require('path')
const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif', 'image/jpg']
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  }
})

//book Index
router.get("/", bookControllers.book_index);

//New book
router.get("/new", bookControllers.book_new_get);

//Create book
router.post("/", upload.single('cover'), bookControllers.book_new_post)


module.exports = router