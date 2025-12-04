Feature: API - Versão do sistema

  Scenario: Retornar versão atual do sistema
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de versão
    Then retorna o status 200 com a atual

  Scenario: Não acessar a versão sem autenticação
    Given que não login não gerou um token de acesso válido
    When tento a requisição GET para o endpoint de versões
    Then retorna o status 401

  Scenario: Realizar o teste de ping
    Given que acesso o endpoint
    When envio uma requisição GET para testar o ping
    Then retorna o status 200

