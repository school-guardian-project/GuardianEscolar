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
        docker { image 'mcr.microsoft.com/dotnet/sdk:8.0' }
      }
      steps {
        dir('dvlp-back') {
          sh 'dotnet restore'
          sh 'dotnet build -c Release'
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
    }
  }
}
post {
  success {
    archiveArtifacts artifacts: '**/dist/**', fingerprint: true
  }
}
