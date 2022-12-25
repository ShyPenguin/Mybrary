const express = require("express");
const router = express.Router();

//Author Index
router.get("/", (req, res) => {
  res.render("authors/index");
})

//New Author
router.get("/new", (req, res) => {
  res.render("authors/new");
})

router.get("/", (req, res) => {
  res.send("Create");
})


module.exports = router