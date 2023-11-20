const dotenv = require('dotenv');
dotenv.config();

const express = require('express');

const authRoute = require('./routes/authRoute');
const usersRoute = require('./routes/userRoute');
const animalKindRoute = require('./routes/animalKindRoute');
const terrariumDataRoute = require('./routes/TerrariumDataRoute');
const frontEndRoute = require('./routes/FrontEndRoute');

const cors = require('cors');
const getConfiguration = require('./config');
const connectDB = require('./db/connect');
const errorHandlerMiddleware = require('./middleware/ErrorHandlerMiddleware');
const notFoundMiddleware = require("./middleware/Not-found");
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const appConfig = getConfiguration();

const app = express();
const commandLineRunner = require("./util/CommandLineRunner.js");
const oldDataEraser = require("./util/OldDataEraser.js");
const cron = require('node-cron');

// enable CORS for any resource
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
}));

//Security http headers
app.use(helmet());

// middlewares
app.use(express.json());

//sanitize data against query injection in req body
// eg {email: {"$gt":""}, password: "pass"}
app.use(mongoSanitize());

//request log
/*app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log(req.headers);
    next();
})*/

app.use(express.static('./public'));

//api rest like controllers and routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/animalKinds", animalKindRoute);
app.use("/api/v1/terrariumData", terrariumDataRoute);
app.use("/fe/v1/users", frontEndRoute);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

cron.schedule('* * * * *', () => {
    //TODO: cron job runs every minute just for testing purpose...
    oldDataEraser.eraseOldMeasuredDataFromDatabase(7);
});
const start = async () => {
    try {
        await connectDB(appConfig.dbConnectionString);
        app.listen(appConfig.port, () => console.log(`Server is listening port ${appConfig.port}...`));

        await commandLineRunner.runOnStartUp(appConfig);
    } catch (error) {
        console.log(error);
    }
};

void start();