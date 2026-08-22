param name string
param location string
param tags object
param repositoryUrl string
param branch string = 'main'

resource web 'Microsoft.Web/staticSites@2023-12-01' = {
  name: name
  location: location
  tags: union(tags, {
    'azd-service-name': 'web'
  })
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    allowConfigFileUpdates: true
    branch: branch
    provider: 'GitHub'
    repositoryUrl: repositoryUrl
  }
}

resource logs 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: 'log-${name}'
  location: location
  tags: tags
  properties: {
    features: {
      disableLocalAuth: false
      enableLogAccessUsingOnlyResourcePermissions: true
    }
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
    retentionInDays: 30
    sku: {
      name: 'PerGB2018'
    }
    workspaceCapping: {
      dailyQuotaGb: json('0.1')
    }
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: 'appi-${name}'
  location: location
  tags: tags
  kind: 'web'
  properties: {
    Application_Type: 'web'
    DisableIpMasking: false
    IngestionMode: 'LogAnalytics'
    RetentionInDays: 30
    SamplingPercentage: 100
    WorkspaceResourceId: logs.id
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

module analyticsWorkbook 'workbook.bicep' = {
  name: 'legendary-women-analytics-workbook'
  params: {
    name: guid(resourceGroup().id, name, 'analytics-workbook')
    location: location
    tags: tags
    sourceId: appInsights.id
  }
}

output name string = web.name
output endpoint string = 'https://${web.properties.defaultHostname}'
output appInsightsConnectionString string = appInsights.properties.ConnectionString
output analyticsWorkbookId string = analyticsWorkbook.outputs.id
