const express = require("express");
const router = express.Router();
const bookControllers = require("../controllers/bookControllers")


//book Index
router.get("/", bookControllers.book_index);

//New book
router.get("/new", bookControllers.book_new_get);

//Create book
router.post("/", bookControllers.book_new_post)

router.route("/:id")
      .get(bookControllers.book_details_get)
      .put(bookControllers.book_update_put)
      .delete(bookControllers.book_delete)

router.get("/:id/edit", bookControllers.book_edit_get)

module.exports = router