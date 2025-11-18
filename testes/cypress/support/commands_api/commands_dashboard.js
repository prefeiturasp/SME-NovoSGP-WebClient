Cypress.Commands.add('buscar_dashboard_acompanhamento_aluno', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/acompanhamento-aprendizagem/acompanhamento-aluno?AnoLetivo=${Cypress.env('ANO_LETIVO')}&DreId=${Cypress.env('DRE_CODIGO')}&UeId=${Cypress.env('UE_CODIGO')}&Semestre=${Cypress.env('SEMESTRE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('nao_autorizado_dashboard_acompanhamento_aluno', () => {
return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/acompanhamento-aprendizagem/acompanhamento-aluno?AnoLetivo=${Cypress.env('ANO_LETIVO')}&DreId=${Cypress.env('DRE_CODIGO')}&UeId=${Cypress.env('UE_CODIGO')}&Semestre=${Cypress.env('SEMESTRE_CODIGO')}`,
    headers: {
         'Accept': 'text/plain',
         'Authorization': 'Bearer token_invalido' },
    failOnStatusCode: false
  })
})

Cypress.Commands.add('dashboard_acompanhamento_aluno_ano_vazio', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/acompanhamento-aprendizagem/acompanhamento-aluno?AnoLetivo=&DreId=${Cypress.env('DRE_CODIGO')}&UeId=${Cypress.env('UE_CODIGO')}&Semestre=${Cypress.env('SEMESTRE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('dashboard_acompanhamento_aluno_semestre_vazio', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/acompanhamento-aprendizagem/acompanhamento-aluno?AnoLetivo=${Cypress.env('ANO_LETIVO')}&DreId=${Cypress.env('DRE_CODIGO')}&UeId=123&Semestre=`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('buscar_dashboard_acompanhamento_ultima_consolidacacao', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/acompanhamento-aprendizagem/ultima-consolidacao?anoLetivo=${Cypress.env('ANO_LETIVO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('nao_autorizado_dashboard_acompanhamento_ultima_consolidacacao', () => {
return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/acompanhamento-aprendizagem/ultima-consolidacao?anoLetivo=${Cypress.env('ANO_LETIVO')}`,
    headers: {
         'Accept': 'text/plain',
         'Authorization': 'Bearer token_invalido' },
    failOnStatusCode: false
  })
})

Cypress.Commands.add('dashboard_acompanhamento_ultima_consolidacacao_ano_vazio', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/acompanhamento-aprendizagem/ultima-consolidacao?anoLetivo=`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('dashboard_acompanhamento_ultima_consolidacacao_ano_invalido', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/acompanhamento-aprendizagem/ultima-consolidacao?anoLetivo=${Cypress.env('ANO_LETIVO_INVALIDO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('buscar_dashboard_aee_encaminhamentos_situacoes', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/encaminhamentos/situacoes?anoLetivo=${Cypress.env('ANO_LETIVO')}&dreId=${Cypress.env('DRE_CODIGO')}&ueId=${Cypress.env('UE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('nao_autorizado_dashboard_aee_encaminhamentos_situacoes', () => {
return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/encaminhamentos/situacoes?anoLetivo=${Cypress.env('ANO_LETIVO')}&dreId=${Cypress.env('DRE_CODIGO')}&ueId=${Cypress.env('UE_CODIGO')}`,
    headers: {
         'Accept': 'text/plain',
         'Authorization': 'Bearer token_invalido' },
    failOnStatusCode: false
  })
})

Cypress.Commands.add('dashboard_aee_encaminhamentos_situacoes_ano_vazio', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/encaminhamentos/situacoes?anoLetivo=&dreId=${Cypress.env('DRE_CODIGO')}&ueId=${Cypress.env('UE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('dashboard_aee_encaminhamentos_situacoes_dre_vazio', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/encaminhamentos/situacoes?anoLetivo=${Cypress.env('ANO_LETIVO')}&dreId=&ueId=${Cypress.env('UE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('dashboard_aee_encaminhamentos_situacoes_ue_vazio', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/encaminhamentos/situacoes?anoLetivo=${Cypress.env('ANO_LETIVO')}&dreId=${Cypress.env('DRE_CODIGO')}&ueId=`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('buscar_dashboard_aee_encaminhamentos_deferidos', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/encaminhamentos/deferidos?anoLetivo=${Cypress.env('ANO_LETIVO')}&dreId=${Cypress.env('DRE_CODIGO')}&ueId=${Cypress.env('UE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('nao_autorizado_dashboard_aee_encaminhamentos_deferidos', () => {
return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/encaminhamentos/deferidos?anoLetivo=${Cypress.env('ANO_LETIVO')}&dreId=${Cypress.env('DRE_CODIGO')}&ueId=${Cypress.env('UE_CODIGO')}`,
    headers: {
         'Accept': 'text/plain',
         'Authorization': 'Bearer token_invalido' },
    failOnStatusCode: false
  })
})

Cypress.Commands.add('dashboard_aee_encaminhamentos_deferidos_ano_vazio', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/encaminhamentos/deferidos?anoLetivo=&dreId=${Cypress.env('DRE_CODIGO')}&ueId=${Cypress.env('UE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('dashboard_aee_encaminhamentos_deferidos_dre_vazio', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/encaminhamentos/deferidos?anoLetivo=${Cypress.env('ANO_LETIVO')}&dreId=&ueId=${Cypress.env('UE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('dashboard_aee_encaminhamentos_deferidos_ue_vazio', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/encaminhamentos/deferidos?anoLetivo=${Cypress.env('ANO_LETIVO')}&dreId=${Cypress.env('DRE_CODIGO')}&ueId=`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('buscar_dashboard_aee_planos_situacoes', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/planos/situacoes?anoLetivo=${Cypress.env('ANO_LETIVO')}&dreId=${Cypress.env('DRE_CODIGO')}&ueId=${Cypress.env('UE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('nao_autorizado_dashboard_aee_planos_situacoes', () => {
return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/planos/situacoes?anoLetivo=${Cypress.env('ANO_LETIVO')}&dreId=${Cypress.env('DRE_CODIGO')}&ueId=${Cypress.env('UE_CODIGO')}`,
    headers: {
         'Accept': 'text/plain',
         'Authorization': 'Bearer token_invalido' },
    failOnStatusCode: false
  })
})

Cypress.Commands.add('dashboard_aee_planos_situacoes_ano_vazio', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/planos/situacoes?anoLetivo=&dreId=${Cypress.env('DRE_CODIGO')}&ueId=${Cypress.env('UE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('dashboard_aee_planos_situacoes_dre_vazio', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/planos/situacoes?anoLetivo=${Cypress.env('ANO_LETIVO')}&dreId=&ueId=${Cypress.env('UE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('dashboard_aee_planos_situacoes_ue_vazio', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/planos/situacoes?anoLetivo=${Cypress.env('ANO_LETIVO')}&dreId=${Cypress.env('DRE_CODIGO')}&ueId=`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('buscar_dashboard_aee_planos_vigentes', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/planos/vigentes?anoLetivo=${Cypress.env('ANO_LETIVO')}&dreId=${Cypress.env('DRE_CODIGO')}&ueId=${Cypress.env('UE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('nao_autorizado_dashboard_aee_planos_vigentes', () => {
return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/planos/vigentes?anoLetivo=${Cypress.env('ANO_LETIVO')}&dreId=${Cypress.env('DRE_CODIGO')}&ueId=${Cypress.env('UE_CODIGO')}`,
    headers: {
         'Accept': 'text/plain',
         'Authorization': 'Bearer token_invalido' },
    failOnStatusCode: false
  })
})

Cypress.Commands.add('dashboard_aee_planos_vigentes_ano_vazio', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/planos/vigentes?anoLetivo=&dreId=${Cypress.env('DRE_CODIGO')}&ueId=${Cypress.env('UE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('dashboard_aee_planos_vigentes_dre_vazio', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/planos/vigentes?anoLetivo=${Cypress.env('ANO_LETIVO')}&dreId=&ueId=${Cypress.env('UE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('dashboard_aee_planos_vigentes_ue_vazio', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/planos/vigentes?anoLetivo=${Cypress.env('ANO_LETIVO')}&dreId=${Cypress.env('DRE_CODIGO')}&ueId=`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('buscar_dashboard_aee_planos_acessibilidades', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/planos/acessibilidades?anoLetivo=${Cypress.env('ANO_LETIVO')}&dreId=${Cypress.env('DRE_CODIGO')}&ueId=${Cypress.env('UE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('nao_autorizado_dashboard_aee_planos_vigentes', () => {
return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/planos/acessibilidades?anoLetivo=${Cypress.env('ANO_LETIVO')}&dreId=${Cypress.env('DRE_CODIGO')}&ueId=${Cypress.env('UE_CODIGO')}`,
    headers: {
         'Accept': 'text/plain',
         'Authorization': 'Bearer token_invalido' },
    failOnStatusCode: false
  })
})

Cypress.Commands.add('dashboard_aee_planos_vigentes_ano_vazio', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/planos/acessibilidades?anoLetivo=&dreId=${Cypress.env('DRE_CODIGO')}&ueId=${Cypress.env('UE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('dashboard_aee_planos_vigentes_dre_vazio', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/planos/acessibilidades?anoLetivo=${Cypress.env('ANO_LETIVO')}&dreId=&ueId=${Cypress.env('UE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('dashboard_aee_planos_vigentes_ue_vazio', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/planos/acessibilidades?anoLetivo=${Cypress.env('ANO_LETIVO')}&dreId=${Cypress.env('DRE_CODIGO')}&ueId=`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('buscar_dashboard_aee_encaminhamentos_matriculados_srm_paee', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/encaminhamentos/matriculados-srm-paee?anoLetivo=${Cypress.env('ANO_LETIVO')}&dreCodigo=${Cypress.env('DRE_CODIGO')}&ueCodigo=${Cypress.env('UE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },    
        timeout: 60000,      
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('nao_autorizado_dashboard_aee_encaminhamentos_matriculados_srm_paee', () => {
return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/encaminhamentos/matriculados-srm-paee?anoLetivo=${Cypress.env('ANO_LETIVO')}&dreCodigo=${Cypress.env('DRE_CODIGO')}&ueCodigo=${Cypress.env('UE_CODIGO')}`,
    headers: {
         'Accept': 'text/plain',
         'Authorization': 'Bearer token_invalido' },
    failOnStatusCode: false
  })
})

Cypress.Commands.add('dashboard_aee_encaminhamentos_matriculados_srm_paee_ano_vazio', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/encaminhamentos/matriculados-srm-paee?anoLetivo=&dreCodigo=${Cypress.env('DRE_CODIGO')}&ueCodigo=${Cypress.env('UE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('buscar_dashboard_compesacoes_ausencia_anos_turmas', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/compensacoes/ausencia/anos/${Cypress.env('ANO_LETIVO')}/dres/${Cypress.env('DRE_CODIGO')}
/ues/${Cypress.env('UE_CODIGO')}/modalidades/${Cypress.env('MODALIDADE_CODIGO')}/consolidado/anos-turmas?bimestre=${Cypress.env('BIMESTRE_CODIGO')}&semestre=${Cypress.env('SEMESTRE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('nao_autorizado_dashboard_compesacoes_ausencia_anos_turmas', () => {
return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/compensacoes/ausencia/anos/${Cypress.env('ANO_LETIVO')}/dres/${Cypress.env('DRE_CODIGO')}
/ues/${Cypress.env('UE_CODIGO')}/modalidades/${Cypress.env('MODALIDADE_CODIGO')}/consolidado/anos-turmas?bimestre=${Cypress.env('BIMESTRE_CODIGO')}&semestre=${Cypress.env('SEMESTRE_CODIGO')}`,
    headers: {
         'Accept': 'text/plain',
         'Authorization': 'Bearer token_invalido' },
    failOnStatusCode: false
  })
})

Cypress.Commands.add('dashboard_compesacoes_ausencia_anos_turmas_ano_vazio', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/compensacoes/ausencia/anos//dres/${Cypress.env('DRE_CODIGO')}
/ues/${Cypress.env('UE_CODIGO')}/modalidades/${Cypress.env('MODALIDADE_CODIGO')}/consolidado/anos-turmas?bimestre=${Cypress.env('BIMESTRE_CODIGO')}&semestre=${Cypress.env('SEMESTRE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('dashboard_compesacoes_ausencia_anos_turmas_dre_vazio', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/compensacoes/ausencia/anos/${Cypress.env('ANO_LETIVO')}/dres//ues/${Cypress.env('UE_CODIGO')}/modalidades/${Cypress.env('MODALIDADE_CODIGO')}/consolidado/anos-turmas?bimestre=${Cypress.env('BIMESTRE_CODIGO')}&semestre=${Cypress.env('SEMESTRE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('dashboard_compesacoes_ausencia_anos_turmas_ue_vazio', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/compensacoes/ausencia/anos/${Cypress.env('ANO_LETIVO')}/dres/${Cypress.env('DRE_CODIGO')}
/ues//modalidades/${Cypress.env('MODALIDADE_CODIGO')}/consolidado/anos-turmas?bimestre=${Cypress.env('BIMESTRE_CODIGO')}&semestre=${Cypress.env('SEMESTRE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('dashboard_compesacoes_ausencia_anos_turmas_modalidade_vazio', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/compensacoes/ausencia/anos/${Cypress.env('ANO_LETIVO')}/dres/${Cypress.env('DRE_CODIGO')}
/ues/${Cypress.env('UE_CODIGO')}/modalidades//consolidado/anos-turmas?bimestre=${Cypress.env('BIMESTRE_CODIGO')}&semestre=${Cypress.env('SEMESTRE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})


Cypress.Commands.add('buscar_dashboard_compesacoes_ausencia_consideradas', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/compensacoes/ausencia/anos/${Cypress.env('ANO_LETIVO')}/dres/${Cypress.env('DRE_CODIGO')}/ues/${Cypress.env('UE_CODIGO')}/modalidades/${Cypress.env('MODALIDADE_CODIGO')}/consolidado/compensacoes-consideradas?bimestre=${Cypress.env('BIMESTRE_CODIGO')}&semestre=${Cypress.env('SEMESTRE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('nao_autorizado_dashboard_compesacoes_ausencia_consideradas', () => {
return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/compensacoes/ausencia/anos/${Cypress.env('ANO_LETIVO')}/dres/${Cypress.env('DRE_CODIGO')}/ues/${Cypress.env('UE_CODIGO')}/modalidades/${Cypress.env('MODALIDADE_CODIGO')}/consolidado/compensacoes-consideradas?bimestre=${Cypress.env('BIMESTRE_CODIGO')}&semestre=${Cypress.env('SEMESTRE_CODIGO')}`,
    headers: {
         'Accept': 'text/plain',
         'Authorization': 'Bearer token_invalido' },
    failOnStatusCode: false
  })
})

Cypress.Commands.add('dashboard_compesacoes_ausencia_consideradas_ano_vazio', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/compensacoes/ausencia/anos//dres/${Cypress.env('DRE_CODIGO')}/ues/${Cypress.env('UE_CODIGO')}/modalidades/${Cypress.env('MODALIDADE_CODIGO')}/consolidado/compensacoes-consideradas?bimestre=${Cypress.env('BIMESTRE_CODIGO')}&semestre=${Cypress.env('SEMESTRE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('dashboard_compesacoes_ausencia_anos_turmas_dre_vazio', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/compensacoes/ausencia/anos/${Cypress.env('ANO_LETIVO')}/dres//ues/${Cypress.env('UE_CODIGO')}/modalidades/${Cypress.env('MODALIDADE_CODIGO')}/consolidado/compensacoes-consideradas?bimestre=${Cypress.env('BIMESTRE_CODIGO')}&semestre=${Cypress.env('SEMESTRE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('dashboard_compesacoes_ausencia_anos_turmas_ue_vazio', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/compensacoes/ausencia/anos/${Cypress.env('ANO_LETIVO')}/dres/${Cypress.env('DRE_CODIGO')}/ues//modalidades/${Cypress.env('MODALIDADE_CODIGO')}/consolidado/compensacoes-consideradas?bimestre=${Cypress.env('BIMESTRE_CODIGO')}&semestre=${Cypress.env('SEMESTRE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('dashboard_compesacoes_ausencia_anos_turmas_modalidade_vazio', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/compensacoes/ausencia/anos/${Cypress.env('ANO_LETIVO')}/dres/${Cypress.env('DRE_CODIGO')}/ues/${Cypress.env('UE_CODIGO')}/modalidades//consolidado/compensacoes-consideradas?bimestre=${Cypress.env('BIMESTRE_CODIGO')}&semestre=${Cypress.env('SEMESTRE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('buscar_dashboard_devolutivas_consolidacao_turma_ano', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/devolutivas/consolidacao/turma-ano?AnoLetivo=${Cypress.env('ANO_LETIVO')}&Modalidade=${Cypress.env('MODALIDADE_CODIGO')}&DreId=${Cypress.env('DRE_CODIGO')}&UeId=${Cypress.env('UE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('nao_autorizado_dashboard_devolutivas_consolidacao_turma_ano', () => {
return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/devolutivas/consolidacao/turma-ano?AnoLetivo=${Cypress.env('ANO_LETIVO')}&Modalidade=${Cypress.env('MODALIDADE_CODIGO')}&DreId=${Cypress.env('DRE_CODIGO')}&UeId=${Cypress.env('UE_CODIGO')}`,
    headers: {
         'Accept': 'text/plain',
         'Authorization': 'Bearer token_invalido' },
    failOnStatusCode: false
  })
})

Cypress.Commands.add('dashboard_devolutivas_consolidacao_turma_ano_vazio', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/devolutivas/consolidacao/turma-ano?AnoLetivo=&Modalidade=${Cypress.env('MODALIDADE_CODIGO')}&DreId=${Cypress.env('DRE_CODIGO')}&UeId=${Cypress.env('UE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('dashboard_devolutivas_consolidacao_turma_modalidade_vazio', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/devolutivas/consolidacao/turma-ano?AnoLetivo=${Cypress.env('ANO_LETIVO')}&Modalidade=&DreId=${Cypress.env('DRE_CODIGO')}&UeId=${Cypress.env('UE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('buscar_dashboard_devolutivas_diarios_bordo_turma_ano', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/devolutivas/diarios-bordo/turma-ano?AnoLetivo=${Cypress.env('ANO_LETIVO')}&Modalidade=${Cypress.env('MODALIDADE_CODIGO')}&DreId=${Cypress.env('DRE_CODIGO')}&UeId=${Cypress.env('UE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('nao_autorizado_dashboard_devolutivas_diarios_bordo_turma_ano', () => {
return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/devolutivas/diarios-bordo/turma-ano?AnoLetivo=${Cypress.env('ANO_LETIVO')}&Modalidade=${Cypress.env('MODALIDADE_CODIGO')}&DreId=${Cypress.env('DRE_CODIGO')}&UeId=${Cypress.env('UE_CODIGO')}`,
    headers: {
         'Accept': 'text/plain',
         'Authorization': 'Bearer token_invalido' },
    failOnStatusCode: false
  })
})

Cypress.Commands.add('dashboard_devolutivas_diarios_bordo_turma_ano_vazio', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/devolutivas/diarios-bordo/turma-ano?AnoLetivo=&Modalidade=${Cypress.env('MODALIDADE_CODIGO')}&DreId=${Cypress.env('DRE_CODIGO')}&UeId=${Cypress.env('UE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('dashboard_devolutivas_diarios_bordo_turma_ano_modalidade_vazio', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/devolutivas/diarios-bordo/turma-ano?AnoLetivo=${Cypress.env('ANO_LETIVO')}&Modalidade=&DreId=${Cypress.env('DRE_CODIGO')}&UeId=${Cypress.env('UE_CODIGO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('buscar_dashboard_devolutivas_dre', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/devolutivas/devolutivas/dre?AnoLetivo=${Cypress.env('ANO_LETIVO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('nao_autorizado_dashboard_devolutivas_dre', () => {
return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/devolutivas/devolutivas/dre?AnoLetivo=${Cypress.env('ANO_LETIVO')}`,
    headers: {
         'Accept': 'text/plain',
         'Authorization': 'Bearer token_invalido' },
    failOnStatusCode: false
  })
})

Cypress.Commands.add('dashboard_devolutivas_dre_ano_vazio', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/devolutivas/devolutivas/dre?AnoLetivo=`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('buscar_dashboard_devolutivas_consolidacao', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/devolutivas/consolidacao?anoLetivo=${Cypress.env('ANO_LETIVO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('nao_autorizado_dashboard_devolutivas_consolidacao', () => {
return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/devolutivas/devolutivas/dre?AnoLetivo=${Cypress.env('ANO_LETIVO')}`,
    headers: {
         'Accept': 'text/plain',
         'Authorization': 'Bearer token_invalido' },
    failOnStatusCode: false
  })
})

Cypress.Commands.add('dashboard_devolutivas_consolidacao_ano_vazio', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/devolutivas/consolidacao?anoLetivo=`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('buscar_dashboard_devolutivas_quantidade_devolutivas_por_ano', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/devolutivas/consolidacao?anoLetivo=${Cypress.env('ANO_LETIVO')}`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})

Cypress.Commands.add('nao_autorizado_dashboard_devolutivas_quantidade_devolutivas_por_ano', () => {
return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/devolutivas/consolidacao?anoLetivo=${Cypress.env('ANO_LETIVO')}`,
    headers: {
         'Accept': 'text/plain',
         'Authorization': 'Bearer token_invalido' },
    failOnStatusCode: false
  })
})

Cypress.Commands.add('dashboard_devolutivas_quantidade_devolutivas_por_ano_vazio', () => {
  return cy.gerar_token().then((token) => {        
      return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/devolutivas/consolidacao?anoLetivo=`,
        headers: {
          'Accept': 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
      })
  })
})