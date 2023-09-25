const express = require('express');
const { body, validationResult } = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser')
const csurf = require('csurf');


const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(csurf({ cookie: true }));

// Routes
app.get('/', (req, res) => {
  res.render('index', { csrfToken: req.csrfToken() });
});

app.post('/login',[
body('username').notEmpty().trim().espace(),
body('password').notEmpty().isLenght({ min: 6}),
], (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  const user = mockUsers.find((user) => user.username === username);
  if (user && bcrypt.compareSync(password, user.passwordHash)) {
    req.session.isAuthenticated = true;
    res.redirect('/dashboard');
  } else {
    res.redirect('/');
  }
});

app.get('/dashboard', isAuthenticated, (req, res) => {
  // Secure the dashboard route to only allow authenticated users
  if (req.session.isAuthenticated) {
    res.render('dashboard');
  } else {
    res.redirect('/');
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
