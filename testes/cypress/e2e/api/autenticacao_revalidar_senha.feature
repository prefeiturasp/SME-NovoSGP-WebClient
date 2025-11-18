Feature: API - Autenticação - Revalidar senha

  Scenario: Deve revalidar o token do usuário
    Given que possuo um token de acesso válido
    When envio uma requisição POST para revalidar o token
    Then retorna a expiração com status 200 

  Scenario: Não revalidar com usuário deslogado
    Given que não possuo um token de acesso válido
    When tento a requisição POST para revalidar o token
    Then não revalida retornando o status 401


