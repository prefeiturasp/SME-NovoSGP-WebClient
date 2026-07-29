import Registro_Acoes_Busca_SGP_Localizadores from '../locators/registro_acoes_busca_locators'

const registroAcoesBuscaSGPlocalizadores = new Registro_Acoes_Busca_SGP_Localizadores()

Cypress.on('uncaught:exception', () => false)

Cypress.Commands.add('acessar_registro_acoes_busca', () => {
    cy.carregandoMenus()
    
    cy.get(registroAcoesBuscaSGPlocalizadores.menu_naapa()).should('be.visible').click()
    cy.get(registroAcoesBuscaSGPlocalizadores.busca_ativa()).should('be.visible').click()
    cy.get(registroAcoesBuscaSGPlocalizadores.menu_registro_acoes()).should('be.visible').click()
    cy.url().should('include', '/busca-ativa/registro-acoes')
})

Cypress.Commands.add('inserir_turma_registro_acoes_busca', (turma) => {
    cy.get(registroAcoesBuscaSGPlocalizadores.campo_turma_registro_acoes_busca()).click({ force: true })
    cy.wait(1000)

    cy.get('body').then(($body) => {
        if ($body.find(registroAcoesBuscaSGPlocalizadores.clica_turma_registro_acoes_busca()).length > 0) {
            cy.get(registroAcoesBuscaSGPlocalizadores.clica_turma_registro_acoes_busca(), { timeout: 60000 })
              .contains(turma.trim()).should('be.visible').click({ force: true })
        } else {
            cy.get(registroAcoesBuscaSGPlocalizadores.campo_turma_registro_acoes_busca()).click({ force: true })
            cy.wait(1000)
            cy.get(registroAcoesBuscaSGPlocalizadores.clica_turma_registro_acoes_busca(), { timeout: 60000 })
              .contains(turma.trim()).should('be.visible').click({ force: true })
        }
    })

    cy.get(registroAcoesBuscaSGPlocalizadores.campo_turma_registro_acoes_busca()).click()
})

Cypress.Commands.add('inserir_periodo_registro_acoes_busca', () => {
    cy.get(registroAcoesBuscaSGPlocalizadores.data_inicio_registro_acoes_busca()).click({ force: true })
    cy.get(registroAcoesBuscaSGPlocalizadores.mes_atual_registro_acoes_busca()).click()
    cy.get(registroAcoesBuscaSGPlocalizadores.mes_inicio_registro_acoes_busca()).click()
    cy.get(registroAcoesBuscaSGPlocalizadores.dia_registro_acoes_busca()).click()
    cy.get(registroAcoesBuscaSGPlocalizadores.data_fim_registro_acoes_busca()).click()
    cy.get(registroAcoesBuscaSGPlocalizadores.hoje_registro_acoes_busca()).click()
})

Cypress.Commands.add('selecionarContatoRegistroAcoesBusca', (tipoContato = 'ligacao') => {
  cy.get(registroAcoesBuscaSGPlocalizadores.campo_meio_contato_registro_acoes_busca())
    .should('be.visible')
    .click()

  cy.get(registroAcoesBuscaSGPlocalizadores.dropdown_visivel(), { timeout: 5000 })
    .should('exist')
    .and('be.visible')

  let index;
  switch (tipoContato.toLowerCase()) {
    case 'ligacao':
      index = 1
      break
    case 'visita':
      index = 2
      break
    default:
      throw new Error(`Tipo de contato inválido: "${tipoContato}". Use "ligacao" ou "visita".`)
  }

  cy.get(registroAcoesBuscaSGPlocalizadores.dropdown_visivel(), { timeout: 5000 })
    .find(registroAcoesBuscaSGPlocalizadores.opcao_meio_contato(index))
    .should('exist')
    .click({ force: true })
})

Cypress.Commands.add('selecionar_contato_registro_acoes_busca', () => {
  cy.selecionarContatoRegistroAcoesBusca('ligacao')
})

Cypress.Commands.add('dados_carregados_registro_acoes_busca', (cenario) => {
    if (cenario === "Sem dados encontrados") {
        cy.get(registroAcoesBuscaSGPlocalizadores.tabela_dados_registro_acoes_busca()).should('exist')
    } else {
        cy.get(registroAcoesBuscaSGPlocalizadores.tabela_dados_registro_acoes_busca()).should('not.exist')
    }
})

