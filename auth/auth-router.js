const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('../users/users-model')

router.post('/register', (req, res) => {
  let user = req.body;

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
        req.session.user = user;
        console.log("set the session", req.session)
        res.status(200).json({message: `Welcome ${user.username}`});
      } else {
        res.status(401).json({message: 'A valid username and password are required.'})
      }
    })
    .catch(err =>{
      console.log(err);
      res.status(500).json(err);
    })
});

module.exports = router;
