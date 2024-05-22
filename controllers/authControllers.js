const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { success, error } = require("../utils/responseWrapper");
const cloudinary = require("cloudinary").v2;

const signupController = async (req, res) => {
    try {
        const { name, email, password, userImg } = req.body;
        if (!name || !email || !password) {
            return res.send(error(400, 'All feilds are required'))
        }

        const oldUser = await User.findOne({ email })

        if (oldUser) {
            return res.send(error(409, 'User already axixt'))
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        let cloudImgUrl = '';
        let cloudImgPublicId = '';

        if (userImg) {
            try {

                const cloudImg = await cloudinary.uploader.upload(userImg, {
                    folder: "userAuth",
                });

                cloudImgUrl = cloudImg.secure_url;
                cloudImgPublicId = cloudImg.public_id

                console.log('image url ', cloudImg);
                console.log('image public id ', cloudImgPublicId);

            } catch (error) {
                console.log('error in signup auth ', error);
            }
        }

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            avatar: {
                url: cloudImgUrl,
                publicId: cloudImgPublicId,
            }
        })

        console.log({ user });

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
            return res.send(error(403, 'Incorrect password'))
        }

        const accessToken = generateAccessToken({ _id: user._id })

        const refreshToken = generateRefreshToken({ _id: user._id })

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true
        })

        console.log('refresh in login controller :', refreshToken);

        console.log('accessToken in login controller', accessToken);


        // return res.send(success(200, { userId: user._id, accessToken, refreshToken }))

        return res.send(success(200, {
            accessToken
        }))

    } catch (e) {
        return res.send(error(500, e.message))
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

const refreshAccessTokenController = async (req, res) => {

    const cookies = req.cookies;

    if (!cookies || !cookies.jwt) {
        return res.send(error(401, 'RefreshToken in cookie is required'))
    }

    const refreshToken = cookies.jwt

    try {

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY)

        const _id = decoded._id

        const accessToken = generateAccessToken({ _id })

        return res.send(success(201, { accessToken }))

    } catch (e) {
        console.log(e);
        return res.send(error(401, 'Invalid access token key'))

    }

}

// INternal Function

const generateAccessToken = (data) => {
    try {
        const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: '10s' })

        return token;

    } catch (e) {
        console.log(e);
    }
}

const generateRefreshToken = (data) => {
    try {
        const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, { expiresIn: '1m' });

        return refreshToken

    } catch (e) {
        console.log(e);
    }
}



module.exports = {
    signupController,
    loginContrller,
    logoutController,
    refreshAccessTokenController
}