const asyncWrapper = require("../middleware/Async");
const {CustomApiError} = require("../errors/CustomApiError");
const {StatusCodes} = require('http-status-codes');
const AnimalKindDao = require("../dao/AnimalKindDao");
const {ResponseObjDto} = require("../entities/ResponseObjDto");
const {AnimalKindDtoOut} = require("../entities/dtoOut/AnimalKindDtoOut");
const {AnimalKindValidationIn} = require("../entities/dtoIn/validation/AnimalKindValidationIn");
const {AnimalKindDtoIn} = require("../entities/dtoIn/ClassDtosIn");

const getAllAnimalKinds = asyncWrapper(async (req, res, next) => {
    const dbDocuments = await AnimalKindDao.getAll(req.query);
    if (!dbDocuments)
        return next(new CustomApiError(`Request failed`, StatusCodes.INTERNAL_SERVER_ERROR));

    const animalArray = dbDocuments.map(each => new AnimalKindDtoOut(each));

    res.status(StatusCodes.OK)
        .json(new ResponseObjDto(animalArray, "success"));
});

const deleteAnimalKind = asyncWrapper(async (req, res, next) => {
    const dbDocument = await AnimalKindDao.delete(req.params.id);

    if (!dbDocument)
        return next(new CustomApiError(`No resource with id: ${req.params.id}`, StatusCodes.NOT_FOUND));

    res.status(StatusCodes.OK)
        .json(new ResponseObjDto(new AnimalKindDtoOut(dbDocument), "deleted"));
});

const putAnimalKind = asyncWrapper(async (req, res, next) => {

    const {error} = AnimalKindValidationIn.validate(req.body);
    if (error)
        return next(new CustomApiError(error, StatusCodes.BAD_REQUEST));

    const animalKindIn = new AnimalKindDtoIn(req.body);
    const dbDocument = await AnimalKindDao.put(req.params.id, animalKindIn);

    if (!dbDocument)
        return next(new CustomApiError(`No resource with id: ${req.params.id}`, StatusCodes.NOT_FOUND));

    res.status(StatusCodes.OK)
        .json(new ResponseObjDto(
            new AnimalKindDtoOut(dbDocument), `updated`));
});

const getAnimalKind = asyncWrapper(async (req, res, next) => {

    const dbDocument = await AnimalKindDao.get(req.params.id, req.query);

    if (!dbDocument)
        return next(new CustomApiError(`Error getting AnimalKind id: ${req.params.id}.`, StatusCodes.NOT_FOUND));

    res.status(StatusCodes.OK)
        .json(new ResponseObjDto(new AnimalKindDtoOut(dbDocument), "success"));
});

const createAnimalKind = asyncWrapper(async (req, res, next) => {

    const {error} = AnimalKindValidationIn.validate(req.body);
    if (error)
        return next(new CustomApiError(error, StatusCodes.BAD_REQUEST));

    const animalKindIn = new AnimalKindDtoIn(req.body);
    const dbDocument = await AnimalKindDao.create(animalKindIn);

    if (!dbDocument)
        return next(new CustomApiError(`AnimalKind was not created`, StatusCodes.INTERNAL_SERVER_ERROR));

    res.status(StatusCodes.CREATED)
        .json(new ResponseObjDto(new AnimalKindDtoOut(dbDocument), "created"));
});

const patchAnimalKind = asyncWrapper(async (req, res, next) => {

    const updateObjectKeys = Object.keys(req.query);
    const allowedUpdates = Object.keys(AnimalKindValidationIn.describe().keys);
    const isValidOperation = updateObjectKeys.every(update => allowedUpdates.includes(update));
    if (!isValidOperation)
        return next(new CustomApiError(`Request Parameters do not match contract`, StatusCodes.BAD_REQUEST));

    const dbDocument = await AnimalKindDao.put(req.params.id, req.query);

    if (!dbDocument)
        return next(new CustomApiError(`Error putting AnimalKind id: ${req.params.id}.`, StatusCodes.NOT_FOUND));

    res.status(StatusCodes.OK)
        .json(new ResponseObjDto(new AnimalKindDtoOut(dbDocument), "patched"));
});

module.exports = {
    getAllAnimalKinds,
    deleteAnimalKind,
    putAnimalKind,
    getAnimalKind,
    createAnimalKind,
    patchAnimalKind,
};