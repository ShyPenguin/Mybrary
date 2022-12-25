if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
  console.log(process.env.DATABASE_URL);
}


const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

const indexRouter = require("./routes/index")
const authorRouter = require("./routes/authors")

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("public"));

const mongoose = require('mongoose')

mongoose.set('strictQuery', true);
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => app.listen(process.env.PORT || 3000))
  .catch((err) => console.log(err));

app.use("/", indexRouter);
app.use("/authors", authorRouter);