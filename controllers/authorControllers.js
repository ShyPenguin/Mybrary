const Author = require("../models/author")

const author_index = async(req, res) => {
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i')
  }
  try{
    const authors = await Author.find(searchOptions)
    res.render("authors/index", {
      authors: authors,
      searchOptions: req.query
    });
  } catch {
    res.redirect('/')
  }

}

const author_new_get = async(req, res) => {
  res.render("authors/create", { author: new Author() });
}

const author_new_post = async(req, res) => {
  const author = new Author({
    name: req.body.name
  })
  try {
    const newAuthor = await author.save();
    // res.redirect(`authors/${newAuthor.id}`)
    res.redirect(`authors`)
  } catch {
    res.render('authors/create', {
      author: author,
      errorMessage: 'Error creating Author'
    })
  }
}

module.exports = {
  author_index,
  author_new_get,
  author_new_post
}