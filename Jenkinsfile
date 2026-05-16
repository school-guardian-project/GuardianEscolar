pipeline {
  agent any

  stages {

    stage('Detect Changes') {
      agent any
      steps {
        script {
          def changes = sh(
            script: 'git diff --name-only HEAD~1 HEAD 2>/dev/null || git log --pretty=format: --name-only -1',
            returnStdout: true
          ).trim()

          env.BUILD_BACK = changes.contains('dvlp-back') ? 'true' : 'false'
          env.BUILD_FRONT = changes.contains('dvlp-front') ? 'true' : 'false'

          echo "Cambios detectados:\n${changes}"
          echo "Backend: ${env.BUILD_BACK}, Frontend: ${env.BUILD_FRONT}"
        }
      }
    }

    stage('Backend') {
      when {
        expression { env.BUILD_BACK == 'true' }
      }
      agent {
        docker { 
          image 'mcr.microsoft.com/dotnet/sdk:10.0'
          args '--network school-guardian-project_sonar-net'
        }
      }
      steps {
        dir('dvlp-back/src/backend') {
          sh 'dotnet restore'
          sh 'dotnet build -c Release'
        }
      }
    }
    stage('Sonar Backend') {
      when {
        expression { env.BUILD_BACK == 'true' }
      }
      agent {
        docker { 
          image 'mcr.microsoft.com/dotnet/sdk:10.0'
          args '--network school-guardian-project_sonar-net'
        }
      }
      environment {
        SONAR_TOKEN = credentials('sonar-token')
      }
      steps {
        dir('dvlp-back/src/backend') {
          sh '''
            dotnet tool install --global dotnet-sonarscanner
            export PATH="$PATH:/root/.dotnet/tools"

            dotnet sonarscanner begin \\
              /k:"guardian-backend" \\
              /d:sonar.host.url=http://sonarqube:9000 \\
              /d:sonar.login=$SONAR_TOKEN

            dotnet build -c Release

            dotnet sonarscanner end \\
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
          archiveArtifacts artifacts: 'dvlp-front/dvlp-web/dist/**', fingerprint: true
        }
      }
    }
    stage('Sonar Frontend') {
      when {
        expression { env.BUILD_FRONT == 'true' }
      }
      agent {
        docker { 
          image 'node:20' 
          args '--network school-guardian-project_sonar-net'
        }
      }
      environment {
        SONAR_TOKEN = credentials('sonar-token')
      }
      steps {
        dir('dvlp-front/dvlp-web') {
          sh '''
            npm install -g sonar-scanner
    
            sonar-scanner \\
              -Dsonar.projectKey=guardian-frontend \\
              -Dsonar.sources=src \\
              -Dsonar.host.url=http://sonarqube:9000 \\
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
        dir('dvlp-back/src/backend') {
          sh "docker build -f Dockerfile -t guardian-backend:${BUILD_NUMBER} -t guardian-backend:latest ."
        }
      }
    }
    stage('Docker Build Frontend') {
      when {
        allOf {
          branch 'develop'
          expression { env.BUILD_FRONT == 'true' }
        }
      }
      agent any
      steps {
        dir('dvlp-front/dvlp-web') {
          sh "docker build -f Dockerfile -t guardian-frontend:${BUILD_NUMBER} -t guardian-frontend:latest ."
        }
      }
    }
  }

  post {
    always {
      cleanWs()
    }

    success {
      mail to: 'guardianescolar0@gmail.com',
      subject: 'Pipeline EXITOSO',
      body: 'La compilación y pruebas finalizaron correctamente.'

      discordSend description: "¡Build exitosa!",
                    result: 'SUCCESS',
                    title: 'Hecho',
                    webhookURL: 'https://discord.com/api/webhooks/1505227295101681674/MkgVrZZs_nS7GSmv4zIX2b6kpTFAWQ865NTgClQ5QdgrwBquk2I2oPAtzxLsCWiw23gU'
    }
    failure {
      mail to: 'guardianescolar0@gmail.com',
      subject: 'Pipeline FALLÓ',
      body: 'La compilación o pruebas presentaron errores.'

      discordSend description: "¡Build fallida!",
                    result: 'FAILURE',
                    title: 'Fallo',
                    webhookURL: 'https://discord.com/api/webhooks/1505227295101681674/MkgVrZZs_nS7GSmv4zIX2b6kpTFAWQ865NTgClQ5QdgrwBquk2I2oPAtzxLsCWiw23gU'
    }
  }
}
