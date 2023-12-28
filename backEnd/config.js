const getConfiguration = () => ({
    dbConnectionString: String(getDbConnectionStringValue()),
    port: Number(getPortValue()),
    applicationProfiles: String(applicationProfiles()),
    dataEraser: Number(dataEraser()),
    corsUrl:String(getCorsAllowedUrlValue()),
    mailTrapUser:String(getMailTrapUser()),
    mailTrapPassword:String(getMailTrapPassword()),
});

const getPortValue = () => {
    let portValue = getEnvVarValue("PORT");
    return portValue || 3001;
}

const getMailTrapUser = () => getEnvVarValue("MAILTRAP_USER")
    || throwConfigurationError("MAILTRAP_USER");

const getMailTrapPassword = () => getEnvVarValue("MAILTRAP_PASSWORD")
    || throwConfigurationError("MAILTRAP_PASSWORD");

const getDbConnectionStringValue = () => getEnvVarValue("MONGO_URL")
    || throwConfigurationError("dbConnectionString");

const getCorsAllowedUrlValue = () => getEnvVarValue("CORS")
    || throwConfigurationError("corsUrl");

const getEnvVarValue = (envVarName) => {
    const envVarRawValue = process.env[envVarName];
    if (!envVarRawValue
        || !(typeof envVarRawValue == 'string')
        || !envVarRawValue.startsWith("${")
        || !envVarRawValue.endsWith("}"))
        return envVarRawValue;

    const targetEnvVarName = envVarRawValue.substring(2, envVarRawValue.length - 1);
    return (targetEnvVarName === envVarName) ? envVarRawValue : getEnvVarValue(targetEnvVarName);
}

const getEnvVarValueAsNumber = (envVarName) => {
    const envVarRawValue = process.env[envVarName];

    if (!envVarRawValue || !(typeof envVarRawValue === 'number')) {
        return envVarRawValue;
    }

    if (envVarRawValue.startsWith('{') && envVarRawValue.endsWith('}')) {
        const targetEnvVarName = envVarRawValue.substring(1, envVarRawValue.length - 1);
        return getEnvVarValueAsNumber(targetEnvVarName);
    }

    return parseFloat(envVarRawValue);
};


const throwConfigurationError = (configKey) => {
    throw `${configKey} must be configured to make the app work, please see config.js and set it up`;
}

/**Application profiles to do some basic stuff on startup like
 * - database purge
 * - database writes
 * */
const applicationProfiles = () => getEnvVarValue("ACTIVE_PROFILES") || "";
const dataEraser = () => getEnvVarValueAsNumber("DATA_ERASER") || 7;

module.exports = getConfiguration