Copy-Item `
  -Path (Join-Path $PSScriptRoot 'config.default.json') `
  -Destination (Join-Path $PSScriptRoot 'config.json')
