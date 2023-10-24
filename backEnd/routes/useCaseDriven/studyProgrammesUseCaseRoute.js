const express = require('express');
const router = express.Router();

const {
    getAllStudyProgrammes, getAllSubjectsWithDescriptionNameStudyDegreeSubjectsWithNameAndId
} = require('../../controllers/useCaseDriven/userUseCaseController');

const {protect} = require('../../controllers/dataDriven/authController');

router.route('/')
    .get(protect, getAllStudyProgrammes)

/*get all, create one*/
router.route('/2')
    .get(getAllSubjectsWithDescriptionNameStudyDegreeSubjectsWithNameAndId)

module.exports = router;