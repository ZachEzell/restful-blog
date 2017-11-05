const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const keys = require('./config/keys');

mongoose.connect(keys.mongoURI);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Blog Schema -1
const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now }
});

//Blog model -2
const Blog = mongoose.model('Blog', blogSchema);

// Test document -3
// Blog.create({
//   title: 'Test',
//   image: 'https://www.what-dog.net/Images/faces2/scroll0015.jpg'
// });

// RESTful Routes

// default route
app.get('/', (req, res) => {
  res.redirect('/blogs');
});
// INDEX - first route

app.get('/blogs', (req, res) => {
  // retrieve all blogs
  Blog.find({}, (err, blogs) => {
    if (err) {
      console.log('error');
    } else {
      // pass all data to index.ejs under name blogs
      res.render('index', { blogs: blogs });
    }
  });
  res.render('index');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('server is running!');
});
