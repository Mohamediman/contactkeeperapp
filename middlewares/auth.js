//===== this middleware will check if there is a valid token in the header
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');
  
    if(!token){
        res.status(401).json({msg: "invalid Token, Authorization denied" })
    };

    try {
        const decoded = jwt.verify(token, config.get('secret'));
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error(err.message);
        res.status(401).json({ msg: "Authorization Denied..." });
    }
}