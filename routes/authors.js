const express = require("express");
const router = express.Router();
const authorControllers = require("../controllers/authorControllers")

//Author Index
router.get("/", authorControllers.author_index);

//New Author
router.get("/new", authorControllers.author_new_get);

//Create Author
router.post("/", authorControllers.author_new_post)


module.exports = router