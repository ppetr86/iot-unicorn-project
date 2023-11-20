const User = require('../entities/db/UserSchema');

class OldDataEraser {
    constructor() {
    }

    eraseOldMeasuredDataFromDatabase(numberOfDays) {
        const currentDate = new Date();
        const olderThanDate = new Date(currentDate.setDate(currentDate.getDate() - numberOfDays));
        console.info("OldDataEraser.eraseOldMeasuredDataFromDatabase: started")

        User.updateMany(
            {'terrariums.data.timestamp': {$lt: olderThanDate}},
            {$pull: {'terrariums.$.data': {timestamp: {$lt: olderThanDate}}}}
        ).then(() => {
            console.log("OldDataEraser.eraseOldMeasuredDataFromDatabase: success");
        }).catch((error) => {
            console.error("OldDataEraser.eraseOldMeasuredDataFromDatabase: error", error);
        });
    }
}

module.exports = new OldDataEraser();