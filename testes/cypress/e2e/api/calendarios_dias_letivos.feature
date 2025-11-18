Feature: API - Dias letivos do calendário

  Scenario: Quantidade de dias letivos do calendário
    Given que login gerou um token de acesso válido
    When envio uma requisição POST na api de dias letivos
    Then retorna o status 200 com a quantidade

  Scenario: Não acessar dias letivos do calendário sem autenticação
    Given que não gerou um token de acesso válido
    When tento uma requisição POST na api de dias letivos
    Then retorna o status 401 que não foi permitido