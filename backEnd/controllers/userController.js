const User = require('../entities/db/UserSchema');
const asyncWrapper = require("../middleware/Async");
const {CustomApiError} = require("../errors/CustomApiError");
const {StatusCodes} = require('http-status-codes');
const {UserDtoOut} = require("../entities/dtoOut/UserDtoOut");
const UserPutDtoIn = require("../entities/dtoIn/UserPutDtoIn");
const UserCreateDtoIn = require("../entities/dtoIn/UserCreateDtoIn");
const UserDao = require("../dao/UserDao");

const getAllUsers = asyncWrapper(async (req, res, next) => {

    const dbDocuments = await UserDao.getAll(req.query);

    if (!dbDocuments)
        return next(new CustomApiError(`Request failed`, StatusCodes.NOT_FOUND));

    const userDtoOutArray = dbDocuments.map(each => new UserDtoOut(each));

    res.status(StatusCodes.OK).json({
        status: "success",
        length: userDtoOutArray.length,
        data: userDtoOutArray
    });
});


const deleteUser = asyncWrapper(async (req, res, next) => {

    const {id: userId} = req.params;
    const dbDocument = await User.findOneAndDelete({_id: userId});

    if (!dbDocument)
        return next(new CustomApiError(`No resource with id: ${userId}`, StatusCodes.NOT_FOUND));

    dbDocument.password = undefined;

    res.status(StatusCodes.OK).json({
        status: "success",
        data: new UserDtoOut(dbDocument)
    });
});

const putUser = asyncWrapper(async (req, res, next) => {

    const {error} = UserPutDtoIn.validate(req.body);
    if (error)
        return next(new CustomApiError(error), StatusCodes.BAD_REQUEST);

    const dbDocument = await User.findOneAndUpdate({_id: req.params.id}, req.body, {
        new: true,
        runValidators: true,
    });

    if (!dbDocument)
        return next(new CustomApiError(`No resource with id: ${req.user.id}`, StatusCodes.NOT_FOUND));

    res.status(StatusCodes.CREATED).json({
        status: "success",
        data: dbDocument
    });
});

const getUser = asyncWrapper(async (req, res, next) => {

    let dbDocument = await UserDao.get(req.params.id, req.query);

    if (!dbDocument)
        return next(new CustomApiError(`No resource with id: ${req.params.id}`, StatusCodes.NOT_FOUND));

    res.status(StatusCodes.OK).json({
        status: "success",
        data: new UserDtoOut(dbDocument),
    });
});

const createUser = asyncWrapper(async (req, res, next) => {
    delete req.body["repeatPassword"]

    const {error} = UserCreateDtoIn.validate(req.body);
    if (error)
        return next(new CustomApiError(error), StatusCodes.BAD_REQUEST);

    if (await User.isExistingByEmail(req.body.email))
        return next(new CustomApiError(`User with email ${req.body.email} already exists.`, StatusCodes.BAD_REQUEST));

    let activatedNotAdminUser = {...req.body, isDeactivated: false};

    const user = new User(activatedNotAdminUser);
    let validationErrors = user.collectValidationErrors();
    if (validationErrors) {
        return next(new CustomApiError(`Validation errors: ${validationErrors}`, StatusCodes.BAD_REQUEST));
    }

    const dbDocument = await user.save();

    if (!dbDocument)
        return next(new CustomApiError(`Object was not created`, StatusCodes.INTERNAL_SERVER_ERROR));

    res.status(StatusCodes.CREATED).json({
        status: "success",
        data: new UserDtoOut(dbDocument)
    });
});


module.exports = {
    getAllUsers,
    deleteUser,
    putUser,
    getUser,
    createUser,
};
