# DevOps Automation Implementation

This document summarizes the DevOps automation implementation for the OctoCAT Supply Chain Management application.

## Implementation Summary

The following DevOps automation components have been successfully implemented:

### 1. Infrastructure as Code (Bicep Templates)

**Location**: `infra/`

- **`main.bicep`**: Main orchestration template that coordinates deployment of all resources
- **`modules/webapps.bicep`**: Azure Web Apps module for hosting API and Frontend containers
- **`modules/logAnalytics.bicep`**: Log Analytics workspace for monitoring and logging
- **`parameters/staging.parameters.json`**: Configuration parameters for staging environment
- **`parameters/production.parameters.json`**: Configuration parameters for production environment

**Key Features**:
- Azure Web Apps (B1 SKU) for both API and Frontend
- Managed Identity integration for secure ACR access
- CORS configuration for cross-origin requests
- Environment-specific configurations
- Unique resource naming using `uniqueString()`

### 2. Continuous Integration Workflow

**File**: `.github/workflows/build-test.yml`

**Triggers**: Push to any branch, Pull requests to main

**Capabilities**:
- Builds both API and Frontend applications
- Runs unit tests for API components
- Performs linting on Frontend code
- Builds Docker images for validation (without pushing)
- Uses Node.js 20 and npm for dependency management

### 3. Continuous Deployment Workflow

**File**: `.github/workflows/deploy.yml`

**Triggers**: Pull requests to main branch

**Pipeline Structure**:
1. **Parallel Build Jobs**:
   - `build-api`: Builds and pushes API Docker image to Azure Container Registry
   - `build-frontend`: Builds and pushes Frontend Docker image to Azure Container Registry

2. **Staging Deployment**:
   - Deploys to staging environment automatically
   - Uses staging parameters and resource group
   - Outputs deployment URLs for tracking

3. **Production Deployment**:
   - Requires manual approval (configured via GitHub environments)
   - Deploys to production resource group
   - Uses production parameters

**Authentication**: 
- Uses OIDC (OpenID Connect) for secure authentication with Azure
- Leverages GitHub repository variables for configuration

## Prerequisites for Deployment

Before using these workflows, ensure the following setup is completed:

1. **Azure Resources**: Run the `infra/configure-deployment.sh` script to create:
   - Azure resource groups (staging and production)
   - Azure Container Registry
   - Service Principal with OIDC configuration
   - GitHub repository variables and environments

2. **GitHub Configuration**: The script will set up:
   - Repository variables (`AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, etc.)
   - GitHub environments (`Staging`, `Production`)
   - Environment protection rules for production approval

## Usage

### For Development (CI)
- Push code to any branch to trigger build and test workflow
- Workflow validates code quality and builds Docker images

### For Deployment (CD)
- Create a pull request to `main` branch
- Deployment workflow automatically:
  1. Builds and pushes container images
  2. Deploys to staging environment
  3. Waits for manual approval for production
  4. Deploys to production environment

### Manual Testing
```bash
# Build the application
npm run build

# Run tests
npm run test:api
npm run lint

# Validate infrastructure templates
az bicep build --file infra/main.bicep
```

## Architecture

The solution implements a modern DevOps pipeline with:
- **Infrastructure as Code**: All Azure resources defined in Bicep templates
- **Containerization**: Both API and Frontend packaged as Docker containers
- **Environment Promotion**: Automatic staging deployment with manual production approval
- **Security**: OIDC authentication and managed identities
- **Monitoring**: Log Analytics integration for observability

## Deployment URLs

After successful deployment:
- **Staging**: URLs available in GitHub Actions environment view
- **Production**: URLs available in GitHub Actions environment view

The infrastructure outputs both API and Frontend URLs that are automatically configured in the GitHub environment settings for easy access.