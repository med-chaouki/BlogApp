const express = require('express');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const LocalStrategy = require('passport-local').Strategy;
const fs = require('fs'); // For reading JSON file
const flash = require('connect-flash')

const router = express.Router();

const session = require('express-session');

router.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true
}));
router.use(passport.initialize());
router.use(passport.session());




// Dummy data for blog posts (read from JSON file)
const postsData = JSON.parse(fs.readFileSync('data/blog-posts.json', 'utf-8'));

router.use(flash());

// Passport user serialization and deserialization (replace with database integration)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Lookup user by ID (replace with database query)
  const user = { id, username: 'exampleUser' };
  done(null, user);
});

// Passport local authentication strategy (replace with your own logic)
passport.use(new LocalStrategy(
  (username, password, done) => {
    // Check username and password (replace with your authentication logic)
    console.log(`Attempting login with username: ${username} and password: ${password}`);
    if (username === 'user' && password === 'password') {
      const user = { id: 1, username: 'user' };
      return done(null, user);
    }
    return done(null, false, { message: 'Incorrect username or password' });
  }
));

// // Middleware to check if the user is authenticated
// const isAuthenticated = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect('/login');
// };

// router.use(isAuthenticated)

// Login form
router.get('/login', (req, res) => {
  res.render('login', { messages: req.flash('Your Password or User name is incorrect') });
});

// Handle login form submission
router.post('/login', passport.authenticate('local', {
  successRedirect: '/posts',
  failureRedirect: '/login',
  failureFlash: true
}));

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Registration form
router.get('/register', (req, res) => {
  res.render('register');
});

// Handle registration form submission
router.post('/register', [
  // Validate and sanitize user inputs
  body('username').trim().isLength({ min: 3 }).escape(),
  body('password').trim().isLength({ min: 6 }),
], (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Handle validation errors
    return res.status(400).json({ errors: errors.array() });
  }

  res.redirect('/login'); // Redirect to the login page after successful registration
});

module.exports = router;
