pipeline {
    agent {
      node { 
        label 'sme-nodes16'
      }
    }
    
    options {
      buildDiscarder(logRotator(numToKeepStr: '50', artifactNumToKeepStr: '50'))
      disableConcurrentBuilds()
      skipDefaultCheckout()  
    }
    
        
    stages {
      stage('CheckOut') {
        steps {
          checkout scm  
        }
       }
       
      stage('Build projeto') {
            steps {
            sh "echo executando build de projeto"
            //sh 'dotnet build'
            }
        }
        
    

      stage('Docker build DEV') {
        when {
          branch 'development'
        }
          steps {
            sh 'echo Build Docker image'
                
        // Start JOB Rundeck para build das imagens Docker e push SME Registry
      
          script {
           step([$class: "RundeckNotifier",
              includeRundeckLogs: true,
                               
              //JOB DE BUILD
              jobId: "2ccfea8d-a628-47d9-a9e0-882a0360d7ee",
              nodeFilters: "",
              //options: """
              //     PARAM_1=value1
               //    PARAM_2=value2
              //     PARAM_3=
              //     """,
              rundeckInstance: "Rundeck-SME",
              shouldFailTheBuild: true,
              shouldWaitForRundeckJob: true,
              tags: "",
              tailLog: true])
           }
          }
      }

      stage('Deploy DEV') {
        when {
          branch 'development'
        }
          steps {
            sh 'echo Deploying desenvolvimento'            
       //Start JOB Rundeck para update de deploy Kubernetes DEV
         
         script {
            step([$class: "RundeckNotifier",
              includeRundeckLogs: true,
              jobId: "9e3beab7-3664-4e4e-a194-f44d6d5a83fa",
              nodeFilters: "",
              //options: """
              //     PARAM_1=value1
               //    PARAM_2=value2
              //     PARAM_3=
              //     """,
              rundeckInstance: "Rundeck-SME",
              shouldFailTheBuild: true,
              shouldWaitForRundeckJob: true,
              tags: "",
              tailLog: true])
           }
      
       
            }
        }
        
      stage('Docker build HOM') {
            when {
              branch 'release'
            }
            steps {
              sh 'echo Deploying homologacao'
                
        // Start JOB Rundeck para build das imagens Docker e push registry SME
      
          script {
           step([$class: "RundeckNotifier",
              includeRundeckLogs: true,
                
               
              //JOB DE BUILD
              jobId: "8ba69c19-5e08-4dc6-ac95-a3bd046edf66",
              nodeFilters: "",
              //options: """
              //     PARAM_1=value1
               //    PARAM_2=value2
              //     PARAM_3=
              //     """,
              rundeckInstance: "Rundeck-SME",
              shouldFailTheBuild: true,
              shouldWaitForRundeckJob: true,
              tags: "",
              tailLog: true])
           }
            } 
        }
      
      stage('Deploy HOM') {
            when {
                branch 'release'
            }
            steps {
                 timeout(time: 24, unit: "HOURS") {
               
                 telegramSend("${JOB_NAME}...O Build ${BUILD_DISPLAY_NAME} - Requer uma aprovação para deploy !!!\n Consulte o log para detalhes -> [Job logs](${env.BUILD_URL}console)\n")
                 input message: 'Deseja realizar o deploy?', ok: 'SIM', submitter: 'marlon_goncalves, marcos_costa, bruno_alevato, robson_silva, rafael_losi'
            }  


       //Start JOB Rundeck para update de imagens no host homologação 
         
         script {
            step([$class: "RundeckNotifier",
              includeRundeckLogs: true,
              jobId: "53d39ad9-e8ce-41fe-84aa-a071992fcf8a",
              nodeFilters: "",
              //options: """
              //     PARAM_1=value1
               //    PARAM_2=value2
              //     PARAM_3=
              //     """,
              rundeckInstance: "Rundeck-SME",
              shouldFailTheBuild: true,
              shouldWaitForRundeckJob: true,
              tags: "",
              tailLog: true])
           }
      
       
            }
        }

        stage('Docker build HOM-R2') {
            when {
              branch 'release-r2'
            }
            steps {
              sh 'echo Deploying homologacao'
                
        // Start JOB Rundeck para build das imagens Docker e push registry SME
      
          script {
           step([$class: "RundeckNotifier",
              includeRundeckLogs: true,
                
               
              //JOB DE BUILD
              jobId: "f82d52b9-27bd-41cd-ae14-419c099df263",
              nodeFilters: "",
              //options: """
              //     PARAM_1=value1
               //    PARAM_2=value2
              //     PARAM_3=
              //     """,
              rundeckInstance: "Rundeck-SME",
              shouldFailTheBuild: true,
              shouldWaitForRundeckJob: true,
              tags: "",
              tailLog: true])
           }
            } 
        }
        
        stage('Deploy HOM-R2') {
            when {
                branch 'release-r2'
            }
            steps {
                 timeout(time: 24, unit: "HOURS") {
               
                 telegramSend("${JOB_NAME}...O Build ${BUILD_DISPLAY_NAME} - Requer uma aprovação para deploy !!!\n Consulte o log para detalhes -> [Job logs](${env.BUILD_URL}console)\n")
                 input message: 'Deseja realizar o deploy?', ok: 'SIM', submitter: 'marlon_goncalves, marcos_costa, bruno_alevato, robson_silva, rafael_losi'
            }  


       //Start JOB Rundeck para update de imagens no host homologação 
         
         script {
            step([$class: "RundeckNotifier",
              includeRundeckLogs: true,
              jobId: "7fb476c7-18d2-4dcd-8abb-e91afe700423",
              nodeFilters: "",
              //options: """
              //     PARAM_1=value1
               //    PARAM_2=value2
              //     PARAM_3=
              //     """,
              rundeckInstance: "Rundeck-SME",
              shouldFailTheBuild: true,
              shouldWaitForRundeckJob: true,
              tags: "",
              tailLog: true])
           }
      
       
            }
        }

        stage('Docker Build PROD') {

            when {
              branch 'master'
            }
            steps {
                 
                 sh 'Build docker image produção'
                
        // Start JOB Rundeck para build das imagens Docker e push registry SME
      
          script {
           step([$class: "RundeckNotifier",
              includeRundeckLogs: true,
            
               
              //JOB DE BUILD
              jobId: "0763a665-5d44-46ae-aeaa-82a15b730cd7",
              nodeFilters: "",
              //options: """
              //     PARAM_1=value1
               //    PARAM_2=value2
              //     PARAM_3=
              //     """,
              rundeckInstance: "Rundeck-SME",
              shouldFailTheBuild: true,
              shouldWaitForRundeckJob: true,
              tags: "",
              tailLog: true])
           }
            }
        }

      stage('Deploy PROD') {
          when {
            branch 'master'
          }
          steps {
            timeout(time: 24, unit: "HOURS") {
              telegramSend("${JOB_NAME}...O Build ${BUILD_DISPLAY_NAME} - Requer uma aprovação para deploy !!!\n Consulte o log para detalhes -> [Job logs](${env.BUILD_URL}console)\n")
              input message: 'Deseja realizar o deploy?', ok: 'SIM', submitter: 'marlon_goncalves, allan_santos, everton_nogueira, marcos_costa, bruno_alevato, robson_silva, rafael_losi'
            }       
                
       //Start JOB Rundeck para deploy em produção 
         
         script {
            step([$class: "RundeckNotifier",
              includeRundeckLogs: true,
              jobId: "310d82fe-a8ca-4086-a7d6-b7babf4f6234",
              nodeFilters: "",
              //options: """
              //     PARAM_1=value1
               //    PARAM_2=value2
              //     PARAM_3=
              //     """,
              rundeckInstance: "Rundeck-SME",
              shouldFailTheBuild: true,
              shouldWaitForRundeckJob: true,
              tags: "",
              tailLog: true])
         }
        }
      }
     
}

}