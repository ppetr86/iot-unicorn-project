const Terrarium = require('../entities/db/TerrariumSchema');

class OldDataEraser {
    constructor() {
    }

    eraseOldMeasuredDataFromDatabase(numberOfDays) {
        const currentDate = new Date();
        const olderThanDate = new Date(currentDate.setDate(currentDate.getDate() - numberOfDays));
        console.info("OldDataEraser.eraseOldMeasuredDataFromDatabase: started")

        Terrarium.updateMany(
            {'data.timestamp': {$lt: olderThanDate}},
            {$pull: {'$.data': {timestamp: {$lt: olderThanDate}}}}
        ).then(() => {
            console.log("OldDataEraser.eraseOldMeasuredDataFromDatabase: success");
        }).catch((error) => {
            console.error("OldDataEraser.eraseOldMeasuredDataFromDatabase: error", error);
        });
    }
}

module.exports = new OldDataEraser();