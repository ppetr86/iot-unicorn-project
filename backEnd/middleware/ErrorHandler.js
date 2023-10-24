const {StatusCodes} = require('http-status-codes');
const errorHandlerMiddleware = (err, req, res, next) => {
    return res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json({error: err.message || 'Something went wrong try again later'});
};

module.exports = errorHandlerMiddleware;
