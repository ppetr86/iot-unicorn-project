const express = require('express');
const router = express.Router();

const {
    createUser,
    deleteUser,
    getAllUsers,
    getUser,
    putUser,
} = require('../controllers/userController');


const {
    protectWithAuthenticationToken,
    authorize,
    adminOrOwnerAccessOrThrow,
    adminAccessOrThrow,
    adminifyThrow
} = require('../middleware/Authentication');

/*get by id, delete by id, put by id*/
router.route("/:id")
    .get(protectWithAuthenticationToken, adminOrOwnerAccessOrThrow, getUser)
    .delete(protectWithAuthenticationToken, adminAccessOrThrow, deleteUser)
    .put(protectWithAuthenticationToken, adminOrOwnerAccessOrThrow, adminifyThrow, putUser);

/*get all, create one*/
router.route('/')
    .get(protectWithAuthenticationToken, adminAccessOrThrow, getAllUsers)
    .post(createUser)

module.exports = router;