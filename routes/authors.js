const express = require("express");
const router = express.Router();
const authorControllers = require("../controllers/authorControllers")

//Author Index
router.get("/", authorControllers.author_index)

//New Author
router.get("/new", authorControllers.author_new_get)

//Create Author
router.post("/", authorControllers.author_new_post)

router.route("/:id")
      .get(authorControllers.author_details_get)
      .put(authorControllers.author_update_put)
      .delete(authorControllers.author_delete)

router.get("/:id/edit", authorControllers.author_edit_get)
module.exports = router