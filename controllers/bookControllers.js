const Book = require("../models/book")
const Author = require("../models/author")

//All books
const book_index = async(req, res) => {
  let query = Book.find()
  if(req.query.title != null && req.query.title != '' ) {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if(req.query.publishedBefore != null && req.query.publishedBefore != '' ) {
    query = query.lte('publishedDate', req.query.publishedBefore)
  }
  if(req.query.publishedAfter!= null && req.query.publishedAfter != '' ) {
    query = query.gte('publishedDate', req.query.publishedAfter)
  }

  try{
    const books = await query.exec()
    console.log(books);
    res.render('books/index', {
      books: books,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
}

const book_new_get = async(req, res) => {
  renderNewPage(res, new Book())
}

const book_new_post = async(req, res) => {
  const fileName = req.file != null ? req.file.filename : null
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishedDate: new Date(req.body.publishedDate),
    pageCount: req.body.pageCount,
    coverImageName: fileName,
    description: req.body.description
  })

  try {
    const newBook = await book.save()
    res.redirect('books')
  } catch (err){
    renderNewPage(res, book, true)
  }
}

const renderNewPage = async(res, book, hasError = false) => {
    try{
      const authors = await Author.find({});
      const params = {
        authors: authors,
        book: book  
      }
      if (hasError) params.errorMessage = 'Error Creating Book'
      res.render('books/new', params)
    } catch {
      res.redirect('/books');
    }
}

module.exports = {
  book_index,
  book_new_get,
  book_new_post
}