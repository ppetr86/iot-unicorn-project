$config = Get-Content (Join-Path $PSScriptRoot 'config.json') | ConvertFrom-Json
$port = $config.port
$rootUsername = $config.root.username
$rootPassword = $config.root.password

"mongodb://$($rootUsername):$rootPassword@localhost:$port"
