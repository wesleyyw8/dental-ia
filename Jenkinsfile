pipeline {
    agent any

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