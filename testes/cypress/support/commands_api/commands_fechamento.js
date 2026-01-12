Cypress.Commands.add('buscar_fechamento_acompanhamento_por_conselho_classe_alunos', () => {
    return cy.gerar_token().then(token => {
        return cy.request({
            method: 'GET',
            url: Cypress.config('baseUrl') +`/api/v1/fechamentos/acompanhamentos/turmas/${Cypress.env('TURMA_CODIGO_FECHAMENTO')}/conselho-classe/bimestres/${Cypress.env('BIMESTRE_CODIGO')}/alunos/${Cypress.env('ALUNO_ID')}/componentes-curriculares/detalhamento`,
            headers: {
              'Accept': 'text/plain',
              'Authorization': `Bearer ${token}`
            },
            failOnStatusCode: false,
            timeout: 1200000            
        })
    })
})

Cypress.Commands.add('nao_autorizado_fechamento_acompanhamento_por_conselho_classe_alunos', () => {
    return cy.request({
        method: 'GET',
        url:  Cypress.config('baseUrl') +`/api/v1/fechamentos/acompanhamentos/turmas/${Cypress.env('TURMA_CODIGO_FECHAMENTO')}/conselho-classe/bimestres/${Cypress.env('BIMESTRE_CODIGO')}/alunos/${Cypress.env('ALUNO_ID')}/componentes-curriculares/detalhamento`,
        headers: {
          'Accept': 'text/plain',
          'Authorization': 'Bearer token-invalido'
        },
        failOnStatusCode: false,
    })
})

Cypress.Commands.add('turma_invalido_fechamento_acompanhamento_por_conselho_classe_alunos', () => {
    return cy.gerar_token().then(token => {
        return cy.request({
            method: 'GET',
            url: Cypress.config('baseUrl') + `/api/v1/fechamentos/acompanhamentos/turmas/${Cypress.env('TURMA_CODIGO_FECHAMENTO_INVALIDO')}/conselho-classe/bimestres/${Cypress.env('BIMESTRE_CODIGO')}/alunos/${Cypress.env('ALUNO_ID')}/componentes-curriculares/detalhamento`,
            headers: {
              'Accept': 'text/plain',
              'Authorization': `Bearer ${token}`
            },
            failOnStatusCode: false,        
        })
    })
})

Cypress.Commands.add('bimestre_invalido_fechamento_acompanhamento_por_conselho_classe_alunos', () => {
    return cy.gerar_token().then(token => {
        return cy.request({
            method: 'GET',
            url: Cypress.config('baseUrl') +`/api/v1/fechamentos/acompanhamentos/turmas/${Cypress.env('TURMA_CODIGO_FECHAMENTO')}/conselho-classe/bimestres/${Cypress.env('BIMESTRE_CODIGO_INVALIDO')}/alunos/${Cypress.env('ALUNO_ID')}/componentes-curriculares/detalhamento`,
            headers: {
              'Accept': 'text/plain',
              'Authorization': `Bearer ${token}`
            },
            failOnStatusCode: false,    
        })
    })
})







