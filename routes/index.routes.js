const express = require('express');
const User = require('../models/User.model');
const router = express.Router();

const bcrypt = require('bcryptjs');

/* GET home page */
router.get('/', (req, res) => res.render('index', { title: 'App created with Ironhack generator 🚀' }));

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


module.exports = router;
