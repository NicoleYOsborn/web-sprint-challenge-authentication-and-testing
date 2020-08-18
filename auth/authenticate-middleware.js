/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/
const jwt = require('jsonwebtoken')
const secret = require('../secrets')

function restricted() {
  return async (req, res, next) =>{
    const authError = {
        message: 'Please enter valid credentials',
    }
    const [authType, token] = req.headers.authorization.split(" ");

    try {

        if(!token){
            return res.status(401).json(authError)
        } 
        jwt.verify(token, secrets.jwtSecret, (err, decoded)=>{
            if(err){
                return res.status(401).json(authError)
            }

             next()
        })
       
    } catch(err) {
        next(err)
    }
}

  // console.log(req.session);
  // if(req.session && req.session.user) {
  //   next();
  // } else {
  //   res.status(400).json({message: 'Please enter valid credentials'})
  // }
  
};

module.exports = restricted