Feature: API - Autenticação do e-mail de usuário

  Scenario: Confirmar que o e-mail foi autenticado
    Given que possuo um token de acesso válido
    When envio uma requisição PUT para autenticar o e-mail
    Then retorna o status 200 confirmando

  Scenario: E-mail para o usuário deve ser informado
    Given que possuo um token de acesso válido
    When envio uma requisição PUT com usuário
    And não informo o e-mail
    Then retorna o status 422 que o e-mail deve informado

  Scenario: Não autenticar e-mail inválido
    Given que possuo um token de acesso válido
    When envio uma requisição PUT para autenticar com usuário
    And insiro e-mail inválido
    Then retorna o status 422 que o e-mail é inválido

  Scenario: Não autenticar usuário deslogado
    Given que não possuo um token de acesso válido
    When tento a requisição PUT para autenticar o e-mail
    Then retorna o status 401 de não autorizado