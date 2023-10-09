// authMiddleware.js

function isAuthenticated(req, res, next) {
    // Passport.js adds the `req.isAuthenticated()` function to check if a user is authenticated
    if (req.isAuthenticated()) {
        // If the user is authenticated, continue to the next middleware or route handler
        return next();
    }

    // If the user is not authenticated, redirect them to the login page
    res.redirect('/login');
}

module.exports = isAuthenticated;
