const express = require('express');
const router = express.Router();

const {
    createAnimalKind,
    deleteAnimalKind,
    getAllAnimalKinds,
    getAnimalKind,
    putAnimalKind,
    patchAnimalKind,
} = require('../../controllers/dataDriven/animalKindController');

const {
    protect,
    authorize,
    adminOrOwnerAccessOrThrow,
    adminAccessOrThrow,
    adminifyThrow
} = require('../../middleware/Authentication');

/*get by id, delete by id, put by id*/
router.route("/:id")
    .get(getAnimalKind) //do not protect
    .delete(protect, authorize(["ROLE_ADMIN"]), deleteAnimalKind)
    .put(protect, authorize(["ROLE_ADMIN"]), putAnimalKind)
    .patch(protect, authorize(["ROLE_ADMIN"]), patchAnimalKind);

/*get all, create one*/
router.route('/')
    .get(getAllAnimalKinds)
    .post(protect, authorize(["ROLE_ADMIN"]), createAnimalKind);

module.exports = router;