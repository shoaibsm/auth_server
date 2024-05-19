const User = require("../models/User");
const { error, success } = require("../utils/responseWrapper");

// const getUserController = async (req, res) => {
//     try {
//         const curUserId = req.params.userId;

//         if (!curUserId) {
//             return res.send(error(404, 'User id is required'));
//         }

//         const user = await User.findById(curUserId);

//         return res.send(success(200, { user }));
//     } catch (e) {
//         return res.send(error(500, e.message));
//     }
// };

const getMyInfo = async (req, res) => {
    try {
        const _id = req._id

        const user = await User.findById(_id)

        if (!user) {
            return res.send(error(404, 'User not found'))
        }

        return res.send(success(200, { user }))

    } catch (e) {
        return res.send(500, e.message)
    }
}

const getAllUserController = async (req, res) => {
    try {

        const allUser = await User.find();

        return res.send(success(200, { allUser }))

    } catch (e) {
        return res.send(error(500, e.message))
    }
}

const deleteUserController = async (req, res) => {
    try {

        // const curUserId = req.params.userId
        const curUserId = req._id


        // if (!curUserId) {
        //     return res.send(error(404, 'User Id is required'))
        // }

        // Log the user ID and deletion process
        console.log(`Deleting user with ID: ${curUserId}`);

        const curUser = await User.findById(curUserId)

        if (!curUser) {
            return res.send(error(404, 'User not found'))
        }

        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true
        })

        // Delete the user
        await curUser.deleteOne({ _id: curUserId });

        // Check if the user deletion was successful
        const deletedUser = await User.findById(curUserId);

        if (!deletedUser) {
            console.log(`User with ID ${curUserId} deleted successfully.`);
        } else {
            console.log(`Failed to delete user with ID: ${curUserId}`);
        }

        return res.send(success(200, 'User deleted'))

    } catch (e) {
        return res.send(error(500, e.message))
    }
}

module.exports = {
    // getUserController,
    getAllUserController,
    getMyInfo,
    deleteUserController
};