Cypress.Commands.add('buscar_fechamento_acompanhamento_por_turmas', () => {
    return cy.gerar_token().then(token => {
        return cy.request({
            method: 'GET',
            url: Cypress.config('baseUrl') + `/api/v1/fechamentos/turmas?turmaCodigo=${Cypress.env('TURMA_CODIGO_FECHAMENTO')}&disciplinaCodigo=${Cypress.env('DISCIPLINA_CODIGO')}&bimestre=${Cypress.env('BIMESTRE_CODIGO')}&semestre=${Cypress.env('SEMESTRE_CODIGO')}`,
            headers: {
                'Accept': 'text/plain',
                'Authorization': `Bearer ${token}`
            },
            timeout: 60000,
            failOnStatusCode: false,               
        })
    })
})

Cypress.Commands.add('nao_autorizado_fechamento_acompanhamento_por_turmas', () => {
    return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/fechamentos/turmas?turmaCodigo=${Cypress.env('TURMA_CODIGO_FECHAMENTO')}&disciplinaCodigo=${Cypress.env('DISCIPLINA_CODIGO')}&bimestre=${Cypress.env('BIMESTRE_CODIGO')}&semestre=${Cypress.env('SEMESTRE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',
          'Authorization': 'Bearer token-invalido'
        },
        failOnStatusCode: false,
    })
})

Cypress.Commands.add('nao_buscar_fechamento_acompanhamento_por_turmas', () => {
    return cy.gerar_token().then(token => {
        return cy.request({
            method: 'GET',
            url: Cypress.config('baseUrl') + `/api/v1/fechamentos/turmas?turmaCodigo=${Cypress.env('TURMA_CODIGO_FECHAMENTO_INVALIDO')}&disciplinaCodigo=${Cypress.env('DISCIPLINA_CODIGO')}&bimestre=${Cypress.env('BIMESTRE_CODIGO')}&semestre=${Cypress.env('SEMESTRE_CODIGO')}`,
            headers: {
                'Accept': 'text/plain',
                'Authorization': `Bearer ${token}`
            },           
            failOnStatusCode: false,               
        })
    })
})

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

Cypress.Commands.add('buscar_fechamento_acompanhamento_componente_curricular_pendencia', () => {
    return cy.gerar_token().then(token => {
        return cy.request({
            method: 'GET',
            url: Cypress.config('baseUrl') + `/api/v1/fechamentos/acompanhamentos/turmas/${Cypress.env('TURMA_CODIGO_FECHAMENTO')}/fechamento/bimestres/${Cypress.env('BIMESTRE_CODIGO')}/componentes-curriculares/${Cypress.env('COMPONENTE_CURRICULAR_CODIGO')}/pendencias`,
            headers: {
              'Accept': 'text/plain',
               'Authorization': `Bearer ${token}`
            },
            failOnStatusCode: false,
            timeout: 60000              
        })
    })
})

Cypress.Commands.add('nao_autorizado_fechamento_acompanhamento_componente_curricular_pendencia', () => {
    return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/fechamentos/acompanhamentos/turmas/${Cypress.env('TURMA_CODIGO_FECHAMENTO')}/fechamento/bimestres/${Cypress.env('BIMESTRE_CODIGO')}/componentes-curriculares/${Cypress.env('COMPONENTE_CURRICULAR_CODIGO')}/pendencias`,
        headers: {
          'Accept': 'text/plain',
          'Authorization': 'Bearer token-invalido'
        },
        failOnStatusCode: false,
     })
})

Cypress.Commands.add('buscar_fechamento_acompanhamento_fechamento_turma_bimestre', () => {
    return cy.gerar_token().then(token => {
        return cy.request({
            method: 'GET',
            url: Cypress.config('baseUrl') + `/api/v1/fechamentos/acompanhamentos/turmas/${Cypress.env('TURMA_CODIGO_FECHAMENTO')}/fechamento/bimestres/${Cypress.env('BIMESTRE_CODIGO')}/componentes-curriculares?situacaoFechamento=${Cypress.env('SITUACAO_FECHAMENTO_ID')}`,
            headers: {
              'Accept': 'text/plain',
              'Authorization': `Bearer ${token}`
           },
           failOnStatusCode: false, 
            timeout: 120000            
         })
    })
})

Cypress.Commands.add('nao_autorizado_fechamento_acompanhamento_fechamento_turma_bimestre', () => {
    return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/fechamentos/acompanhamentos/turmas/${Cypress.env('TURMA_CODIGO_FECHAMENTO')}/fechamento/bimestres/${Cypress.env('BIMESTRE_CODIGO')}/componentes-curriculares?situacaoFechamento=${Cypress.env('SITUACAO_FECHAMENTO_ID')}`,
        headers: {
          'Accept': 'text/plain',
          'Authorization': 'Bearer token-invalido'
        },
        failOnStatusCode: false,
    })
})

Cypress.Commands.add('turma_invalido_fechamento_acompanhamento_fechamento_turma_bimestre', () => {
    return cy.gerar_token().then(token => {
        return cy.request({
            method: 'GET',
            url: Cypress.config('baseUrl') + `/api/v1/fechamentos/acompanhamentos/turmas/${Cypress.env('TURMA_CODIGO_FECHAMENTO_INVALIDO')}/fechamento/bimestres/${Cypress.env('BIMESTRE_CODIGO')}/componentes-curriculares?situacaoFechamento=${Cypress.env('SITUACAO_FECHAMENTO_ID')}`,
            headers: {
              'Accept': 'text/plain',
              'Authorization': `Bearer ${token}`
            },
            failOnStatusCode: false,     
        })
    })
})

Cypress.Commands.add('buscar_fechamento_acompanhamento_turma_bimestre', () => {
    return cy.gerar_token().then(token => {
        return cy.request({
            method: 'GET',
            url: Cypress.config('baseUrl') + `/api/v1/fechamentos/acompanhamentos/turmas/${Cypress.env('TURMA_CODIGO_FECHAMENTO')}/fechamentos/bimestres/${Cypress.env('BIMESTRE_CODIGO')}`,
            headers: {
              'Accept': 'text/plain',
              'Authorization': `Bearer ${token}`
           },
           failOnStatusCode: false,            
        })
    })
})

Cypress.Commands.add('nao_autorizado_buscar_fechamento_acompanhamento_turma_bimestre', () => {
    return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/fechamentos/acompanhamentos/turmas/${Cypress.env('TURMA_CODIGO_FECHAMENTO')}/fechamentos/bimestres/${Cypress.env('BIMESTRE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',
          'Authorization': 'Bearer token-invalido'
        },
        failOnStatusCode: false,
    })
})

Cypress.Commands.add('buscar_fechamento_acompanhamento_conselho_classe_alunos', () => {
    return cy.gerar_token().then(token => {
        return cy.request({
            method: 'GET',
            url: Cypress.config('baseUrl') + `/api/v1/fechamentos/acompanhamentos/turmas/${Cypress.env('TURMA_CODIGO_FECHAMENTO')}/conselho-classe/bimestres/${Cypress.env('BIMESTRE_CODIGO')}/alunos?situacaoConselhoClasse=${Cypress.env('SITUACAO_CONSELHO_CLASSE_ID')}`,
            headers: {
              'Accept': 'text/plain',
              'Authorization': `Bearer ${token}`
           },
           failOnStatusCode: false,            
         })
    })
})

Cypress.Commands.add('nao_autorizado_buscar_fechamento_acompanhamento_conselho_classe_alunos', () => {
    return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/fechamentos/acompanhamentos/turmas/${Cypress.env('TURMA_CODIGO_FECHAMENTO')}/conselho-classe/bimestres/${Cypress.env('BIMESTRE_CODIGO')}/alunos?situacaoConselhoClasse=${Cypress.env('SITUACAO_CONSELHO_CLASSE_ID')}`,
        headers: {
          'Accept': 'text/plain',
          'Authorization': 'Bearer token-invalido'
        },
        failOnStatusCode: false,
    })
})

Cypress.Commands.add('turma_invalido_buscar_fechamento_acompanhamento_conselho_classe_alunos', () => {
    return cy.gerar_token().then(token => {
        return cy.request({
            method: 'GET',
            url: Cypress.config('baseUrl') + `/api/v1/fechamentos/acompanhamentos/turmas/${Cypress.env('TURMA_CODIGO_FECHAMENTO_INVALIDO')}/conselho-classe/bimestres/${Cypress.env('BIMESTRE_CODIGO')}/alunos?situacaoConselhoClasse=${Cypress.env('SITUACAO_CONSELHO_CLASSE_ID')}`,
            headers: {
              'Accept': 'text/plain',
              'Authorization': `Bearer ${token}`
            },
            failOnStatusCode: false,     
         })
    })
})

Cypress.Commands.add('bimestre_invalido_buscar_fechamento_acompanhamento_conselho_classe_alunos', () => {
    return cy.gerar_token().then(token => {
        return cy.request({
            method: 'GET',
            url: Cypress.config('baseUrl') + `/api/v1/fechamentos/acompanhamentos/turmas/${Cypress.env('TURMA_CODIGO_FECHAMENTO')}/conselho-classe/bimestres/${Cypress.env('BIMESTRE_CODIGO_INVALIDO')}/alunos?situacaoConselhoClasse=${Cypress.env('SITUACAO_CONSELHO_CLASSE_ID')}`,
            headers: {
              'Accept': 'text/plain',
              'Authorization': `Bearer ${token}`
            },
            failOnStatusCode: false,     
         })
    })
})

Cypress.Commands.add('buscar_fechamento_acompanhamento_conselho_classe', () => {
    return cy.gerar_token().then(token => {
        return cy.request({
            method: 'GET',
            url: Cypress.config('baseUrl') + `/api/v1/fechamentos/acompanhamentos/turmas/${Cypress.env('TURMA_CODIGO_FECHAMENTO')}/conselho-classe/bimestres/${Cypress.env('BIMESTRE_CODIGO')}?situacaoConselhoClasse=${Cypress.env('SITUACAO_CONSELHO_CLASSE_ID')}`,
            headers: {
              'Accept': 'text/plain',
              'Authorization': `Bearer ${token}`
           },
           failOnStatusCode: false,            
        })
   })
})

Cypress.Commands.add('nao_autorizado_buscar_fechamento_acompanhamento_conselho_classe', () => {
    return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/fechamentos/acompanhamentos/turmas/${Cypress.env('TURMA_CODIGO_FECHAMENTO')}/conselho-classe/bimestres/${Cypress.env('BIMESTRE_CODIGO')}?situacaoConselhoClasse=${Cypress.env('SITUACAO_CONSELHO_CLASSE_ID')}`,
        headers: {
          'Accept': 'text/plain',
          'Authorization': 'Bearer token-invalido'
        },
        failOnStatusCode: false,
    })
})

Cypress.Commands.add('turma_invalido_buscar_fechamento_acompanhamento_conselho_classe', () => {
    return cy.gerar_token().then(token => {
        return cy.request({
            method: 'GET',
            url: Cypress.config('baseUrl') + `/api/v1/fechamentos/acompanhamentos/turmas/${Cypress.env('TURMA_CODIGO_FECHAMENTO_INVALIDO')}/conselho-classe/bimestres/${Cypress.env('BIMESTRE_CODIGO')}?situacaoConselhoClasse=${Cypress.env('SITUACAO_CONSELHO_CLASSE_ID')}`,
            headers: {
              'Accept': 'text/plain',
              'Authorization': `Bearer ${token}`
            },
            failOnStatusCode: false,     
         })
    })
})

Cypress.Commands.add('bimestre_invalido_buscar_fechamento_acompanhamento_conselho_classe', () => {
    return cy.gerar_token().then(token => {
        return cy.request({
            method: 'GET',
            url: Cypress.config('baseUrl') + `/api/v1/fechamentos/acompanhamentos/turmas/${Cypress.env('TURMA_CODIGO_FECHAMENTO')}/conselho-classe/bimestres/${Cypress.env('BIMESTRE_CODIGO_INVALIDO')}?situacaoConselhoClasse=${Cypress.env('SITUACAO_CONSELHO_CLASSE_ID')}`,
            headers: {
              'Accept': 'text/plain',
              'Authorization': `Bearer ${token}`
            },
            failOnStatusCode: false,     
        })
    })
})

Cypress.Commands.add('conselho_classe_invalido_buscar_fechamento_acompanhamento_conselho_classe', () => {
    return cy.gerar_token().then(token => {
        return cy.request({
            method: 'GET',
            url: Cypress.config('baseUrl') + `/api/v1/fechamentos/acompanhamentos/turmas/${Cypress.env('TURMA_CODIGO_FECHAMENTO_INVALIDO')}/conselho-classe/bimestres/${Cypress.env('BIMESTRE_CODIGO_INVALIDO')}?situacaoConselhoClasse=${Cypress.env('SITUACAO_CONSELHO_CLASSE_ID_INVALIDO')}`,
            headers: {
              'Accept': 'text/plain',
              'Authorization': `Bearer ${token}`
            },
            failOnStatusCode: false,     
        })
   })
})

Cypress.Commands.add('alterar_fechamento_final_bimestre_aberto', () => {
    return cy.gerar_token().then(token => {
        return cy.request({
            method: 'POST',
            url: Cypress.config('baseUrl') + `/api/v1/fechamentos/finais`,
            headers: {
                'Accept': 'text/plain',
                'Authorization': `Bearer ${token}`
            },
            body: {
                "ehRegencia": true,
                "disciplinaId": `${Cypress.env('DISCIPLINA_CODIGO')}`,
                "itens": [
                  {
                    "alunoRf": `${Cypress.env('ALUNO_ID')}`,
                    "componenteCurricularCodigo": `${Cypress.env('COMPONENTE_CURRICULAR_CODIGO')}`,
                    "conceitoId": `${Cypress.env('CONCEITO_ID')}`,
                    "nota": `${Cypress.env('NOTA')}`,
                    "sinteseId": `${Cypress.env('SINTESE_ID')}`,
                  }
                ],
                "turmaCodigo": `${Cypress.env('TURMA_CODIGO')}`,
                 }, 
            timeout: 60000,
            failOnStatusCode: false,               
        })
    })
})

Cypress.Commands.add('alterar_fechamento_final_turma_invalida', () => {
    return cy.gerar_token().then(token => {
        return cy.request({
            method: 'POST',
            url: Cypress.config('baseUrl') + `/api/v1/fechamentos/finais`,
            headers: {
                'Accept': 'text/plain',
                'Authorization': `Bearer ${token}`
            },
            body: {
                "ehRegencia": true,
                "disciplinaId": `${Cypress.env('DISCIPLINA_CODIGO')}`,
                "itens": [
                  {
                    "alunoRf": `${Cypress.env('ALUNO_ID')}`,
                    "componenteCurricularCodigo": `${Cypress.env('COMPONENTE_CURRICULAR_CODIGO')}`,
                    "conceitoId": `${Cypress.env('CONCEITO_ID')}`,
                    "nota": `${Cypress.env('NOTA')}`,
                    "sinteseId": `${Cypress.env('SINTESE_ID')}`,
                  }
                ],
                "turmaCodigo": `${Cypress.env('TURMA_CODIGO_INVALIDO')}`,
                 }, 
            failOnStatusCode: false,              
        })
    })
})

Cypress.Commands.add('nao_autorizado_alterar_fechamento_final', () => {
    return cy.request({
        method: 'POST',
        url: Cypress.config('baseUrl') + `/api/v1/fechamentos/finais`,
        headers: {
          'Accept': 'text/plain',
          'Authorization': 'Bearer token_invalido'
        },
        failOnStatusCode: false,
    })
})

Cypress.Commands.add('buscar_fechamento_final_bimestre_aberto', () => {
    return cy.gerar_token().then(token => {
        return cy.request({
            method: 'GET',
            url: Cypress.config('baseUrl') + `/api/v1/fechamentos/finais?DisciplinaCodigo=${Cypress.env('DISCIPLINA_CODIGO')}&TurmaCodigo=${Cypress.env('TURMA_CODIGO')}&Semestre=${Cypress.env('SEMESTRE_CODIGO')}`,
            headers: {
                'Accept': 'text/plain',
                'Authorization': `Bearer ${token}`
            },
            failOnStatusCode: false,               
        })
    })
})

Cypress.Commands.add('nao_autorizado_buscar_fechamento_final', () => {
    return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/fechamentos/finais?DisciplinaCodigo=${Cypress.env('DISCIPLINA_CODIGO')}&TurmaCodigo=${Cypress.env('TURMA_CODIGO')}&Semestre=${Cypress.env('SEMESTRE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',
          'Authorization': 'Bearer token_invalido'
        },
        failOnStatusCode: false,
    })
})

Cypress.Commands.add('buscar_fechamento_final_turma_invalida', () => {
    return cy.gerar_token().then(token => {
        return cy.request({
            method: 'GET',
            url: Cypress.config('baseUrl') + `/api/v1/fechamentos/finais?DisciplinaCodigo=${Cypress.env('DISCIPLINA_CODIGO')}&TurmaCodigo=${Cypress.env('TURMA_CODIGO_INVALIDO')}&Semestre=${Cypress.env('SEMESTRE_CODIGO')}`,
            headers: {
                'Accept': 'text/plain',
                'Authorization': `Bearer ${token}`
            },
            failOnStatusCode: false,               
        })
    })
})

Cypress.Commands.add('buscar_dashboard_fechamentos_conselhos_classes_notas_finais', () => {
    return cy.gerar_token().then(token => {
        return cy.request({
            method: 'GET',
            url: Cypress.config('baseUrl') + `/api/v1/dashboard/fechamentos/conselhos-classes/notas-finais?AnoLetivo=${Cypress.env('ANO_LETIVO')}&DreId=${Cypress.env('DRE_CODIGO')}&UeId=${Cypress.env('UE_CODIGO')}`,
            headers: {
              'Accept': 'text/plain',
              'Authorization': `Bearer ${token}`
            },
            failOnStatusCode: false,              
        })
    })
})

Cypress.Commands.add('nao_autorizado_dashboard_fechamentos_conselhos_classes_notas_finais', () => {
    return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/fechamentos/conselhos-classes/notas-finais?AnoLetivo=${Cypress.env('ANO_LETIVO')}&DreId=${Cypress.env('DRE_CODIGO')}&UeId=${Cypress.env('UE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',
          'Authorization': 'Bearer token_invalido'
        },
        failOnStatusCode: false,
    })
})

Cypress.Commands.add('buscar_dashboard_fechamentos_conselhos_classes_pareceres_conclusivos', () => {
    return cy.gerar_token().then(token => {
        return cy.request({
            method: 'GET',
            url: Cypress.config('baseUrl') + `/api/v1/dashboard/fechamentos/conselhos-classes/pareceres-conclusivos?AnoLetivo=${Cypress.env('ANO_LETIVO')}&DreId=${Cypress.env('DRE_CODIGO')}&UeId=${Cypress.env('UE_CODIGO')}`,
            headers: {
              'Accept': 'text/plain',
              'Authorization': `Bearer ${token}`
            },
             failOnStatusCode: false,             
        })
    })
})

Cypress.Commands.add('nao_autorizado_dashboard_fechamentos_conselhos_classes_pareceres_conclusivos', () => {
    return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/fechamentos/conselhos-classes/pareceres-conclusivos?AnoLetivo=${Cypress.env('ANO_LETIVO')}&DreId=${Cypress.env('DRE_CODIGO')}&UeId=${Cypress.env('UE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',
          'Authorization': 'Bearer token_invalido'
        },
        failOnStatusCode: false,
    })
})

Cypress.Commands.add('buscar_dashboard_fechamentos_conselhos_classes_situacoes', () => {
    return cy.gerar_token().then(token => {
        return cy.request({
            method: 'GET',
            url: Cypress.config('baseUrl') + `/api/v1/dashboard/fechamentos/conselhos-classes/situacoes?AnoLetivo=${Cypress.env('ANO_LETIVO')}&DreId=${Cypress.env('DRE_CODIGO')}&UeId=${Cypress.env('UE_CODIGO')}`,
            headers: {
              'Accept': 'text/plain',
              'Authorization': `Bearer ${token}`
            },
            failOnStatusCode: false,            
        })
    })
})

Cypress.Commands.add('nao_autorizado_dashboard_fechamentos_conselhos_classes_situacoes', () => {
    return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/fechamentos/conselhos-classes/situacoes?AnoLetivo=${Cypress.env('ANO_LETIVO')}&DreId=${Cypress.env('DRE_CODIGO')}&UeId=${Cypress.env('UE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',
          'Authorization': 'Bearer token_invalido'
        },
        failOnStatusCode: false,
    })
})

Cypress.Commands.add('buscar_dashboard_fechamentos_estudantes', () => {
    return cy.gerar_token().then(token => {
        return cy.request({
            method: 'GET',
            url:Cypress.config('baseUrl') + `/api/v1/dashboard/fechamentos/estudantes?AnoLetivo=${Cypress.env('ANO_LETIVO')}&DreId=${Cypress.env('DRE_CODIGO')}&UeId=${Cypress.env('UE_CODIGO')}`,
            headers: {
              'Accept': 'text/plain',
              'Authorization': `Bearer ${token}`
            },
            failOnStatusCode: false,            
        })
    })
})

Cypress.Commands.add('nao_autorizado_dashboard_fechamentos_estudantes', () => {
    return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/fechamentos/estudantes?AnoLetivo=${Cypress.env('ANO_LETIVO')}&DreId=${Cypress.env('DRE_CODIGO')}&UeId=${Cypress.env('UE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',
          'Authorization': 'Bearer token_invalido'
        },
        failOnStatusCode: false,
    })
})

Cypress.Commands.add('buscar_dashboard_fechamentos_pendencias', () => {
    return cy.gerar_token().then(token => {
        return cy.request({
            method: 'GET',
            url: Cypress.config('baseUrl') + `/api/v1/dashboard/fechamentos/pendencias?AnoLetivo=${Cypress.env('ANO_LETIVO')}&DreId=${Cypress.env('DRE_CODIGO')}&UeId=${Cypress.env('UE_CODIGO')}`,
            headers: {
              'Accept': 'text/plain',
              'Authorization': `Bearer ${token}`
            },
            failOnStatusCode: false,            
        })
    })
})

Cypress.Commands.add('nao_autorizado_dashboard_fechamentos_pendencias', () => {
    return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/fechamentos/pendencias?AnoLetivo=${Cypress.env('ANO_LETIVO')}&DreId=${Cypress.env('DRE_CODIGO')}&UeId=${Cypress.env('UE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',
          'Authorization': 'Bearer token_invalido'
        },
        failOnStatusCode: false,
    })
})

