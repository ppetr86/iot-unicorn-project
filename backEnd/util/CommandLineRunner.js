"use strict";
const {faker} = require('@faker-js/faker');
const animalKindAbl = require("../abl/AnimalKindAbl");
const userAbl = require("../abl/UserAbl");
const {SensorData, SensorTarget, Sensor, Terrarium} = require('../entities/schemaToClass/MongooseSchemaToClass.js');
const { v4: uuidV4 } = require('uuid');

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
            for (let i = 0; i < 3; i++) {
                try {
                    this.writeData(animalKindAbl, this.createFakeAnimalKind());
                    console.log("Writing animalKind");
                } catch (e) {
                    console.error("Failed writing animalKind from commandLineRunner")
                }
            }
            console.log("loadAnimalKinds done")

        }

        //create user
        if (appConfig.applicationProfiles.indexOf("createUsers") !== -1) {
            for (let i = 0; i < 3; i++) {
                let email = "test" + i + "@test.com";
                if (!(await this.isDataExisting(userAbl, {"email": email}))) {
                    //ROLE_ADMIN one time, rest ROLE_USER
                    const user = this.createFakeUser(i === 0 ? "ROLE_ADMIN" : "ROLE_USER", email);
                    try {
                        this.writeData(userAbl, user);
                        console.log("Writing user with email: " + email);
                    } catch (e) {
                        console.error("Failed writing user from commandLineRunner")
                    }
                }
            }
            console.log("createUsers done");
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
        user.terrariums = this.createFakeTerrariums();
        return user;
    }

    createFakeTerrariums() {
        const terrariumsArray = [];
        for (let i = 0; i < 2; i++) {

            const sensors = [];
            for (let j = 0; j < 2; j++) {
                const newSensorTarget = new SensorTarget(25, 30, 60, 70, 80, 90);
                const data = [];
                for (let k = 0; k < 2; k++) {
                    data.push(new SensorData(25.5, 60, 80));
                }
                const newSensor = new Sensor(
                    uuidV4(),
                    "sensor name " + j,
                    newSensorTarget,
                    data);
                sensors.push(newSensor);
            }

            terrariumsArray.push(new Terrarium(
                "terrarium.name" + i,
                "animalType" + i,
                "description" + i,
                sensors));
        }
        return terrariumsArray;
    }

    createFakeAnimalKind() {
        return {
            animalType: "animalType" + faker.number.int({min: 0, max: 10000}),
            description: faker.lorem.sentences().substring(0, 254),
            livingConditions:  new SensorTarget(25, 30, 60, 70, 80, 90)
        }
    }


}

module.exports = new CommandLineRunner();