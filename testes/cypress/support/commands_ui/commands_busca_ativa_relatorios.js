import Busca_Ativa_Relatorios_SGP_Localizadores from '../locators/busca_ativa_relatorios_locators'

const buscaAtivaRelatoriosSGPlocalizadores = new Busca_Ativa_Relatorios_SGP_Localizadores()

Cypress.Commands.add('acessar_busca_ativa', () => {
    cy.carregandoMenus()
    
    cy.get(buscaAtivaRelatoriosSGPlocalizadores.menu_relatorios()).should('be.visible').click()
    cy.get(buscaAtivaRelatoriosSGPlocalizadores.menu_naapa()).should('be.visible').click()
    cy.get(buscaAtivaRelatoriosSGPlocalizadores.menu_busca_ativa()).should('be.visible').click()
    cy.url().should('include', '/relatorios/naapa/busca-ativa')
})

Cypress.Commands.add('inserir_turmas_busca_ativa', (turmas) => {
    turmas.split(',').forEach((turma) => {
        cy.get(buscaAtivaRelatoriosSGPlocalizadores.campo_turma()).click() 
        cy.wait(1000) 

        cy.get('body').then(($body) => {
            if ($body.find(buscaAtivaRelatoriosSGPlocalizadores.clica_turma()).length > 0) {
                cy.get(buscaAtivaRelatoriosSGPlocalizadores.clica_turma(), { timeout: 60000 })
                  .contains(turma.trim()).should('be.visible').click({ force: true })
                cy.get(buscaAtivaRelatoriosSGPlocalizadores.campo_turma()).click() 
                cy.wait(1000)
            } else {
                cy.get(buscaAtivaRelatoriosSGPlocalizadores.campo_turma()).click({ force: true })
                cy.wait(1000)
                cy.get(buscaAtivaRelatoriosSGPlocalizadores.clica_turma(), { timeout: 60000 })
                  .contains(turma.trim()).should('be.visible').click({ force: true })
                cy.get(buscaAtivaRelatoriosSGPlocalizadores.campo_turma()).click()
                cy.wait(1000)
            }
        })
    })
})

Cypress.Commands.add('gerar_relatorio_busca_ativa', () => {
    cy.get(buscaAtivaRelatoriosSGPlocalizadores.gerar_relatorio()).click()
})

Cypress.Commands.add('validar_gerar_relatorio_busca_ativa', () => {
    cy.get(buscaAtivaRelatoriosSGPlocalizadores.notificacoes())
        .should('contain.text', 'Solicitação de geração do relatório gerada com sucesso. Em breve você receberá uma notificação com o resultado.')
})


