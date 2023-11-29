const express = require('express');
const router = express.Router();

const {
    getAllUserTerrariums,
    getTerrariumByHardwarioCode,
    getTerrariumByTerrariumId,
    getTerrariumDataByTerrariumId,
    createUserTerrarium,
    deleteUserTerrarium
} = require('../controllers/FrontendController');

const {
    protectWithAuthenticationToken,
    requestingUserIsTheSameAsPathUserOrThrow
} = require('../middleware/AuthenticationMiddleware');

router.route("/:id/terrariums")
    .get(protectWithAuthenticationToken, getAllUserTerrariums)
    .post(protectWithAuthenticationToken, requestingUserIsTheSameAsPathUserOrThrow, createUserTerrarium);

router.route("/:id/terrariums/:terrariumId")
    .delete(protectWithAuthenticationToken, requestingUserIsTheSameAsPathUserOrThrow, deleteUserTerrarium)
    .get(protectWithAuthenticationToken, getTerrariumByTerrariumId);

router.route("/:id/terrariumsHc/:hardwarioCode")
    .get(protectWithAuthenticationToken, getTerrariumByHardwarioCode);


router.route("/:id/terrariums/:terrariumId/data").get(protectWithAuthenticationToken, getTerrariumDataByTerrariumId)

module.exports = router;