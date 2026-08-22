targetScope = 'subscription'
@minLength(1)
@maxLength(64)
param environmentName string
param location string = 'eastus2'
param tags object = {}
var token = toLower(uniqueString(subscription().id, environmentName, location))
resource rg 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: 'rg-${environmentName}'
  location: location
  tags: union(tags, { 'azd-env-name': environmentName })
}

module resources 'resources.bicep' = {
  name: 'legendary-women-resources'
  scope: rg
  params: {
    name: 'stapp-${environmentName}-${token}'
    location: location
    repositoryUrl: 'https://github.com/rickliev/legendary-women'
    branch: 'main'
    tags: union(tags, {
      'azd-env-name': environmentName
    })
  }
}

output AZURE_LOCATION string = location
output AZURE_RESOURCE_GROUP string = rg.name
output SERVICE_WEB_RESOURCE_NAME string = resources.outputs.name
output SERVICE_WEB_ENDPOINT string = resources.outputs.endpoint
output PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING string = resources.outputs.appInsightsConnectionString
output ANALYTICS_WORKBOOK_ID string = resources.outputs.analyticsWorkbookId
