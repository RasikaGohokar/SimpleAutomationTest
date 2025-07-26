pipeline {
  agent any

  environment {
    BASE_URL = 'http://localhost:3000'
    API_URL = 'http://localhost:8000'
    PLAYWRIGHT_REPORT = 'playwright-report'
    POSTMAN_COLLECTION = 'tests/TodoCollection.postman_collection.json'
    POSTMAN_ENV = 'tests/TodoEnvironment.postman_environment.json'
    SIGNUP_DATA = 'tests/data/signup_test_data.csv'
  }

  options {
    timeout(time: 15, unit: 'MINUTES')
    timestamps()
  }

  parameters {
    string(name: 'BRANCH', defaultValue: 'main', description: 'Git branch to build and test')
    booleanParam(name: 'RUN_UI', defaultValue: true, description: 'Run Playwright UI Tests')
    booleanParam(name: 'RUN_API', defaultValue: true, description: 'Run Postman API Tests')
  }

  stages {
    stage('Install Dependencies') {
      steps {
        sh 'npm ci'
        sh 'npx playwright install --with-deps'
        sh 'npm install -g newman'
      }
    }

    stage('Run Tests') {
      parallel {
        stage('Playwright Tests') {
          when { expression { return params.RUN_UI } }
          steps {
            sh 'npx playwright test'
          }
        }

        stage('Postman API Tests') {
          when { expression { return params.RUN_API } }
          steps {
            sh '''
              newman run $POSTMAN_COLLECTION \
                -e $POSTMAN_ENV \
                -d $SIGNUP_DATA \
                --reporters cli,html \
                --reporter-html-export postman-report.html
            '''
          }
        }
      }
    }

    stage('Publish Reports') {
      steps {
        script {
          if (fileExists("${PLAYWRIGHT_REPORT}/index.html")) {
            echo "Archiving Playwright Report"
            archiveArtifacts artifacts: "${PLAYWRIGHT_REPORT}/**", allowEmptyArchive: true
          }
          if (fileExists('postman-report.html')) {
            echo "Archiving Postman Report"
            archiveArtifacts artifacts: 'postman-report.html', allowEmptyArchive: true
          }
        }
      }
    }
  }

  post {
    success {
      echo "✅ Pipeline completed successfully."
    }
    failure {
      echo "❌ Pipeline failed."
    }
    always {
      echo "📦 Cleaning workspace..."
      cleanWs()
    }
  }
}
