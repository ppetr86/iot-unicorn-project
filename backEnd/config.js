const getConfiguration = () => ({
    dbConnectionString: String(getDbConnectionStringValue()),
    port: Number(getPortValue()),
    applicationProfiles: String(applicationProfiles())
});

const getPortValue = () => {
    let portValue = getEnvVarValue("PORT");
    return portValue || 3001;
}

const getDbConnectionStringValue = () => getEnvVarValue("MONGO_URL")
    || throwConfigurationError("dbConnectionString");

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

const throwConfigurationError = (configKey) => {
    throw `${configKey} must be configured to make the app work, please see config.js and set it up`;
}

/**Application profiles to do some basic stuff on startup like
 * - database purge
 * - database writes
 * */
const applicationProfiles = () => getEnvVarValue("ACTIVE_PROFILES") || "";

module.exports = getConfiguration