$config = Get-Content (Join-Path $PSScriptRoot 'config.json') | ConvertFrom-Json
$port = $config.port
$rootUsername = $config.root.username
$rootPassword = $config.root.password

try {
    $env:IOT_GATEWAY_DB_PORT = $port
    $env:IOT_GATEWAY_DB_ROOT_USERNAME = $rootUsername
    $env:IOT_GATEWAY_DB_ROOT_PASSWORD = $rootPassword

    & docker compose up --detach
}
finally {

}
