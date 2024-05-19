const User = require("../models/User");
const { error } = require("../utils/responseWrapper");
const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
    if (
        !req.headers ||
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer')
    ) {
        return res.send(error(404, 'Authorization header is required'))
    }

    const accessToken = req.headers.authorization.split(" ")[1]
    try {

        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_PRIVATE_KEY)

        // send user id in request 
        req._id = decoded._id

        const user = await User.findById(req._id)

        if (!user) {
            return res.send(error(404, 'User Not Found'))
        }

        next()

    } catch (e) {
        console.log(e);
        return res.send(error(401, 'Invalid access key'))
    }
}


