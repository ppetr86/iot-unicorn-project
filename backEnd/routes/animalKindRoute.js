const express = require('express');
const router = express.Router();

const {
    createAnimalKind,
    deleteAnimalKind,
    getAllAnimalKinds,
    getAnimalKind,
    putAnimalKind,
    patchAnimalKind,
} = require('../controllers/animalKindController');

const {
    protectWithAuthenticationToken,
    authorize,
} = require('../middleware/AuthMiddleware');

/*get by id, delete by id, put by id*/
router.route("/:id")
    .get(getAnimalKind) //do not protectWithAuthenticationToken
    .delete(protectWithAuthenticationToken, authorize(["ROLE_ADMIN"]), deleteAnimalKind)
    .put(protectWithAuthenticationToken, authorize(["ROLE_ADMIN"]), putAnimalKind)
    .patch(protectWithAuthenticationToken, authorize(["ROLE_ADMIN"]), patchAnimalKind);

/*get all, create one*/
router.route('/')
    .get(getAllAnimalKinds)
    .post(protectWithAuthenticationToken, authorize(["ROLE_ADMIN"]), createAnimalKind);

module.exports = router;