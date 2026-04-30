pipeline {
  agent none

  stages {

    stage('Checkout') {
      agent any
      steps {
        git 'https://github.com/Smithzz24/GuardianEscolar.git'
      }
    }

    stage('Backend') {
      agent {
        docker { image 'mcr.microsoft.com/dotnet/sdk:10.0' }
      }
      steps {
        dir('dvlp-back') {
          sh 'dotnet restore'
          sh 'dotnet build -c Release'
          sh 'dotnet test || true'
        }
      }
    }

    stage('Frontend') {
      agent {
        docker { image 'node:20' }
      }
      steps {
        dir('dvlp-front/dvlp-web') {
          sh 'npm ci'
          sh 'npm run build'
        }
      }
    }
  }
}
