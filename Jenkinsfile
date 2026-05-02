pipeline {
  agent none

  stages {

    stage('Detect Changes') {
      agent any
      steps {
        script {
          def changes = sh(script: "git diff --name-only HEAD~1", returnStdout: true).trim()

          env.BUILD_BACK = changes.contains("dvlp-back")
          env.BUILD_FRONT = changes.contains("dvlp-front")

          echo "Cambios detectados:"
          echo changes
        }
      }
    }

    stage('Backend') {
      when {
        expression { env.BUILD_BACK == 'true' }
      }
      agent {
        docker { image 'mcr.microsoft.com/dotnet/sdk:10.0' }
      }
      steps {
        dir('dvlp-back') {
          sh 'dotnet restore'
          sh 'dotnet build -c Release'
        }
      }
    }
    stage ('Build Backend') {
      when {
        expression { env.BUILD_BACK == "true" }
      }
      steps {
        dir('dvlp-back') {
          sh '''
            docker run --rm \
              -v $(pwd):/app \
              -w /app \
              mcr.microsoft.com/dotnet/sdk:10.0 \
              bash -c "dotnet restore && dotnet build -c Release"
          '''
        }
      }
    }
    stage('Sonar Backend') {
      when {
        expression { env.BUILD_BACK == 'true' }
      }
      agent {
        docker { image 'mcr.microsoft.com/dotnet/sdk:10.0' }
      }
      environment {
        SONAR_TOKEN = credentials('sonar-token')
      }
      steps {
        dir('dvlp-back') {
          sh '''
            dotnet tool install --global dotnet-sonarscanner
            export PATH="$PATH:/root/.dotnet/tools"
    
            dotnet sonarscanner begin \
              /k:"guardian-backend" \
              /d:sonar.host.url=http://host.docker.internal:9000 \
              /d:sonar.login=$SONAR_TOKEN
    
            dotnet build -c Release
    
            dotnet sonarscanner end \
              /d:sonar.login=$SONAR_TOKEN
          '''
        }
      }
    }

    stage('Frontend') {
      when {
        expression { env.BUILD_FRONT == 'true' }
      }
      agent {
        docker { image 'node:20' }
      }
      steps {
        dir('dvlp-front/dvlp-web') {
          sh 'npm ci'
          sh 'npm run build'
        }
      }
      post {
        success {
          archiveArtifacts artifacts: '**/dist/**', fingerprint: true
        }
      }
    }
    stage('Build Frontend') {
      when {
        expression { env.BUILD_FRONT == "true" }
      }
      steps {
        dir('dvlp-front/dvlp-web') {
          sh '''
            docker run --rm \
              -v $(pwd):/app \
              -w /app \
              node:20 \
              bash -c "npm ci && npm run build"
          '''
        }
      }
      post {
        success {
          archiveArtifacts artifacts: '**/dist/**', fingerprint: true
        }
      }
    }
    stage('Sonar Frontend') {
      when {
        expression { env.BUILD_FRONT == 'true' }
      }
      agent {
        docker { image 'node:20' }
      }
      environment {
        SONAR_TOKEN = credentials('sonar-token')
      }
      steps {
        dir('dvlp-front/dvlp-web') {
          sh '''
            npm install -g sonar-scanner
    
            sonar-scanner \
              -Dsonar.projectKey=guardian-frontend \
              -Dsonar.sources=. \
              -Dsonar.host.url=http://host.docker.internal:9000 \
              -Dsonar.login=$SONAR_TOKEN
          '''
        }
      }
    }
    
    stage('Docker Build Backend') {
      when {
        allOf {
          branch 'develop'
          expression { env.BUILD_BACK == 'true' }
        }
      }
      agent any
      steps {
        dir('dvlp-back') {
          sh 'docker build -f dev.Dockerfile -t guardian-backend .'
        }
      }
    }
    stage('Docker Build Frontend') {
      when {
        allOf {
          branch 'develop'
          expression { env.BUILD_FRONT == "true" }
        }
      }
      steps {
        dir('dvlp-front/dvlp-web') {
          sh 'docker build -t guardian-frontend:latest .'
        }
      }
    }
  }
}
