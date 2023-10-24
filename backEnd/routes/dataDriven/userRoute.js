const express = require('express');
const router = express.Router();

const {
    createUser,
    deleteUser,
    getAllUsers,
    getUser,
    putUser,
} = require('../../controllers/dataDriven/userController');


const {
    protect,
    authorize,
    adminOrOwnerAccessOrThrow,
    adminAccessOrThrow,
    adminifyThrow
} = require('../../middleware/Authentication');

/*get by id, delete by id, put by id*/
router.route("/:id")
    .get(protect, adminOrOwnerAccessOrThrow, getUser)
    .delete(protect, adminAccessOrThrow, deleteUser)
    .put(protect, adminOrOwnerAccessOrThrow, adminifyThrow, putUser);

/*get all, create one*/
router.route('/')
    .get(protect, adminAccessOrThrow, getAllUsers)
    .post(createUser)

module.exports = router;