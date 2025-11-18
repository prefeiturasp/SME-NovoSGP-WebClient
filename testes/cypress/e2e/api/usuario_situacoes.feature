Feature: API - Situação do usuário

  Scenario: Situações do usuário devem ser listadas
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de situações dos usuários
    Then retorna o status 200 listando todas disponíveis

  Scenario: Não acessar sem autenticação
    Given que não login não gerou um token de acesso válido
    When tento a requisição GET para o endpoint de situações dos usuários
    Then retorna o status 401

