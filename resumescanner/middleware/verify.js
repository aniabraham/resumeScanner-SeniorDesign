// pretty much all of this from
// https://www.youtube.com/watch?v=7nafaH9SddU
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined') {

        const bearer = bearerHeader.split(' ');

        const bearerToken = bearer[1];

        req.token = bearerToken;

        next();
    } 
    
    else {
        // Forbidden
        res.sendStatus(403);
    }
}

module.exports = verifyToken;