pipeline {
    agent any
    environment {
      REDIS_HOST = 'redis'
      REDIS_PORT = '6379'
      DB_HOST = 'postgres'
      DB_PORT = '5432'
      DB_NAME = 'dental_ai'
      DB_USER = 'dental_user'
      DB_PASSWORD = 'dental_password'
    }
    stages {
        stage('unit testes') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'google-api-key',
                        variable: 'GOOGLE_API_KEY'
                    )
                ]) {
                    sh 'uv run pytest'
                }
            }
        }
    }
}