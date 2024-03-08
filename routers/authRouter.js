const router = require('express').Router()
const authController = require('../controllers/authControllers')
const requireUser = require('../middlewares/requireUser')

router.post('/signup', authController.signupController)
router.post('/login', authController.loginContrller)
router.get('/refresh', authController.refreshAccessTokenController)
router.post('/logout', authController.logoutController)

module.exports = router