@description('Environment name (e.g., staging, production)')
param environmentName string

@description('Application name')
param appName string

@description('Azure Container Registry name')
param acrName string

@description('Docker image tag')
param imageTag string

@description('Resource location')
param location string = resourceGroup().location

// Deploy Log Analytics
module logAnalytics 'modules/logAnalytics.bicep' = {
  name: 'logAnalytics-${environmentName}'
  params: {
    environmentName: environmentName
    location: location
  }
}

// Deploy Web Apps
module webApps 'modules/webapps.bicep' = {
  name: 'webApps-${environmentName}'
  params: {
    environmentName: environmentName
    appName: appName
    location: location
    acrName: acrName
    imageTag: imageTag
  }
}

// Outputs
output apiUrl string = webApps.outputs.apiUrl
output frontendUrl string = webApps.outputs.frontendUrl
output apiAppName string = webApps.outputs.apiAppName
output frontendAppName string = webApps.outputs.frontendAppName
output logAnalyticsWorkspaceName string = logAnalytics.outputs.logAnalyticsWorkspaceName