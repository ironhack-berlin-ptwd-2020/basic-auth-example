const express = require('express');
const User = require('../models/User.model');
const router = express.Router();

const bcrypt = require('bcryptjs');

/* GET home page */
router.get('/', (req, res) => {
  if (req.session.user) {
    res.render('index', { username: req.session.user.username })
  } else {
    res.render('index')
  }
});

router.get('/signup', (req, res) => {
  res.render('signup')
})

router.post('/signup', (req, res) => {

  const salt = bcrypt.genSaltSync(10);
  const pwHash = bcrypt.hashSync(req.body.password, salt);

  User.create({ username: req.body.username, passwordHash: pwHash }).then(() => {
    res.redirect('/')
  })

})

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', (req, res) => {
  console.log('SESSION =====> ', req.session); // req.session === {}

  // find the user by their username
  User.findOne({ username: req.body.username }).then((user) => {

    if (!user) {
      // this user does not exist
      res.render('login', { errorMessage: 'username does not exist' })
    } else {

      // check if the password is correct
      if (bcrypt.compareSync(req.body.password, user.passwordHash)) {
        req.session.user = user
        res.send('password correct - logged in')
      } else {
        res.render('login', { errorMessage: 'password wrong' })
      }

    }

  })

})


router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});


router.get('/protected', (req, res) => {

  if (!req.session.user) {
    res.redirect('/login')
  } else {
    res.send('some protected content')
  }

})


router.get('/storetest', (req, res) => {
  req.session.something = 'HelloTest'
  res.send('stored.')
})

router.get('/readsession', (req, res) => {
  console.log(req.session)
  res.send('check the console.')
})


module.exports = router;
