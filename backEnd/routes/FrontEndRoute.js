const express = require('express');
const router = express.Router();

const {
    getAllUserTerrariums,
    getTerrariumByHardwarioCode,
    getTerrariumByTerrariumId,
    getTerrariumDataByTerrariumId,
    createUserTerrarium,
    deleteUserTerrariumById,
    putUserTerrariumByTerrariumId,
    getUserWithAllUserTerrariums,
    addTerrariumIdToAnotherUserId
} = require('../controllers/FrontendController');

const {
    protectWithAuthenticationToken,
    requestingUserIsTheSameAsPathUserOrThrow,
    requestingUserHasAccessToTerrarium,
    isTerrariumIdValid,
    isUserIdValid,
} = require('../middleware/AuthMiddleware');

router.route("/:id/terrariums")
    .get(protectWithAuthenticationToken, isUserIdValid, getAllUserTerrariums)
    .post(protectWithAuthenticationToken, isUserIdValid, requestingUserIsTheSameAsPathUserOrThrow, createUserTerrarium);

router.route("/:id/populated")
    .get(protectWithAuthenticationToken, isUserIdValid, getUserWithAllUserTerrariums)

router.route("/:id/terrariums/:terrariumId")
    .delete(protectWithAuthenticationToken, isUserIdValid, isTerrariumIdValid, requestingUserIsTheSameAsPathUserOrThrow, requestingUserHasAccessToTerrarium, deleteUserTerrariumById)
    .get(protectWithAuthenticationToken, isUserIdValid, isTerrariumIdValid, requestingUserIsTheSameAsPathUserOrThrow, requestingUserHasAccessToTerrarium, getTerrariumByTerrariumId)
    .put(protectWithAuthenticationToken, isUserIdValid, isTerrariumIdValid, requestingUserIsTheSameAsPathUserOrThrow, requestingUserHasAccessToTerrarium, putUserTerrariumByTerrariumId)
    .patch(protectWithAuthenticationToken, isUserIdValid, isTerrariumIdValid, requestingUserIsTheSameAsPathUserOrThrow, addTerrariumIdToAnotherUserId);

router.route("/:id/terrariumsHc/:hardwarioCode")
    .get(protectWithAuthenticationToken, isUserIdValid, getTerrariumByHardwarioCode);


router.route("/:id/terrariums/:terrariumId/data")
    .get(protectWithAuthenticationToken, isUserIdValid, isTerrariumIdValid, requestingUserHasAccessToTerrarium, getTerrariumDataByTerrariumId)

module.exports = router;