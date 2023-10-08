const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');

const app = express();
const port = process.env.PORT || 3000;

// Configure session management for user authentication
app.use(session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true
  }));

// Require userRoutes.js to include user-related routes
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
app.use(bodyParser.urlencoded({ extended: false }));

// Configure EJS view engine and static file serving
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(userRoutes);
app.use(blogRoutes);
app.use('/', blogRoutes);


app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Passport for user authentication
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Passport user serialization and deserialization (replace with database integration)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Lookup user by ID (replace with database query)
  const user = { id, username: 'exampleUser' };
  done(null, user);
});

// Use the userRoutes for user-related routes
app.use('/', userRoutes);


app.get('/', (req, res) => {
    res.render('home');
})

// Start the server
app.listen(port, () => {
  console.log(`The app is listening on http://localhost:${port}`);
});
