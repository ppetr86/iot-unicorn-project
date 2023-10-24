class UserDtoOut {
    constructor(dbDocument) {
        this.id = dbDocument?._id;
        this.firstName = dbDocument?.firstName;
        this.lastName = dbDocument?.lastName;
        this.email = dbDocument?.email;
        this.roles = dbDocument?.roles;
        this.isDeactivated = dbDocument?.isDeactivated;
        this.createdAt = dbDocument?.createdAt;
        this.terrariums = dbDocument?.terrariums;
        //TODO: Define what and how to return about terrariums, sensors, data
    }
}

class UserDtoOutWithIdNameEmail {
    constructor(dbDocument) {
        this.id = dbDocument?._id;
        this.firstName = dbDocument?.firstName;
        this.lastName = dbDocument?.lastName;
        this.email = dbDocument?.email;
    }
}

class UserWithNameAndLastNameDtoOut {
    constructor(dbDocument) {
        this.id = dbDocument?._id;
        this.firstName = dbDocument.firstName;
        this.lastName = dbDocument.lastName;
    }
}

module.exports = {UserDtoOut, UserDtoOutWithIdNameEmail, UserWithNameAndLastNameDtoOut};