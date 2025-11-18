Feature: API - Sinteses

  Scenario: Retornar os valores do ano letivo
    Given que login gerou um token de acesso válido
    When insiro o ano letivo
    And envio uma requisição GET para o endpoint de sinteses
    Then retorna o status 200 com os valores

  Scenario: Não acessar a versão sem autenticação
    Given que não login não gerou um token de acesso válido
    When tento a requisição GET para o endpoint de sinteses
    Then retorna o status 401 sem valores

  Scenario: Ano letivo deve ser obrigatório nas sinteses
    Given que login gerou um token de acesso válido
    When envio uma requisição GET de sinteses sem ano letivo
    Then retorna o status 500

  Scenario: Ano letivo deve ser válido nas sinteses
    Given que login gerou um token de acesso válido
    When insiro o ano letivo inválido
    And tento o envio uma requisição GET de sinteses
    Then retorna o status 601 com a mensagem de erro
