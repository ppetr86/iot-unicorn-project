const asyncWrapper = require("../../middleware/Async");
const {createCustomError} = require("../../errors/CustomApiError");
const {StatusCodes} = require('http-status-codes');
const StudyProgrammeAbl = require("../../abl/AnimalKindAbl");
const {ResponseObjDto} = require("../../entities/ResponseObjDto");

/**
 * if we need some special frontend endpoints related to user and not obtainable by basic CRUD user endpoints
 * and parameters, or just to simplify some api calls which would need parameters create the endpoints here
 * Below are examples how we used it in similar project
 * */

/*
const getAllStudyProgrammes = asyncWrapper(async (req, res, next) => {
    req.query.populate = "subjects.mandatory,subjects.optional,subjects.obligatorySelective"
    const dbDocuments = await StudyProgrammeAbl.getAll(req.query);
    if (!dbDocuments)
        return next(createCustomError(`Request failed`, StatusCodes.INTERNAL_SERVER_ERROR));

    const studyProgrammeDtoOutArray = dbDocuments.map(each => new StudyProgrammeUseCaseDtoOut(each));

    res.status(StatusCodes.OK)
        .json(new ResponseObjDto(studyProgrammeDtoOutArray, "success"));
});

const getAllNamesAndTypes = asyncWrapper(async (req, res, next) => {
    req.query.fields = "name,type"

    const dbDocuments = await StudyProgrammeAbl.getAll(req.query);
    if (!dbDocuments)
        return next(createCustomError(`Request failed`, StatusCodes.INTERNAL_SERVER_ERROR));

    const nameTypeArr = dbDocuments.map(each => new NameTypeDtoOut(each));

    res.status(StatusCodes.OK)
        .json(new ResponseObjDto(nameTypeArr, "success"));
});


const getAllSubjectsWithDescriptionNameStudyDegreeSubjectsWithNameAndId = asyncWrapper(async (req, res, next) => {
    const dbDocuments = await StudyProgramme
        .find()
        .select('description name studyDegree')
        .populate({
            path: 'subjects.mandatory subjects.optional subjects.obligatorySelective',
            select: 'name _id'
        });

    if (!dbDocuments)
        return next(createCustomError(`Request failed`, StatusCodes.INTERNAL_SERVER_ERROR));

    const studyProgrammeDtoOutArray = StudyProgrammeAbl.mapDatabaseDocumentsToJsons(dbDocuments);

    res.status(StatusCodes.OK)
        .json(new ResponseObjDto(studyProgrammeDtoOutArray, "success"));
});

module.exports = {
    getAllStudyProgrammes, getAllSubjectsWithDescriptionNameStudyDegreeSubjectsWithNameAndId
};*/
