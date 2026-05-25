pipeline {
  agent any

  environment {
    FAILED_STAGE = ''
    DISCORD_WEBHOOK = credentials('discord-webhook')
  }

  stages {

    stage('Git Metadata') {
      steps {
        script {

          env.GIT_AUTHOR = sh(
            script: "git log -1 --pretty=%an",
            returnStdout: true
          ).trim()

          env.GIT_COMMIT_MSG = sh(
            script: "git log -1 --pretty=%s",
            returnStdout: true
          ).trim()

          env.GIT_HASH = sh(
            script: "git rev-parse --short HEAD",
            returnStdout: true
          ).trim()

          env.GIT_BRANCH_NAME = sh(
            script: "git rev-parse --abbrev-ref HEAD",
            returnStdout: true
          ).trim()

          env.GIT_EMAIL = sh(
            script: "git log -1 --pretty=%ae",
            returnStdout: true
          ).trim()

          env.GIT_DATE = sh(
            script: "git log -1 --date=format:'%Y-%m-%d %H:%M:%S' --pretty=%cd",
            returnStdout: true
          ).trim()

          env.GIT_MESSAGE = sh(
            script: "git log -1 --pretty=%s",
            returnStdout: true
          ).trim()

          env.GIT_FILES = sh(
            script: "git diff-tree --no-commit-id --name-only -r HEAD",
            returnStdout: true
          ).trim()

          env.GIT_CHANGED_FILES = sh(
            script: "git diff-tree --no-commit-id --name-only -r HEAD",
            returnStdout: true
          ).trim()

          env.GIT_FILES = env.GIT_CHANGED_FILES
            .split("\\n")
            .collect { "• ${it}" }
            .join("\\n")
        }
      }
    }

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
        script {
          env.FAILED_STAGE = 'Backend'
        }
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
        script {
          env.FAILED_STAGE = 'Sonar Backend'
        }
        dir('dvlp-back/src/backend') {
          sh '''
            dotnet tool install --global dotnet-sonarscanner --version 6.0.1
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
        script {
          env.FAILED_STAGE = 'Frontend'
        }
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
        script {
          env.FAILED_STAGE = 'Sonar Frontend'
        }
        dir('dvlp-front/dvlp-web') {
          sh '''
            npm install -g sonar-scanner@5.0.1
    
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
        script {
          env.FAILED_STAGE = 'Build Backend'
        }
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
        script {
          env.FAILED_STAGE = 'Build Frontend'
        }
        dir('dvlp-front/dvlp-web') {
          sh "docker build -f Dockerfile -t guardian-frontend:${BUILD_NUMBER} -t guardian-frontend:latest ."
        }
      }
    }
  }

  post {
    success {
      mail to: 'guardianescolar0@gmail.com',
      subject: "SUCCESS: ${env.JOB_NAME}",
      body: """
          📌 Proyecto:
          ${env.JOB_NAME}

          🌿 Rama:
          ${env.GIT_BRANCH}

          👤 Autor:
          ${env.GIT_AUTHOR}

          📝 Commit:
          ${env.GIT_COMMIT_MSG}

          🕒 Fecha:
          ${new Date().format("yyyy-MM-dd HH:mm:ss")}

          📂 Archivos afectados:
          > ${env.GIT_CHANGED_FILES}

          🔢 Build:
          #${env.BUILD_NUMBER}

          🔗 Jenkins:
          ${env.BUILD_URL}
      """

      discordSend(
        title: "✅ Build Exitosa",
        description: """
          📦 **Proyecto:** ${env.JOB_NAME}

          🌿 **Rama:** ${env.GIT_BRANCH_NAME}

          🔖 **Commit:** `${env.GIT_HASH}`

          👤 **Autor:** ${env.GIT_AUTHOR}

          🕒 **Fecha:** ${env.GIT_DATE}

          💬 **Mensaje del commit:**
          ${env.GIT_MESSAGE}

          📂 **Archivos modificados:**
          > ${env.GIT_FILES}

          ⏱️ Duración: ${currentBuild.durationString}

          🔗 Build:
          ${env.BUILD_URL}
        """,
          result: 'SUCCESS',
          webhookURL: env.DISCORD_WEBHOOK
      )
    }
    
    failure {
      mail to: 'guardianescolar0@gmail.com',
      subject: "FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
      body: """
            📌 Proyecto:
            ${env.JOB_NAME}

            🌿 Rama:
            ${env.GIT_BRANCH}

            👤 Autor:
            ${env.GIT_AUTHOR}

            📝 Commit:
            ${env.GIT_COMMIT_MSG}

            🕒 Fecha:
            ${new Date().format("yyyy-MM-dd HH:mm:ss")}

            ❌ Stage fallido:
            ${env.FAILED_STAGE}

            📂 Archivos afectados:
            ${env.GIT_CHANGED_FILES}

            🔢 Build:
            #${env.BUILD_NUMBER}
      """

      discordSend(
        title: "❌ Build Fallida",
        description: """
        🚨 Stage fallido: ${env.FAILED_STAGE}

        📦 Proyecto: ${env.JOB_NAME}

        🌿 Rama: ${env.GIT_BRANCH_NAME}

        🔖 Commit: ${env.GIT_HASH}

        👤 Autor: ${env.GIT_AUTHOR}

        🕒 Fecha: ${env.GIT_DATE}

        💬 Mensaje del commit:
        ${env.GIT_MESSAGE}

        📂 Archivos modificados:

        > ${env.GIT_FILES}

        ⏱️ Duración: ${currentBuild.durationString}

        🔗 Build:
        ${env.BUILD_URL}
        """,
        result: 'FAILURE',
        webhookURL: env.DISCORD_WEBHOOK
      )
    }

    always {
      cleanWs()
    }
  }
}
