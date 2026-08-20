param name string
param location string
param tags object

resource web 'Microsoft.Web/staticSites@2023-12-01' = {
  name: name
  location: location
  tags: tags
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    allowConfigFileUpdates: true
  }
}

output name string = web.name
output endpoint string = 'https://${web.properties.defaultHostname}'
