import Consulta_Ausentes_SGP_Localizadores from '../locators/consulta_ausentes_locators'

const consultaAusentesLocalizadores = new Consulta_Ausentes_SGP_Localizadores()

Cypress.Commands.add('acessar_consulta_ausencias', () => {
    cy.carregandoMenus()

    cy.get(consultaAusentesLocalizadores.menu_naapa()).should('be.visible').click()
    cy.get(consultaAusentesLocalizadores.busca_ativa()).should('be.visible').click()
    cy.get(consultaAusentesLocalizadores.menu_ausentes()).should('be.visible').click()
    cy.url().should('include', '/busca-ativa/criancas-estudantes/ausentes')
})

Cypress.Commands.add('inserir_ausencias', (ausencia) => {
    cy.get(consultaAusentesLocalizadores.campo_ausencias()).should('be.visible').then(($input) => {
    cy.wrap($input).type(ausencia)
    })
    cy.get(consultaAusentesLocalizadores.campo_ausencias()).should('have.value', ausencia).click()
    cy.get(consultaAusentesLocalizadores.clica_ausencia()).click()
})

Cypress.Commands.add('dados_carregados_ausentes', () => {
     cy.get(consultaAusentesLocalizadores.turmas_sem_dados()).should('not.exist')
})
