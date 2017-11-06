const express = require('express');
const app = express();
const expressSanitizer = require('express-sanitizer');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const keys = require('./config/keys');

mongoose.connect(keys.mongoURI);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride('_method'));

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
});
// New route
app.get('/blogs/new', (req, res) => {
  res.render('new');
});
// Create route
app.post('/blogs', (req, res) => {
  // create blog
  // Sanitizing the body - no javascript
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, (err, newBlog) => {
    if (err) {
      res.render('new');
    } else {
      // run redirect
      res.redirect('/blogs');
    }
  });
});
// SHOW ROUTE
app.get('/blogs/:id', (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.render('show', { blog: foundBlog });
    }
  });
});
// EDIT ROUTE
app.get('/blogs/:id/edit', (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.render('edit', { blog: foundBlog });
    }
  });
});
// UPDATE ROUTE
app.put('/blogs/:id', (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs/' + req.params.id);
    }
  });
});

// DELETE ROUTE

app.delete('/blogs/:id', (req, res) => {
  // destroy the blog
  Blog.findByIdAndRemove(req.params.id, err => {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs');
    }
  });
  res.send('DESTROY ROUTE');
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('server is running!');
});
