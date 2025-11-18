Feature: API - Autenticação de id do perfil do usuário

  Scenario: Selecionar perfil válido para o usuário
    Given que login gerou um token de acesso válido
    When envio uma requisição PUT para o endpoint de autenticação do perfil
    Then retorna o id com status 200

  Scenario: Não permitir selecionar perfil inválido
    Given que login gerou um token de acesso válido
    When tento a requisição PUT para o endpoint com perfil inválido
    Then retorna o status 422

  Scenario: Não selecionar perfil sem autenticação
    Given que não login não gerou um token de acesso válido
    When tento a requisição PUT para o endpoint de autenticação do perfil
    Then retorna o status 401

