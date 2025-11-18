Cypress.Commands.add('gerar_email_usuario', () => {
    const prefixo = Math.random().toString(36).substring(2)
    const prefixoAjustado = prefixo.padEnd(9, '0').substring(0, 9)
    const dominio = '@sme.prefeitura.sp.gov.br';
    return `${prefixoAjustado}${dominio}`
})

Cypress.Commands.add('buscar_dados_usuario', () => {
  return cy.gerar_token().then((token) => {
      return cy.request({
          method: 'GET',
          url: `${Cypress.config('baseUrl')}/api/v1/usuarios/meus-dados`,
          headers: {
              'accept': 'text/plain',
              'Authorization': `Bearer ${token}`
          },
          failOnStatusCode: false
      })
  })
})

Cypress.Commands.add('nao_autorizado_buscar_dados_usuario', () => {
  return cy.request({
      method: 'GET',
      url: `${Cypress.config('baseUrl')}/api/v1/usuarios/meus-dados`,
      headers: {
           'accept': 'text/plain',
           'Authorization': 'Bearer token_invalido' },
      failOnStatusCode: false
  })
})
