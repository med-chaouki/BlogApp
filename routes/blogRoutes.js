const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const passport = require('passport');

router.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true
}));
router.use(passport.initialize());
router.use(passport.session());

const filePath = path.join(__dirname, '../data/blog-posts.json');

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

router.use(isAuthenticated)

// Define routes for login and registration forms
router.get('/login', (req, res) => {
    res.render('login'); // Render the login form template
});

router.get('/register', (req, res) => {
    res.render('register'); // Render the registration form template
});


// Read blog posts
router.get('/posts', (req, res) => {
  // Read data from blog-posts.json
  const data = fs.readFileSync(filePath, 'utf8');
  const posts = JSON.parse(data);
  res.render('layout', { posts, body: posts});
});


router.post('/posts', async (req, res) => {
  const { title, content } = req.body;

  console.log('Request Body:', req.body);
    
  console.log('Extracted Title:', title);
  console.log('Extracted Content:', content);
 
  // Generate the current date in "yyyy-MM-dd" format
  const currentDate = new Date().toISOString().slice(0, 10);
  console.log(currentDate);
  // Read data from the JSON file
  const data = await fs.promises.readFile(filePath, 'utf8');

  // Parse the JSON data
  const posts = JSON.parse(data);

  // Calculate the next available id
  const nextId = posts.length > 0 ? Math.max(...posts.map(post => post.id)) + 1 : 1;

  // Create a new post object with the calculated id and current date
  const newPost = {
      id: nextId,
      title,
      content,
      date: currentDate,
      // You can also add other properties like author, etc.
  };
  
  // Add the new post to the existing data
  posts.push(newPost);
  
  // Write the updated data back to the JSON file
  await fs.promises.writeFile(filePath, JSON.stringify(posts, null, 2));

  // Redirect to the posts page after successfully adding the post
  res.redirect('/posts');
});


// Update a blog post
// Update a blog post
router.put('/posts/:id', async (req, res) => {
  const postId = parseInt(req.params.id); // Parse the post ID from the URL parameter
  const { title, content } = req.body; // Get the updated title and content from req.body


  // Log the received data for debugging
  console.log('Received PUT request for post ID:', postId);
  console.log('Updated title:', title);
  console.log('Updated content:', content)

  // Read data from the JSON file
  const data = await fs.promises.readFile(filePath, 'utf8');
  const posts = JSON.parse(data);

  // Find the post with the given ID
  const postIndex = posts.findIndex(post => post.id === postId);

  if (postIndex !== -1) {
    // Update the post's title and content
    posts[postIndex].title = title;
    posts[postIndex].content = content;

    // Write the updated data back to the JSON file
    await fs.promises.writeFile(filePath, JSON.stringify(posts, null, 2));

    // Send a success response
    res.status(200).send('Post updated successfully');
  } else {
    // Send a not found response if the post with the given ID doesn't exist
    res.status(404).send('Post not found');
  }
});



// Delete a blog post
router.delete('/posts/:id', async (req, res) => {
  const postId = parseInt(req.params.id); // Parse the post ID from the URL parameter

  // Read data from the JSON file or database
  const data = await fs.promises.readFile(filePath, 'utf8');
  const posts = JSON.parse(data);

  // Find the post with the given ID
  const postIndex = posts.findIndex(post => post.id === postId);

  if (postIndex !== -1) {
    // Remove the post from the array
    posts.splice(postIndex, 1);

    // Write the updated data back to the JSON file or database
    await fs.promises.writeFile(filePath, JSON.stringify(posts, null, 2));

    // Send a success response
    res.status(200).send('Post deleted successfully');
  } else {
    // Send a not found response if the post with the given ID doesn't exist
    res.status(404).send('Post not found');
  }
});


module.exports = router;

