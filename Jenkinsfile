pipeline {
    agent any
    environment {
      REDIS_HOST = 'redis'
      REDIS_PORT = '6379'
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