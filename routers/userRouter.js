const router = require('express').Router();
const userController = require('../controllers/userController');
const requireUser = require('../middlewares/requireUser');

router.get('/getUser/:userId', requireUser, userController.getUserController);
router.get('/allUser', requireUser, userController.getAllUserController)
router.delete('/deleteUser/:userId', userController.deleteUserController)

module.exports = router