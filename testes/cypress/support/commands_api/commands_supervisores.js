Cypress.Commands.add('atribuir_supervisor_ue', () => {
    return cy.gerar_token().then((token) => {        
        return cy.request({
          method: 'POST',
          url: Cypress.config('baseUrl') + `/api/v1/supervisores/atribuir-ue`,
          headers: {
            'Accept': 'text/plain',
            'Authorization': `Bearer ${token}`,            
          },
          body: {          
           "dreId": `${Cypress.env('DRE_CODIGO')}`,
           "responsavelId": `${Cypress.env('LOGIN_SUPERVISOR')}`,
           "uesIds": [
           `${Cypress.env('UE_CODIGO')}`
        ],
          "tipoResponsavelAtribuicao": 1
        },
          failOnStatusCode: false,
      })
    })
})

Cypress.Commands.add('atribuir_supervisor_ue_sem_dre', () => {
    return cy.gerar_token().then((token) => {        
        return cy.request({
          method: 'POST',
          url: Cypress.config('baseUrl') + `/api/v1/supervisores/atribuir-ue`,
          headers: {
            'Accept': 'text/plain',
            'Authorization': `Bearer ${token}`,            
          },
          body: {          
           "dreId": " ",
           "responsavelId": `${Cypress.env('LOGIN_SUPERVISOR')}`,
           "uesIds": [
           `${Cypress.env('UE_CODIGO')}`
        ],
          "tipoResponsavelAtribuicao": 1
        },
          failOnStatusCode: false,
      })
    })
})

Cypress.Commands.add('atribuir_supervisor_ue_sem_responsavel', () => {
    return cy.gerar_token().then((token) => {        
        return cy.request({
          method: 'POST',
          url: Cypress.config('baseUrl') + `/api/v1/supervisores/atribuir-ue`,
          headers: {
            'Accept': 'text/plain',
            'Authorization': `Bearer ${token}`,            
          },
          body: {          
           "dreId": `${Cypress.env('DRE_CODIGO')}`,
           "responsavelId": " ",
           "uesIds": [
           `${Cypress.env('UE_CODIGO')}`
        ],
          "tipoResponsavelAtribuicao": 1
        },
          failOnStatusCode: false,
      })
    })
})

Cypress.Commands.add('atribuir_supervisor_ue_sem_tipo', () => {
    return cy.gerar_token().then((token) => {        
        return cy.request({
          method: 'POST',
          url: Cypress.config('baseUrl') + `/api/v1/supervisores/atribuir-ue`,
          headers: {
            'Accept': 'text/plain',
            'Authorization': `Bearer ${token}`,            
          },
          body: {          
           "dreId": `${Cypress.env('DRE_CODIGO')}`,
           "responsavelId": `${Cypress.env('LOGIN_SUPERVISOR')}`,
           "uesIds": [
           `${Cypress.env('UE_CODIGO')}`
        ],
          "tipoResponsavelAtribuicao": " "
        },
          failOnStatusCode: false,
      })
    })
})
 
Cypress.Commands.add('atribuir_supervisor_sem_ue', () => {
    return cy.gerar_token().then((token) => {        
        return cy.request({
          method: 'POST',
          url: Cypress.config('baseUrl') + `/api/v1/supervisores/atribuir-ue`,
          headers: {
            'Accept': 'text/plain',
            'Authorization': `Bearer ${token}`,            
          },
          body: {          
           "dreId": `${Cypress.env('DRE_CODIGO')}`,
           "responsavelId": `${Cypress.env('LOGIN_SUPERVISOR')}`,
           "uesIds": [
           " "
        ],
          "tipoResponsavelAtribuicao": 1
        },
          failOnStatusCode: false,
      })
    })
})

Cypress.Commands.add('nao_autorizado_atribuir_supervisor_ue', () => {
    return cy.request({
        method: 'POST',
        url: Cypress.config('baseUrl') + `/api/v1/supervisores/atribuir-ue`,
        headers: {
             'Accept': 'text/plain',
             'Authorization': 'Bearer token_invalido' 
            },
        failOnStatusCode: false
    })
})

Cypress.Commands.add('buscar_supervisor_dre', () => {
    return cy.gerar_token().then((token) => {        
        return cy.request({
          method: 'GET',
          url: Cypress.config('baseUrl') + `/api/v1/supervisores/dre/${Cypress.env('DRE_CODIGO')}`,
          headers: {
            'Accept': 'text/plain',
            'Authorization': `Bearer ${token}`,            
          },
          failOnStatusCode: false,
      })
    })
})

Cypress.Commands.add('nao_autorizado_buscar_supervisor_dre', () => {
    return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/supervisores/dre/${Cypress.env('DRE_CODIGO')}`,
        headers: {
             'Accept': 'text/plain',
             'Authorization': 'Bearer token_invalido' 
        },
    failOnStatusCode: false
  })
})

Cypress.Commands.add('buscar_supervisor_dre_tipo_1', () => {
    return cy.gerar_token().then((token) => {        
        return cy.request({
          method: 'GET',
          url: Cypress.config('baseUrl') + `/api/v1/supervisores/dre/${Cypress.env('DRE_CODIGO')}?TipoResponsavelAtribuicao=1`,
          headers: {
            'Accept': 'text/plain',
            'Authorization': `Bearer ${token}`,            
          },
      failOnStatusCode: false,
    })
  })
})

Cypress.Commands.add('buscar_supervisor_dre_tipo_2', () => {
    return cy.gerar_token().then((token) => {        
        return cy.request({
          method: 'GET',
          url: Cypress.config('baseUrl') + `/api/v1/supervisores/dre/${Cypress.env('DRE_CODIGO')}?TipoResponsavelAtribuicao=2`,
          headers: {
            'Accept': 'text/plain',
            'Authorization': `Bearer ${token}`,            
          },
      failOnStatusCode: false,
    })
  })
})

Cypress.Commands.add('buscar_supervisor_dre_tipo_3', () => {
    return cy.gerar_token().then((token) => {        
        return cy.request({
          method: 'GET',
          url: Cypress.config('baseUrl') + `/api/v1/supervisores/dre/${Cypress.env('DRE_CODIGO')}?TipoResponsavelAtribuicao=3`,
          headers: {
            'Accept': 'text/plain',
            'Authorization': `Bearer ${token}`,            
          },
      failOnStatusCode: false,
    })
  })
})

Cypress.Commands.add('buscar_supervisor_dre_tipo_4', () => {
    return cy.gerar_token().then((token) => {        
        return cy.request({
          method: 'GET',
          url: Cypress.config('baseUrl') + `/api/v1/supervisores/dre/${Cypress.env('DRE_CODIGO')}?TipoResponsavelAtribuicao=4`,
          headers: {
            'Accept': 'text/plain',
            'Authorization': `Bearer ${token}`,            
          },
      failOnStatusCode: false,
    })
  })
})

Cypress.Commands.add('buscar_supervisor_dre_tipo_5', () => {
    return cy.gerar_token().then((token) => {        
        return cy.request({
          method: 'GET',
          url: Cypress.config('baseUrl') + `/api/v1/supervisores/dre/${Cypress.env('DRE_CODIGO')}?TipoResponsavelAtribuicao=5`,
          headers: {
            'Accept': 'text/plain',
            'Authorization': `Bearer ${token}`,            
          },
      failOnStatusCode: false,
    })
  })
})

Cypress.Commands.add('buscar_supervisor_dre_vinculo_escolas', () => {
    return cy.gerar_token().then((token) => {        
        return cy.request({
          method: 'GET',
          url: Cypress.config('baseUrl') + `/api/v1/supervisores/dre/${Cypress.env('DRE_CODIGO')}/vinculo-escolas`,
          headers: {
            'Accept': 'text/plain',
            'Authorization': `Bearer ${token}`,            
          },
          failOnStatusCode: false,
      })
    })
})

Cypress.Commands.add('nao_autorizado_supervisor_dre_vinculo_escolas', () => {
    return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/supervisores/dre/${Cypress.env('DRE_CODIGO')}/vinculo-escolas`,
        headers: {
             'Accept': 'text/plain',
             'Authorization': 'Bearer token_invalido' 
        },
    failOnStatusCode: false
  })
})

Cypress.Commands.add('buscar_supervisor_id_dre_id_tipo_1', () => {
    return cy.gerar_token().then((token) => {        
        return cy.request({
          method: 'GET',
          url: Cypress.config('baseUrl') + `/api/v1/supervisores/${Cypress.env('LOGIN_SUPERVISOR')}/dre/${Cypress.env('DRE_CODIGO')}/1`,
          headers: {
            'Accept': 'text/plain',
            'Authorization': `Bearer ${token}`,            
          },
          failOnStatusCode: false,
      })
    })
})

Cypress.Commands.add('buscar_supervisor_id_dre_id_tipo_2', () => {
    return cy.gerar_token().then((token) => {        
        return cy.request({
          method: 'GET',
          url: Cypress.config('baseUrl') + `/api/v1/supervisores/${Cypress.env('LOGIN_SUPERVISOR')}/dre/${Cypress.env('DRE_CODIGO')}/2`,
          headers: {
            'Accept': 'text/plain',
            'Authorization': `Bearer ${token}`,            
          },
          failOnStatusCode: false,
      })
    })
})

Cypress.Commands.add('buscar_supervisor_id_dre_id_tipo_3', () => {
    return cy.gerar_token().then((token) => {        
        return cy.request({
          method: 'GET',
          url: Cypress.config('baseUrl') + `/api/v1/supervisores/${Cypress.env('LOGIN_SUPERVISOR')}/dre/${Cypress.env('DRE_CODIGO')}/3`,
          headers: {
            'Accept': 'text/plain',
            'Authorization': `Bearer ${token}`,            
          },
          failOnStatusCode: false,
      })
    })
})

Cypress.Commands.add('buscar_supervisor_id_dre_id_tipo_4', () => {
    return cy.gerar_token().then((token) => {        
        return cy.request({
          method: 'GET',
          url: Cypress.config('baseUrl') + `/api/v1/supervisores/${Cypress.env('LOGIN_SUPERVISOR')}/dre/${Cypress.env('DRE_CODIGO')}/4`,
          headers: {
            'Accept': 'text/plain',
            'Authorization': `Bearer ${token}`,            
          },
          failOnStatusCode: false,
      })
    })
})

Cypress.Commands.add('buscar_supervisor_id_dre_id_tipo_5', () => {
    return cy.gerar_token().then((token) => {        
        return cy.request({
          method: 'GET',
          url: Cypress.config('baseUrl') + `/api/v1/supervisores/${Cypress.env('LOGIN_SUPERVISOR')}/dre/${Cypress.env('DRE_CODIGO')}/5`,
          headers: {
            'Accept': 'text/plain',
            'Authorization': `Bearer ${token}`,            
          },
          failOnStatusCode: false,
      })
    })
})

Cypress.Commands.add('buscar_supervisor_id_dre_id_sem_tipo', () => {
    return cy.gerar_token().then((token) => {        
        return cy.request({
          method: 'GET',
          url: Cypress.config('baseUrl') + `/api/v1/supervisores/${Cypress.env('LOGIN_SUPERVISOR')}/dre/${Cypress.env('DRE_CODIGO')}/`,
          headers: {
            'Accept': 'text/plain',
            'Authorization': `Bearer ${token}`,            
          },
          failOnStatusCode: false,
      })
    })
})

Cypress.Commands.add('buscar_supervisor_id_dre_id_sem_dre', () => {
    return cy.gerar_token().then((token) => {        
        return cy.request({
          method: 'GET',
          url: Cypress.config('baseUrl') + `/api/v1/supervisores/${Cypress.env('LOGIN_SUPERVISOR')}/dre//1`,
          headers: {
            'Accept': 'text/plain',
            'Authorization': `Bearer ${token}`,            
          },
          failOnStatusCode: false,
      })
    })
})

Cypress.Commands.add('buscar_supervisor_id_dre_id_sem_responsavel', () => {
    return cy.gerar_token().then((token) => {        
        return cy.request({
          method: 'GET',
          url: Cypress.config('baseUrl') + `/api/v1/supervisores//dre/${Cypress.env('DRE_CODIGO')}/1`,
          headers: {
            'Accept': 'text/plain',
            'Authorization': `Bearer ${token}`,            
          },
          failOnStatusCode: false,
      })
    })
})

Cypress.Commands.add('nao_autorizado_supervisor_id_dre_id_tipo', () => {
    return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/supervisores/${Cypress.env('LOGIN_SUPERVISOR')}/dre/${Cypress.env('DRE_CODIGO')}/1`,
        headers: {
             'Accept': 'text/plain',
             'Authorization': 'Bearer token_invalido' 
        },
    failOnStatusCode: false
  })
})

Cypress.Commands.add('buscar_supervisor_dre', () => {
    return cy.gerar_token().then((token) => {        
        return cy.request({
          method: 'GET',
          url: Cypress.config('baseUrl') + `/api/v1/supervisores/dre/${Cypress.env('DRE_CODIGO')}`,
          headers: {
            'Accept': 'text/plain',
            'Authorization': `Bearer ${token}`,            
          },
          failOnStatusCode: false,
      })
    })
})

Cypress.Commands.add('nao_autorizado_buscar_supervisor_dre', () => {
    return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/supervisores/dre/${Cypress.env('DRE_CODIGO')}`,
        headers: {
             'Accept': 'text/plain',
             'Authorization': 'Bearer token_invalido' 
        },
    failOnStatusCode: false
  })
})

Cypress.Commands.add('buscar_supervisor_ue_dre', () => {
    return cy.gerar_token().then((token) => {        
        return cy.request({
          method: 'GET',
          url: Cypress.config('baseUrl') + `/api/v1/supervisores/lista-ues/${Cypress.env('DRE_CODIGO')}`,
          headers: {
            'Accept': 'text/plain',
            'Authorization': `Bearer ${token}`,            
          },
          failOnStatusCode: false,
      })
    })
})

Cypress.Commands.add('nao_autorizado_buscar_supervisor_ue_dre', () => {
    return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/supervisores/lista-ues/${Cypress.env('DRE_CODIGO')}`,
        headers: {
             'Accept': 'text/plain',
             'Authorization': 'Bearer token_invalido' 
        },
    failOnStatusCode: false
  })
})

Cypress.Commands.add('buscar_supervisor_ue_sem_dre', () => {
    return cy.gerar_token().then((token) => {        
        return cy.request({
          method: 'GET',
          url: Cypress.config('baseUrl') + `/api/v1/supervisores/lista-ues/`,
          headers: {
            'Accept': 'text/plain',
            'Authorization': `Bearer ${token}`,            
          },
          failOnStatusCode: false,
      })
    })
})

Cypress.Commands.add('buscar_supervisor_tipo_responsavel', () => {
    return cy.gerar_token().then((token) => {        
        return cy.request({
          method: 'GET',
          url: Cypress.config('baseUrl') + `/api/v1/supervisores/tipo-responsavel`,
          headers: {
            'Accept': 'text/plain',
            'Authorization': `Bearer ${token}`,            
          },
          failOnStatusCode: false,
      })
    })
})

Cypress.Commands.add('nao_autorizado_supervisor_tipo_responsavel', () => {
    return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/supervisores/tipo-responsavel`,
        headers: {
             'Accept': 'text/plain',
             'Authorization': 'Bearer token_invalido' 
        },
    failOnStatusCode: false
  })
})
