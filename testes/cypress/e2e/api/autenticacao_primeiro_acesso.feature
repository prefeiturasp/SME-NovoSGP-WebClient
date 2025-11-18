Feature: API - Autenticação do primeiro acesso

  Scenario: Realizar o primeiro acesso do usuário
    Given que minhas credenciais geraram um token válido
    When envio uma requisição POST para o endpoint de primeiro acesso
    Then retorna a confirmação no status 200

  Scenario: Confirmação deve ser igual a nova senha
    Given que insiro minhas credenciais
    And a confirmação não é igual a senha
    When tento a requisição POST para o endpoint de primeiro acesso
    Then retorna o status 422 com a mensagem de senhas diferentes

  Scenario: Não permitir cadastro de senha vazia
    Given que insiro as credenciais sem a nova senha
    When tento a requisição POST para o endpoint com perfil inválido
    Then retorna o status 422 com a mensagem de senha obrigatória

  Scenario: Não realizar o primeiro acesso sem autenticação
    Given que minhas credenciais não autenticaram
    When tento a requisição PUT para o endpoint sem usuário
    Then retorna o status 401

