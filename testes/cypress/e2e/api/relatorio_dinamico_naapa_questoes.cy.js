/// <reference types='cypress' />

describe('API - Relatório dinâmico de questões NAAPA', () => {
  it('Retorna os grupos de questões', () => {
    cy.buscar_relatorio_dinamico_naapa_questoes().then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.be.an('array')

      response.body.forEach((grupo) => {
        expect(grupo).to.include.all.keys(
          'id',
          'nome',
          'questionarioId',
          'nomeComponente',
          'ordem',
          'tipoQuestionario',
          'modalidadesCodigo',
          'questoes'
        )

        expect(grupo.questoes).to.be.an('array')

        grupo.questoes.forEach((questao) => {
          expect(questao).to.include.all.keys(
            'id',
            'ordem',
            'nome',
            'observacao',
            'obrigatorio',
            'somenteLeitura',
            'tipoQuestao',
            'opcionais',
            'opcaoResposta',
            'resposta',
            'dimensao',
            'tamanho',
            'mascara',
            'placeHolder',
            'nomeComponente'
          )
        })
      })
    })
  })

  it('Não retorna sem usuário autenticado', () => {
    cy.nao_autorizado_relatorio_dinamico_naapa_questoes().then((response) => {
      expect(response.status).to.eq(401)
     })
  })
})