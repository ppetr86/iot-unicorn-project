const express = require('express');
const router = express.Router();

const {
    getAllUserTerrariums, getTerrariumByHardwarioCode, getTerrariumByTerrariumId,getTerrariumDataByTerrariumId
} = require('../controllers/FrontendController');

const {
    protectWithAuthenticationToken,
} = require('../middleware/AuthenticationMiddleware');

router.route("/:id/terrariums").get(protectWithAuthenticationToken, getAllUserTerrariums);
router.route("/:id/terrariumsHc/:hardwarioCode").get(protectWithAuthenticationToken, getTerrariumByHardwarioCode)
router.route("/:id/terrariumsId/:terrariumId").get(protectWithAuthenticationToken, getTerrariumByTerrariumId)
router.route("/:id/terrariumsId/:terrariumId/data").get(protectWithAuthenticationToken, getTerrariumDataByTerrariumId)

module.exports = router;