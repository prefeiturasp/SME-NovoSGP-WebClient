Feature: API - Filtro de ciclos

  Scenario: Filtrar o ciclo de alfabetização
    Given que possuo um token de acesso válido
    When envio uma requisição POST com anos de 1 até 3
    Then retorna o status 200 filtrando o ciclo de alfabetização

  Scenario: Filtrar o ciclo interdisciplinar
    Given que possuo um token de acesso válido
    When envio uma requisição POST com anos de 4 até 6
    Then retorna o status 200 filtrando o ciclo interdisciplinar

  Scenario: Filtrar o ciclo autoral
    Given que possuo um token de acesso válido
    When envio uma requisição POST com anos de 7 até 9
    Then retorna o status 200 filtrando o ciclo autoral

  Scenario: Filtro de ciclo inválido
    Given que possuo um token de acesso válido
    When envio uma requisição POST com ano inexistente
    Then retorna o status 601 que o filtro de ciclo é inválido

  Scenario: Não retorna filtro de ciclo sem autenticação
    Given que não possuo um token de acesso válido
    When tento a requisição POST para o endpoint de filtro de ciclo
    Then não retorna o filtro mostrando o status 401

