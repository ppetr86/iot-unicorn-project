"use strict";
const {
    findWhereSpecification,
    sortSpecification,
    fieldsSelectionSpecification,
    pageSpecification,
    limitSpecification,
    skipSpecification
} = require("../util/PaginAndSortingUtil");
const {CustomApiError} = require("../errors/CustomApiError");

function populateSpecification(populateString) {
    if (!populateString) {
        return
    }
    const populateArray = [];
    for (const each of populateString.split(",")) {
        if (each.includes("."))
            populateArray.push(populateSpecificationNestedObject(each));
        else
            populateArray.push({path: each});
    }
    return populateArray;
}

function populateSpecificationNestedObject(path) {
    if (!path) {
        return;
    }
    const [first, ...rest] = path.split(".");
    if (rest.length === 0) {
        return {path: first};
    } else {
        return {
            path: first,
            populate: populateSpecificationNestedObject(rest.join("."))
        };
    }
}

class BaseDao {
    constructor(schema) {
        this.schema = schema;
        this.className = this.constructor.name;
    }

    getClassName() {
        return this.className;
    }

    /**
     *  .lean() function is used to optimize database queries by returning plain JavaScript objects instead of Mongoose
     *  documents. By default, Mongoose documents contain a lot of metadata and methods which can slow down queries,
     *  especially when dealing with large data sets.
     *
     * When a query is executed with .lean(), Mongoose bypasses its own schema validation and creates a plain JavaScript
     * object directly from the MongoDB server's response. This can result in a significant performance improvement for
     * read-only operations such as find(), findOne(), and aggregate().
     *
     * Keep in mind that when using .lean(), the returned object will not have any of the Mongoose document methods or
     * properties, such as .save(), .validate(), or .populate(). It will also not have the same validation and
     * middleware functionality as a Mongoose document.*/
    async getAll(queryParameters) {

        const dbDocuments = await this.schema
            .find(findWhereSpecification(queryParameters, [], false))
            .sort(sortSpecification(queryParameters.sort))
            .collation({locale: 'en', strength: 2})
            .select(fieldsSelectionSpecification(queryParameters.fields))
            .populate(populateSpecification(queryParameters.populate))
            .skip(skipSpecification(pageSpecification(queryParameters.page), limitSpecification(queryParameters.limit)))
            .limit(limitSpecification(queryParameters.limit))
            .lean();

        if (!dbDocuments) {
            throw new CustomApiError(`Error reading objects in ${this.getClassName()}.`);
        }
        return dbDocuments;
    }

    /**
     *  .lean() function is used to optimize database queries by returning plain JavaScript objects instead of Mongoose
     *  documents. By default, Mongoose documents contain a lot of metadata and methods which can slow down queries,
     *  especially when dealing with large data sets.
     *
     * When a query is executed with .lean(), Mongoose bypasses its own schema validation and creates a plain JavaScript
     * object directly from the MongoDB server's response. This can result in a significant performance improvement for
     * read-only operations such as find(), findOne(), and aggregate().
     *
     * Keep in mind that when using .lean(), the returned object will not have any of the Mongoose document methods or
     * properties, such as .save(), .validate(), or .populate(). It will also not have the same validation and
     * middleware functionality as a Mongoose document.*/
    async get(id, queryParameters) {
        return await this.schema
            .findById({_id: id})
            .sort(sortSpecification(queryParameters?.sort))
            .collation({locale: 'en', strength: 2})
            .select(fieldsSelectionSpecification(queryParameters?.fields))
            .populate(populateSpecification(queryParameters?.populate))
            .lean();
    }

    async delete(id) {
        return await this.schema.findOneAndDelete({_id: id});
    }

    async deleteAll() {
        try {
            await this.schema.deleteMany({});
            return true;
        } catch (error) {
            throw new CustomApiError(`Error purging collection in ${this.getClassName()}.`);
        }
    }

    //do not use in controller, this is just for "commandlinerunner"
    async create(data) {
        return new this.schema(data).save();
    }

    async put(id, data) {
        return await this.schema.findByIdAndUpdate(id, data,
            {
                new: true,
                runValidators: true,
            }
        );
    }

    /**
     * The method then uses Mongoose's findByIdAndUpdate method to update the parent document by adding the child ID
     * to the specified child array. The {new: true} option ensures that the updated parent document is returned after
     * the update. Finally, the method returns the updated parent document.*/
    async findByIdAndUpdateArray(parentId, path, childId) {
        return await this.schema.findByIdAndUpdate(
            parentId,
            {$push: {[path]: childId}},
            {new: true}
        );
    }

    async removeChildFromParent(parentId, childId) {
        return await this.schema.updateOne(
            {_id: parentId},
            {$pull: {digitalContents: {_id: childId}}}
        );
    }

    async selectLastInsertedDocument() {
        return await this.schema.findOne({}, {}, {sort: {'createdAt': -1}}, (error, lastDocument) => {
            if (error) {
                console.error('Error retrieving the last inserted document:', error);
                throw new CustomApiError(`Error retrieving the last inserted document in ${this.getClassName()}.`);
            }
        });
    }

    /**
     * pouzivej pouze na mongoose schematech ne na plain JS objektech*/
    mapDatabaseDocumentsToJsons(dbDocuments) {
        if (dbDocuments)
            return dbDocuments.map(each => each.toJSON());
    }

    /*staci zadat key jako nazev klice a value jako hodnotu*/
    async isExisting(queryObject) {
        if (queryObject) {
            const result = await this.schema.findOne(queryObject);
            if (result) {
                return true;
            }
        }
        return false;
    }
}

module.exports = BaseDao;