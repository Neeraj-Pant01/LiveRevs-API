const rateLimit = require("express-rate-limit")
const slowDown = require("express-slow-down")


// Login limit
exports.authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5,
    message: 'Too many login attempts. Try again in 10 minutes.',
});



// Search - high volume
exports.searchLimiter = slowDown({
    windowMs: 60 * 1000, // 1 minute (Requests are counted per IP in this 1-minute window.)
    delayAfter: 50, // Start slowing down after 50 requests
    delayMs: () => 500     // Delay every request after limit by 500ms
});


exports.profileViewLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Allow 20 views per minute per IP
  message: "Too many profile views. Please slow down.",
});


exports.addReviewLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // Allow 20 views per minute per IP
  message: "Too many posts. Please slow down.",
});

exports.commentLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many comments. Try again in a minute."
});

