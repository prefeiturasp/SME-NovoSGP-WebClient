Feature: API - Fechamento - Acompanhamento de id de pendências

  Scenario: Listar todas as pendências por id
    Given que possuo um token de acesso válido
    When informo o id da pendência
    And envio uma requisição GET para o endpoint
    Then a reposta deve conter status 200

  Scenario: Não permitir acessar sem autenticação
    Given que não possuo um token de acesso válido
    When informo somente o id da pendência
    And tento o envio uma requisição GET para o endpoint
    Then a resposta deve ter o status 401 sem detalhamento da pendência

  Scenario: Não listar pendência sem id informado
    Given que possuo um token de acesso válido
    When não informo o id da pendência
    And envio uma requisição GET para o endpoint sem id válido
    Then a resposta deve ter o status 601 com a mensagem de erro de id da pendência não informado
