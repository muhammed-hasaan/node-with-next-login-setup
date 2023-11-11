const sendResponse = require("./sendResponse")
const jwt = require('jsonwebtoken')
require('dotenv').config()

const authenticateJwt = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]
    try {
        if (token) {
            var decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded) {
                req.userId = decoded.data._id
                next()
            }
        } else {
            sendResponse(res, 403, null, 'Token not provided', true)
            next()
        }
    }
    catch (err) {
        sendResponse(res, 403, null, 'Invalid Token', true)
        next()
    }

}

module.exports = authenticateJwt