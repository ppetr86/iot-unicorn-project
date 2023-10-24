"use strict";
const {faker} = require('@faker-js/faker');
const animalKindAbl = require("../abl/AnimalKindAbl");
const userAbl = require("../abl/UserAbl");

class CommandLineRunner {
    constructor() {
    }

    async runOnStartUp(appConfig) {

        //purge all data
        if (appConfig.applicationProfiles.indexOf("purgeAll") !== -1) {
            await this.deleteAll(animalKindAbl);
            await this.deleteAll(userAbl);
        }

        if (appConfig.applicationProfiles.indexOf("purgeAnimalKinds") !== -1) {
            await this.deleteAll(animalKindAbl);
        }

        if (appConfig.applicationProfiles.indexOf("purgeUsers") !== -1) {
            await this.deleteAll(userAbl);
        }

        //createAnimals
        if (appConfig.applicationProfiles.indexOf("loadAnimalKinds") !== -1) {
            for (let i = 0; i < 5; i++) {
                try {
                    this.writeData(animalKindAbl, this.createFakeAnimalKind());
                } catch (e) {
                    //not important, just for test
                }
            }
        }

        //create user
        if (appConfig.applicationProfiles.indexOf("createUsers") !== -1) {
            for (let i = 0; i < 3; i++) {
                let email = "test" + i + "@test.com";
                if (!(await this.isDataExisting(userAbl, {"email": email}))) {
                    //ROLE_ADMIN one time, rest ROLE_USER
                    const user = this.createFakeUser(i === 0 ? "ROLE_ADMIN" : "ROLE_USER", email);
                    console.log("Writing user with email: " + email);
                    this.writeData(userAbl, user);
                }
            }
        }
    }


    async isDataExisting(abl, queryObject) {
        return await abl.isExisting(queryObject);
    }


    writeData(abl, data) {
        return abl.create(data);
    }

    async deleteAll(abl) {
        return abl.deleteAll();
    }

    async createUsers(abl) {
        for (let i = 0; i < 5; i++) {
            let email = "test" + i + "@test.com";
            if (!(await this.isDataExisting(abl, {"email": email}))) {
                const user = this.createFakeUser(i % 2 === 0 ? "ROLE_ADMIN" : "ROLE_TEACHER", email);
                console.log("Writing user with email: " + email);
                await this.writeData(abl, user);
            }
        }
    }

    createFakeUser(role, email) {
        const user = {};
        user.firstName = faker.person.firstName()
        user.lastName = faker.person.lastName();
        user.email = email;
        user.roles = [role];
        user.password = 1234;
        user.terrariums = [];
        return user;
    }

    createFakeAnimalKind() {
        const minHumidity = faker.number.int({min: 0, max: 90});
        const minTemp = faker.number.int({min: -100, max: 90});
        const minLight = faker.number.int({min: 0, max: 90});
        return {
            animalType: "animalType" + faker.number.int({min: 0, max: 10000}),
            description: faker.lorem.sentences().substring(0, 254),
            livingConditions:
                {
                    humidity: {
                        min: minHumidity,
                        max: minHumidity + 10,
                    },
                    temperature: {
                        min: minTemp,
                        max: minTemp + 10,
                    },
                    lightIntensity: {
                        min: minLight,
                        max: minLight + 10,
                    },
                }
        }
    }


}

module.exports = new CommandLineRunner();