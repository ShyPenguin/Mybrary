const express = require("express");
const router = express.Router();
const bookControllers = require("../controllers/bookControllers")


//book Index
router.get("/", bookControllers.book_index);

//New book
router.get("/new", bookControllers.book_new_get);

//Create book
router.post("/", bookControllers.book_new_post)


module.exports = router