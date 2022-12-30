const Author = require("../models/author")
const Book = require("../models/book")

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
  res.render("authors/new", { author: new Author() });
}

const author_new_post = async(req, res) => {
  const author = new Author({
    name: req.body.name
  })
  try {
    const newAuthor = await author.save();
    res.redirect(`authors/${newAuthor.id}`)
  } catch {
    res.render('authors/new', {
      author: author,
      errorMessage: 'Error creating Author'
    })
  }
}

const author_details_get = async (req, res) => {
  try{
    const author = await Author.findById(req.params.id)
    const books = await Book.find({ author: author.id }).limit(6).exec()
    res.render('authors/details', {
      author: author,
      booksByAuthor: books
    })
  } catch {
    res.redirect('/')
  }
}
   
const author_edit_get = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)
    res.render("authors/edit", { author: author});
  } catch {
    res.render("/authors")
  }   
}
  
const author_update_put = async (req, res) => {
  let author
  try {
    author = await Author.findById(req.params.id)
    author.name = req.body.name
    await author.save()
    res.redirect(`/authors/${author.id}`)
  } catch {
    if(author == null) {
      res.redirect('/')
    } else {
      res.render('authors/edit', {
        author: author,
        errorMessage: 'Error updating Author'
      })
    }
  }
}

const author_delete = async(req, res) => {
  let author
  try {
    author = await Author.findById(req.params.id)
    await author.remove()
    res.redirect(`/authors`)
  } catch {
    if(author == null) {
      res.redirect('/')
    } else {
      res.redirect(`/authors/${author.id}`)
    }
  }
} 
    
module.exports = {
  author_index,
  author_new_get,
  author_new_post,
  author_details_get,
  author_edit_get,
  author_update_put,
  author_delete
}