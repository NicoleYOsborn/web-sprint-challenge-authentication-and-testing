/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/


module.exports = (req, res, next) => {
  console.log(req.session);
  if(req.session && req.session.user) {
    next();
  } else {
    res.status(400).json({message: 'Please enter valid credentials'})
  }
  
};
