const Book = require("../models/book")
const Author = require("../models/author")
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif', 'image/jpg']

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
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishedDate: new Date(req.body.publishedDate),
    pageCount: req.body.pageCount,
    description: req.body.description
  })

  saveCover(book, req.body.cover, )
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

const saveCover = (book, coverEncoded) => {
  if (coverEncoded == null) return

  const cover = JSON.parse(coverEncoded)
  if( cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, 'base64')
    book.coverImageType = cover.type
  }
}

module.exports = {
  book_index,
  book_new_get,
  book_new_post
}