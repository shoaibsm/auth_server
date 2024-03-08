const router = require('express').Router();
const authRouter = require('../routers/authRouter')
const userRouter = require('../routers/userRouter')

router.use('/auth', authRouter)
router.use('/user', userRouter)
module.exports = router