const asyncWrapper = require("../../middleware/Async");
const {CustomApiError} = require("../../errors/CustomApiError");
const {StatusCodes} = require('http-status-codes');
const AnimalKindAbl = require("../../abl/AnimalKindAbl");
const {ResponseObjDto} = require("../../entities/ResponseObjDto");
const {AnimalKindDtoIn} = require("../../entities/dtoIn/AnimalKindDtoIn");
const {AnimalKindDtoOut} = require("../../entities/dtoOut/AnimalKindDtoOut");

const getAllAnimalKinds = asyncWrapper(async (req, res, next) => {
    const dbDocuments = await AnimalKindAbl.getAll(req.query);
    if (!dbDocuments)
        return next(new CustomApiError(`Request failed`, StatusCodes.INTERNAL_SERVER_ERROR));

    const animalArray = dbDocuments.map(each => new AnimalKindDtoOut(each));

    res.status(StatusCodes.OK)
        .json(new ResponseObjDto(animalArray, "success"));
});

const deleteAnimalKind = asyncWrapper(async (req, res, next) => {
    const dbDocument = await AnimalKindAbl.delete(req.params.id);

    if (!dbDocument)
        return next(new CustomApiError(`No resource with id: ${req.params.id}`, StatusCodes.NOT_FOUND));

    res.status(StatusCodes.OK)
        .json(new ResponseObjDto(new AnimalKindDtoOut(dbDocument), "deleted"));
});

const putAnimalKind = asyncWrapper(async (req, res, next) => {

    const {error} = AnimalKindDtoIn.validate(req.body);
    if (error)
        return next(new CustomApiError(error, StatusCodes.BAD_REQUEST));

    const dbDocument = await AnimalKindAbl.put(req.params.id, req.body);

    if (!dbDocument)
        return next(new CustomApiError(`No resource with id: ${req.params.id}`, StatusCodes.NOT_FOUND));

    res.status(StatusCodes.OK)
        .json(new ResponseObjDto(
            new AnimalKindDtoOut(dbDocument), `updated`));
});

const getAnimalKind = asyncWrapper(async (req, res, next) => {

    const dbDocument = await AnimalKindAbl.get(req.params.id, req.query);

    if (!dbDocument)
        return next(new CustomApiError(`Error getting AnimalKind id: ${req.params.id}.`, StatusCodes.NOT_FOUND));

    res.status(StatusCodes.OK)
        .json(new ResponseObjDto(new AnimalKindDtoOut(dbDocument), "success"));
});

const createAnimalKind = asyncWrapper(async (req, res, next) => {

    const {error} = AnimalKindDtoIn.validate(req.body);
    if (error)
        return next(new CustomApiError(error, StatusCodes.BAD_REQUEST));

    const dbDocument = await AnimalKindAbl.create(req.body);

    if (!dbDocument)
        return next(new CustomApiError(`AnimalKind was not created`, StatusCodes.INTERNAL_SERVER_ERROR));

    res.status(StatusCodes.CREATED)
        .json(new ResponseObjDto(new AnimalKindDtoOut(dbDocument), "created"));
});

const patchAnimalKind = asyncWrapper(async (req, res, next) => {

    const updateObjectKeys = Object.keys(req.query);
    const allowedUpdates = Object.keys(AnimalKindDtoIn.describe().keys);
    const isValidOperation = updateObjectKeys.every(update => allowedUpdates.includes(update));
    if (!isValidOperation)
        return next(new CustomApiError(`Request Parameters do not match contract`, StatusCodes.BAD_REQUEST));

    const dbDocument = await AnimalKindAbl.put(req.params.id, req.query);

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