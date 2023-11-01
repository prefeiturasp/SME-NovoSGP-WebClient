pipeline {
    environment {
      branchname =  env.BRANCH_NAME.toLowerCase()
      kubeconfig = getKubeconf(env.branchname)
      registryCredential = 'jenkins_registry'
      namespace = "${env.branchname == 'pre-prod' ? 'sme-novosgp-d1' : env.branchname == 'development' ? 'novosgp-dev' : env.branchname == 'release' ? 'novosgp-hom' : env.branchname == 'release-r2' ? 'novosgp-hom2' : 'sme-novosgp' }"
           
    }

    agent {
      kubernetes { label 'builder' }
    }

    options {
      buildDiscarder(logRotator(numToKeepStr: '20', artifactNumToKeepStr: '20'))
      disableConcurrentBuilds()
      skipDefaultCheckout()
    }

    stages {

        stage('Build') {
         agent { kubernetes { 
                  label 'builder'
                  defaultContainer 'builder'
                }
              }
          when { anyOf { branch 'master'; branch 'main'; branch 'pre-prod'; branch "story/*"; branch 'development'; branch 'release'; branch 'release-r2'; } }
          steps {
            checkout scm 
            script {
              imagename1 = "registry.sme.prefeitura.sp.gov.br/${env.branchname}/sme-sgp-webclient"
              dockerImage1 = docker.build(imagename1, "-f Dockerfile .")
              docker.withRegistry( 'https://registry.sme.prefeitura.sp.gov.br', registryCredential ) {
              dockerImage1.push()
              }
              sh "docker rmi $imagename1"
            }
          }
        }

        stage('Deploy'){
              agent { kubernetes { 
                  label 'builder'
                  defaultContainer 'builder'
                }
              }
            when { anyOf {  branch 'master'; branch 'main'; branch 'pre-prod'; branch 'development'; branch 'release'; branch 'release-r2'; } }
            steps {
                script{
                    if ( env.branchname == 'main' ||  env.branchname == 'master' ||  env.branchname == 'pre-prod' ) {
		      withCredentials([string(credentialsId: 'aprovadores-sgp', variable: 'aprovadores')]) {
		        timeout(time: 24, unit: "HOURS") {
			  input message: 'Deseja realizar o deploy?', ok: 'SIM', submitter: "${aprovadores}"
			}
	              }
                    }
                    withCredentials([file(credentialsId: "${kubeconfig}", variable: 'config')]){
                        sh('rm -f '+"$home"+'/.kube/config')
                        sh('cp $config '+"$home"+'/.kube/config')
                        sh "kubectl rollout restart deployment/sme-webclient -n ${namespace}"
                        sh('rm -f '+"$home"+'/.kube/config')
                    }
                }
            }
        }
    }

  post {
    success { sendTelegram("🚀 Job Name: ${JOB_NAME} \nBuild: ${BUILD_DISPLAY_NAME} \nStatus: Success \nLog: \n${env.BUILD_URL}console") }
    unstable { sendTelegram("💣 Job Name: ${JOB_NAME} \nBuild: ${BUILD_DISPLAY_NAME} \nStatus: Unstable \nLog: \n${env.BUILD_URL}console") }
    failure { sendTelegram("💥 Job Name: ${JOB_NAME} \nBuild: ${BUILD_DISPLAY_NAME} \nStatus: Failure \nLog: \n${env.BUILD_URL}console") }
    aborted { sendTelegram ("😥 Job Name: ${JOB_NAME} \nBuild: ${BUILD_DISPLAY_NAME} \nStatus: Aborted \nLog: \n${env.BUILD_URL}console") }
  }
}
def sendTelegram(message) {
    def encodedMessage = URLEncoder.encode(message, "UTF-8")
    withCredentials([string(credentialsId: 'telegramToken', variable: 'TOKEN'),
    string(credentialsId: 'telegramChatId', variable: 'CHAT_ID')]) {
        response = httpRequest (consoleLogResponseBody: true,
                contentType: 'APPLICATION_JSON',
                httpMode: 'GET',
                url: 'https://api.telegram.org/bot'+"$TOKEN"+'/sendMessage?text='+encodedMessage+'&chat_id='+"$CHAT_ID"+'&disable_web_page_preview=true',
                validResponseCodes: '200')
        return response
    }
}
def getKubeconf(branchName) {
    if("main".equals(branchName)) { return "config_prd"; }
    else if ("pre-prod".equals(branchName)) { return "config_prd"; }
    else if ("master".equals(branchName)) { return "config_prd"; }
    else if ("homolog".equals(branchName)) { return "config_release"; }
    else if ("release".equals(branchName)) { return "config_release"; }
    else if ("release-r2".equals(branchName)) { return "config_release"; }
    else if ("development".equals(branchName)) { return "config_release"; }
    else if ("develop".equals(branchName)) { return "config_release"; }
}
