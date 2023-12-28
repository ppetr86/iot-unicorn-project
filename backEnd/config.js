const getConfiguration = () => ({
    dbConnectionString: String(getDbConnectionStringValue()),
    port: Number(getPortValue()),
    applicationProfiles: applicationProfiles(),
    dataEraser: Number(dataEraser()),
    corsUrl: String(getCorsAllowedUrlValue()),
    mailTrapUser: String(getMailTrapUser()),
    mailTrapPassword: String(getMailTrapPassword()),
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
const applicationProfiles = () => {
    const result = {};
    result.createUsers = getEnvVarValue("CREATE_USERS") || "0";
    result.createUsersRoleUser = getEnvVarValue("CREATE_USERS_ROLE_USER") || "0";
    result.loadAnimalKinds = getEnvVarValue("LOAD_ANIMAL_KINDS") || "0";
    result.purgeAll = getEnvVarValue("PURGE_ALL") || "0";
    result.purgeAnimalKinds = getEnvVarValue("PURGE_ANIMAL_KINDS") || "0";
    result.purgeUsers = getEnvVarValue("PURGE_USERS") || "0";
    return result;
}
const dataEraser = () => getEnvVarValueAsNumber("DATA_ERASER") || 7;

module.exports = getConfiguration