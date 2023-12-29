const Terrarium = require('../entities/db/TerrariumSchema');

class OldDataEraser {
    constructor() {
    }

    eraseOldMeasuredDataFromDatabaseBasedOnTime(numberOfDays) {
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

    /*
    * Average size of each array element: The average size of each array element is approximately 32 bytes.
    * This includes the size of the timestamp (8 bytes), the value (8 bytes), and the type (4 bytes).
        15 MB / (32 bytes/element + 100 bytes/document) = 16,700 elements
     Lets make a limit of 15 000 elements in the data array
    * */
    eraseOldMeasuredDataFromDatabaseBasedOnDataArraySize() {
        console.info("OldDataEraser.eraseOldMeasuredDataFromDatabaseBasedOnDataArraySize: started")


        for (let pageNumber = 1; pageNumber <= 10; pageNumber++) {
            Terrarium.find({}, {limit: 10, skip: (pageNumber - 1) * 10}, (err, terrariums) => {
                if (err) {
                    console.error(err);
                    return;
                }

                for (const terrarium of terrariums) {
                    if (terrarium.data.length > 15000) {
                        Terrarium.updateOne({_id: terrarium._id}, {
                            $set: {
                                data: {$slice: [1000]},
                            },
                        });
                    }
                }

                if (terrariums.length === 0) {
                    break; // No more documents to process
                }
            });
        }


        const threshold = 15000;

        Terrarium.updateMany(
            { $expr: { $gte: [{ $size: '$data' }, threshold] } },
            {
                $set: {
                    data: { $slice: ['$data', 1000] },
                },
            }
        ).then(() => {
            console.log("OldDataEraser.eraseOldMeasuredDataFromDatabaseBasedOnDataArraySize: success");
        }).catch((error) => {
            console.error("OldDataEraser.eraseOldMeasuredDataFromDatabaseBasedOnDataArraySize: error", error);
        });
    }


}

module.exports = new OldDataEraser();