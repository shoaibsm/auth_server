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

        const _id = decoded._id

        console.log(`id is ${_id}`);

        const user = await User.findOne({ _id })

        console.log(`user is ${user}`);

        if (!user) {
            return res.send(error(404, 'Unauthorized User'))
        }

    } catch (e) {
        console.log(e);
        return res.send(error(401, 'Invalid access key'))
    }

    next();
}


