const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = require("../secrets")

const Users = require('../users/users-model')

router.post('/register', (req, res) => {
  let user = req.body;
  
  if (!user.username || !user.password){
    res.status(400).json({message: "Username and password are required"})
  }
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;
    Users.add(user)
      .then(saved=>{
        console.log("register", res.body)
        res.status(201).json(saved);
      })
      .catch(error =>{
        res.status(500).json(error);
      })
    
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;
  console.log("inside login function", req.session)
  Users.findBy({ username }).first()
    .then(user =>{
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({message: `Welcome ${user.username}`, token});
      } else {
        res.status(401).json({message: 'A valid username and password are required.'})
      }
    })
    .catch(err =>{
      console.log(err);
      res.status(500).json(err);
    })
});

function generateToken(user){
  const payload = {
    subject: user.id,
    username: user.username
  }

    const options = {
    expiresIn: '8h'
  }

  return jwt.sign(payload, secret.jwtSecret, options)
}

module.exports = router;
