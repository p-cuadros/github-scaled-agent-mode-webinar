param environmentName string
param appName string
param location string = resourceGroup().location
param acrName string
param imageTag string
param apiImageName string = 'api'
param frontendImageName string = 'frontend'

var uniqueSuffix = uniqueString(resourceGroup().id)
var apiAppName = '${appName}-api-${environmentName}-${uniqueSuffix}'
var frontendAppName = '${appName}-frontend-${environmentName}-${uniqueSuffix}'

// App Service Plan
resource appServicePlan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: 'asp-${environmentName}-${uniqueSuffix}'
  location: location
  sku: {
    name: 'B1'
    tier: 'Basic'
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

// API Web App
resource apiWebApp 'Microsoft.Web/sites@2023-12-01' = {
  name: apiAppName
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'DOCKER|${acrName}.azurecr.io/${apiImageName}:${imageTag}'
      acrUseManagedIdentityCreds: true
      appSettings: [
        {
          name: 'WEBSITES_ENABLE_APP_SERVICE_STORAGE'
          value: 'false'
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_URL'
          value: 'https://${acrName}.azurecr.io'
        }
        {
          name: 'API_CORS_ORIGINS'
          value: 'https://${frontendAppName}.azurewebsites.net'
        }
      ]
      httpLoggingEnabled: true
      logsDirectorySizeLimit: 35
      detailedErrorLoggingEnabled: true
      cors: {
        allowedOrigins: [
          'https://${frontendAppName}.azurewebsites.net'
        ]
        supportCredentials: false
      }
    }
    httpsOnly: true
  }
}

// Frontend Web App
resource frontendWebApp 'Microsoft.Web/sites@2023-12-01' = {
  name: frontendAppName
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'DOCKER|${acrName}.azurecr.io/${frontendImageName}:${imageTag}'
      acrUseManagedIdentityCreds: true
      appSettings: [
        {
          name: 'WEBSITES_ENABLE_APP_SERVICE_STORAGE'
          value: 'false'
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_URL'
          value: 'https://${acrName}.azurecr.io'
        }
        {
          name: 'API_HOST'
          value: '${apiAppName}.azurewebsites.net'
        }
        {
          name: 'API_PORT'
          value: '80'
        }
      ]
      httpLoggingEnabled: true
      logsDirectorySizeLimit: 35
      detailedErrorLoggingEnabled: true
    }
    httpsOnly: true
  }
}

output apiUrl string = 'https://${apiWebApp.properties.defaultHostName}'
output frontendUrl string = 'https://${frontendWebApp.properties.defaultHostName}'
output apiAppName string = apiWebApp.name
output frontendAppName string = frontendWebApp.name
output apiPrincipalId string = apiWebApp.identity.principalId
output frontendPrincipalId string = frontendWebApp.identity.principalId