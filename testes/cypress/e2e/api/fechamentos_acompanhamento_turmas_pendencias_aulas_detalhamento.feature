Feature: API - Fechamento - Acompanhamento de pendências por aula

  Scenario: Listar todas as pendências por aula
    Given que possuo um token de acesso válido
    When informo o id de pendência da aula
    And envio uma requisição GET para o endpoint
    Then a reposta deve conter status 200

  Scenario: Não permitir acessar sem autenticação
    Given que não possuo um token de acesso válido
    When informo o id de pendência da aula
    And envio uma requisição GET para o endpoint sem autenticação
    Then a resposta deve ter o status 401 sem acompanhamento de pendências por aula

  Scenario: Não listar pendência da aula sem id informado
    Given que possuo um token de acesso válido
    When não informo o id de pendência da aula
    And envio uma requisição GET para o endpoint sem o id
    Then a resposta deve ter o status 601 com a mensagem de erro de id não informado
