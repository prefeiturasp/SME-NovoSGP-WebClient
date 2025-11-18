Feature: API - Dados do usuário

  Scenario: Retorna os dados do usuário após autenticação
    Given que o usuário é autenticado
    When envio uma requisição GET para o endpoint de dados da autenticação
    Then retorna o status 200 com informações do usuário

  Scenario: Não retorna dados para usuário não autenticado
    Given que o usuário não é autenticado
    When tento a requisição GET para o endpoint
    Then retorna o status 401 sem dados do usuário