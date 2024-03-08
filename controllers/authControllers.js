const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { success, error } = require("../utils/responseWrapper");

const signupController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.send(error(400, 'All feilds are required'))
        }

        const oldUser = await User.findOne({ email })

        if (oldUser) {
            return res.send(error(409, 'User already axixt'))
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        return res.send(success(201, { user }))

    } catch (e) {
        return res.send(error(500, e.message))
    }
}

const loginContrller = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.send(error(400, "All feilds are required"))
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.send(error(404, "User not found"))
        }

        const matchedPassword = await bcrypt.compare(password, user.password)

        if (!matchedPassword) {
            return res.send(error(401, 'Please enter correct password'))
        }

        const accessToken = generateAccessToken({ _id: user._id })

        const refreshToken = generateRefreshToken({ _id: user._id })

        // res.send(success(200, 'User Logged in'))
        // res.send(success(200, { user }))

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true
        })

        console.log('refresh in login controller :', refreshToken);

        console.log('accessToken in login controller', accessToken);


        return res.send(success(200, { userId: user._id, accessToken, refreshToken }))

    } catch (e) {
        return res.send(error(500, e.message))
    }
}

const refreshAccessTokenController = async (req, res) => {

    const cookies = req.cookies;

    if (!cookies.jwt) {
        return res.send(error(404, 'refresh token is required'))
    }

    const refreshToken = cookies.jwt

    console.log('new token is ', refreshToken);

    console.log('Cookies refreshToken : ', cookies);


    if (!refreshToken) {
        return res.send(error(400, 'refreshToken is required'))
    }

    try {

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY)

        console.log('decoded in refresh logic ', decoded);

        const _id = decoded._id

        console.log('User ID in refresh token logic : ', _id);


        const accessToken = generateAccessToken({ _id })

        console.log('Final Access token in refresh login :', accessToken);

        return res.send(success(200, { accessToken }))

    } catch (e) {
        console.log(e);
        return res.send(error(401, 'Invalid access token key'))

    }

}

// INternal Function

const generateAccessToken = (data) => {
    try {
        const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: '15m' })

        return token;

    } catch (e) {
        console.log(e);
    }
}

const generateRefreshToken = (data) => {
    try {
        const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, { expiresIn: '1y' });

        return refreshToken

    } catch (e) {
        console.log(e);
    }
}

const logoutController = (req, res) => {

    try {
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true
        })

        return res.send(success(200, 'User logged out'))

    } catch (e) {
        return res.send(500, e.message)
    }

}

module.exports = {
    signupController,
    loginContrller,
    logoutController,
    refreshAccessTokenController
}