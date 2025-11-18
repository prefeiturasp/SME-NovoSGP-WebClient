/// <reference types='cypress' />

describe('API - Relatório dinâmico NAAPA', () => {
  it('Carrega os dados do relatório', () => {
    cy.filtrar_relatorio_dinamico_naapa().then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('totalRegistro')
    })
  })

  it('Não carrega dados sem usuário autenticado', () => {
    cy.nao_autorizado_filtrar_relatorio_dinamico_naapa().then((response) => {
      expect(response.status).to.eq(401)
    })
  })
})