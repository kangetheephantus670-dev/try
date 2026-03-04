const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
  secret: 'try-website-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Routes
const reportRoutes = require('./routes/reports');
const adminRoutes = require('./routes/admin');

app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Admin login page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-login.html'));
});

// Admin dashboard (protected)
app.get('/admin/dashboard', (req, res) => {
  if (!req.session.adminId) {
    return res.redirect('/admin');
  }
  res.sendFile(path.join(__dirname, 'public', 'admin-dashboard.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin`);
});
