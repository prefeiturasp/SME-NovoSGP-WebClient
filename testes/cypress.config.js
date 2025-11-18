const { defineConfig } = require('cypress')
const allureWriter = require('@shelex/cypress-allure-plugin/writer')
const { cloudPlugin } = require('cypress-cloud/plugin');
const dotenv = require('dotenv')
const cucumber = require('cypress-cucumber-preprocessor').default
const postgreSQL = require('cypress-postgresql')
const pg = require('pg')

dotenv.config()

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE
}

module.exports = defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      allureWriter(on, config)
      require('./cypress/plugin/index')(on, config)

      on('file:preprocessor', cucumber())

      const pool = new pg.Pool(dbConfig)
      const tasks = postgreSQL.loadDBPlugin(pool)
      on('task', tasks)
      const envKeys = [
        'LOGIN_ADM_COTIC',
        'LOGIN_PROFESSOR',
        'LOGIN_ABAE',
        'LOGIN_CP',
        'LOGIN_SUPERVISOR',
        'LOGIN_PRIMEIRO_ACESSO',
        'USUARIO_INVALIDO',
        'USUARIO_INEXISTENTE',
        'CODIGO_RF',
        'NOME_SERVIDOR',
        'SENHA',
        'SENHA_INVALIDA',
        'TOKEN_VALIDO',
        'TOKEN_INVALIDO',
        'EMAIL',
        'EMAIL_INVALIDO',
        'PERFIL_VALIDO',
        'PERFIL_INVALIDO',
        'TIPO_RESPONSAVEL_SUPERVISOR_ESCOLAR',
        'TIPO_RESPONSAVEL_PAAI',
        'TIPO_RESPONSAVEL_PSICOLOGO_ESCOLAR',
        'TIPO_RESPONSAVEL_PSICOPEDAGOGO',
        'TIPO_RESPONSAVEL_ASSISTENTE_SOCIAL',
        'DRE_CODIGO',
        'UE_CODIGO',      
        'AULA_CODIGO',
        'AULA_CODIGO_INVALIDO',
        'AULA_ANOTACAO_CODIGO',
        'TURMA_CODIGO',
        'TURMA_CODIGO_INVALIDO',
        'TURMA_CODIGO_FECHAMENTO',
        'TURMA_CODIGO_APANHADO_GERAL',
        'BIMESTRE_CODIGO',
        'BIMESTRE_CODIGO_INVALIDO',
        'SEMESTRE_CODIGO',
        'ANO_LETIVO',
        'ANO_LETIVO_INVALIDO',
        'ANOS',
        'TIPO_CALENDARIO',
        'DISCIPLINA_CODIGO',
        'DISCIPLINA_CODIGO_INVALIDO',
        'CICLO_ALFABETIZACAO',
        'CICLO_INTERDISCIPLINAR',
        'CICLO_AUTORAL',
        'CICLO_FILTRO_INVALIDO',
        'COM_FILTRO',
        'SEM_FILTRO',
        'FILTRO_AVANCADO',
        'COM_HISTORICO',
        'SEM_HISTORICO',
        'DATA_INICIO',
        'DATA_FIM',
        'DATA_INVALIDA',
        'COMPONENTE_CURRICULAR_CODIGO',
        'COMPONENTE_CURRICULAR_ANOTACAO_CODIGO',
        'MODALIDADE_CODIGO',
        'MODALIDADE_CODIGO_INVALIDO',
        'QUESTIONARIO_ID',
        'MAPEAMENTO_ESTUDANTE_ID',
        'ALUNO_ID',
        'ANOTACAO_ALUNO_ID',
        'ANOTACAO_FREQUENCIA_ALUNO_ID',
        'ANOTACAO_FREQUENCIA_ALUNO_ID_INVALIDO',
        'ANOTACAO_FREQUENCIA_ALUNO_ID_INEXISTENTE',
        'ANOTACAO_ALUNO',
        'SITUACAO_FECHAMENTO_ID',
        'SITUACAO_CONSELHO_CLASSE_ID',
        'SITUACAO_CONSELHO_CLASSE_ID_INVALIDO',
        'FECHAMENTO_ACOMPANHAMENTO_PENDENCIA_ID',
        'FECHAMENTO_ACOMPANHAMENTO_PENDENCIA_ID_INVALIDO',
        'TIPO_PENDENCIA_ID',       
        'CONCEITO_ID',
        'NOTIFICACAO_CODIGO',
        'NOTIFICACAO_CODIGO_INVALIDO',
        'MODO_VISUALIZACAO',
        'MOTIVO_AUSENCIA_ID',
        'NOTA',
        'SINTESE_ID',
        'CEP_VALIDO',
        'CEP_INVALIDO'
      ]

      const customVariable = Object.fromEntries(envKeys.map(key => [key, process.env[key] ?? ""]));
      
      const enhancedConfig = {
        ...config,
        env: {
          ...config.env,
          ...customVariable,
        },
      };

      const result = await cloudPlugin(on, enhancedConfig);
      return result;
    },
    baseUrl: 'https://hom-novosgp.sme.prefeitura.sp.gov.br',
    viewportWidth: 1600,
    viewportHeight: 1050,
    video: false,
    retries: {
      runMode: 2,
      openMode: 0
    },
    screenshotOnRunFailure: false,
    chromeWebSecurity: false,
    experimentalRunAllSpecs: true,
    failOnStatusCode: false,
    specPattern: 'cypress/e2e/**/**/*.{feature,cy.{js,jsx}}',
    defaultCommandTimeout: 60000,
    requestTimeout: 60000,
    execTimeout: 60000,
    pageLoadTimeout: 60000,
    waitForAnimations: true,
    animationDistanceThreshold: 5
  }
})

