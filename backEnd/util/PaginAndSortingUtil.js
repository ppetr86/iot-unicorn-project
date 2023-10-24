const {API_LIMIT_MAX, API_LIMIT_DEFAULT} = require('./Constants');

const pageSpecification = (pageQueryParam) => {
    let pageNr = 0;
    if (pageQueryParam && !isNaN(pageQueryParam)) {
        pageNr = Number(pageQueryParam) - 1;
    }
    return pageNr;
}

const limitSpecification = (limitQueryParam) => {
    const limit = API_LIMIT_DEFAULT;
    if (limitQueryParam && !isNaN(limitQueryParam))
        return Math.min(Number(limitQueryParam), API_LIMIT_MAX);
    return limit;
}

const skipSpecification = (page, limit) => {
    if (!isNaN(Number(limit)))
        return page * Math.min(Number(limit), API_LIMIT_MAX);
    return 0;
}

const numericFilterToMongoMappingRegex = /\b(>|>=|=|<|<=)\b/g;

const sortSpecification = (sortString) => {
    if (!sortString)
        return {};

    // sort result by fields
    // default sort dir is ASC to make DESC: insert minus "?sort?-userName"
    return sortString.split(',').join(' ');
}

const findWhereSpecification = (queryObject,
                                arrayOfNumericFieldsOnSchema,
                                isDisjunctionSearch) => {
    // remove page limit skip sort numericFilters
    // create collection.find({}) aka SQL WHERE
    const resultQueryObject = {...queryObject};

    ['page', 'limit', 'skip', 'sort', 'fields', 'numericFilters'].forEach(each => {
        if (resultQueryObject.hasOwnProperty(each))
            delete resultQueryObject[each]
    });

    if (arrayOfNumericFieldsOnSchema && queryObject.numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        };
        let filters = queryObject.numericFilters.replace(
            numericFilterToMongoMappingRegex,
            (match) => `-${operatorMap[match]}-`
        );

        filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-');
            if (arrayOfNumericFieldsOnSchema.includes(field)) {
                resultQueryObject[field] = {[operator]: Number(value)};
            }
        });
    }

    // ideal case scenario, only schema properties should remain
    if (isDisjunctionSearch) {
        const arrOfQueries = [];
        for (const property in resultQueryObject) {
            arrOfQueries.push({[property]: resultQueryObject[property]});
        }
        return {$or: arrOfQueries};
    } else {
        return resultQueryObject;
    }
}

const fieldsSelectionSpecification = (fieldsString) => {
    if (!fieldsString)
        return {};

    const fieldsList = fieldsString.split(',');

    const selectObject = {};
    for (const field of fieldsList) {
        selectObject[field] = 1;
    }

    return selectObject;
}

module.exports = {
    fieldsSelectionSpecification,
    sortSpecification,
    findWhereSpecification,
    pageSpecification,
    limitSpecification,
    skipSpecification,
};