const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const keys = require('./config/keys');

mongoose.connect(keys.mongoURI);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Blog Schema
const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now }
});

//Blog model
const Blog = mongoose.model('Blog', blogSchema);

// Test document
// Blog.create({
//   title: 'Test',
//   image: 'https://www.what-dog.net/Images/faces2/scroll0015.jpg'
// });

// RESTful Routes

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('server is running!');
});
