
Cypress.Commands.add('buscar_mapeamento_estudante_questionario_id', (mapeamentoEstudanteId) => {
    const questionarioId = Cypress.env('QUESTIONARIO_ID')
    return cy.gerar_token().then((token) => {
        return cy.request({
            method: 'GET',
            url: `${Cypress.config('baseUrl')}/api/v1/mapeamentos-estudantes/questionarios/${questionarioId}/questoes`,
            qs: { mapeamentoEstudanteId },
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            failOnStatusCode: false
        }).then((response) => {
            cy.log(`Status: ${response.status}`)
            cy.log(`Response Body: ${JSON.stringify(response.body)}`)
            return cy.wrap(response)
        })
    })
})

Cypress.Commands.add('nao_autorizado_mapeamentos_questionario_id', (mapeamentoEstudanteId) => {
    const questionarioId = Cypress.env('QUESTIONARIO_ID')
    return cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/v1/mapeamentos-estudantes/questionarios/${questionarioId}/questoes`,
        qs: { mapeamentoEstudanteId },
        headers: { 'Authorization': 'Bearer token_invalido' },
        failOnStatusCode: false
    })
})

Cypress.Commands.add('buscar_mapeamento_estudante_id', () => {
    const mapeamentoEstudanteId = Cypress.env('MAPEAMENTO_ESTUDANTE_ID')
    return cy.gerar_token().then((token) => {
        return cy.request({
            method: 'GET',
            url: `${Cypress.config('baseUrl')}/api/v1/mapeamentos-estudantes/secoes`,
            qs: { mapeamentoEstudanteId },
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            failOnStatusCode: false
        }).then((response) => {
            cy.log(`Status: ${response.status}`)
            cy.log(`Response Body: ${JSON.stringify(response.body)}`)
            
            return cy.wrap(response).then((res) => {
                expect(res.status).to.equal(200)
                return res
            })
        })
    })
})

Cypress.Commands.add('nao_autorizado_mapeamentos_estudante_id', () => {
    const mapeamentoEstudanteId = Cypress.env('MAPEAMENTO_ESTUDANTE_ID')
    return cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/v1/mapeamentos-estudantes/secoes`,
        qs: { mapeamentoEstudanteId },
        headers: { 
            'Authorization': 'Bearer token_invalido'
        },
        failOnStatusCode: false
    })
})
