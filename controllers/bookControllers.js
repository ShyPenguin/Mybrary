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
    res.redirect(`/books/${newBook.id}`)
  } catch (err){
    renderNewPage(res, book, true)
  }
}

const renderNewPage = async(res, book, hasError = false) => {
  renderFormPage(res, book, 'new', hasError)
}

const saveCover = (book, coverEncoded) => {
  if (coverEncoded == null) return

  const cover = JSON.parse(coverEncoded)
  if( cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, 'base64')
    book.coverImageType = cover.type
  }
}

//Book Details Get
const book_details_get = async (req, res) => {
  try{
    const book = await Book.findById(req.params.id)
                            .populate('author')
                            .exec()

    res.render("books/details", {book: book})
  } catch {
    res.redirect('/')
  }
}

//Edit Book Get
const book_edit_get = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
                          .populate('author')
                          .exec()
    renderEditPage(res, book)
  } catch {
    res.render("/authors")
  }
}

const renderEditPage = async(res, book, hasError = false) => {
  renderFormPage(res, book, 'edit', hasError)
}

const renderFormPage = async(res, book, form, hasError = false) => {
  let authors 
  try{
    if(form === 'edit') {
      authors = await Author.find({ _id: { $nin: book.author } });
    } else {
      authors = await Author.find({});
    }
    const params = {
      authors: authors,
      book: book,
      form: form 
    }
    if (hasError) {
      if(form === 'edit') {
        params.errorMessage = 'Error Updating Book'
      } else {
        params.errorMessage = 'Error Creating Book'
      }
    }
    res.render(`books/${form}`, params)
  } catch (err){
    console.log(err)
    res.redirect('/books');
  }
}

// Update Book Put
const book_update_put = async (req, res) => {
  let book 
  try {
    book = await Book.findById(req.params.id)
    book.title = req.body.title
    book.author = req.body.author
    book.publishedDate = new Date(req.body.publishedDate)
    book.pageCount = req.body.pageCount
    book.description = req.body.description
    if(req.body.cover != null && req.body.cover !== '') {
      saveCover(book, req.body.cover)
    }

    await book.save()
    res.redirect(`/books/${book.id}`)
  } catch {
    if (book != null) {
      renderEditPage(res, book, true)
    } else {
      redirect('/')
    }
  }
}

// Delete Book 
const book_delete = async (req, res) => {
  let book 
  try {
    book = await Book.findById(req.params.id)
    await book.remove()
    res.redirect('/books')
  } catch {
    if (book != null) {
      res.render(`books/${book.id}`, {
        book: book,
        errorMessage: 'Error could not remove Book'
      })
    } else {
      res.redirect('/')
    }
  }
}

module.exports = {
  book_index,
  book_new_get,
  book_new_post,
  book_details_get,
  book_edit_get,
  book_update_put,
  book_delete
}