Feature: API - Anos letivos anteriores e atual

  Scenario: Retorna o ano letivo atual
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint buscar o ano letivo
    Then retorna o ano atual com status 200

   Scenario: Retorna os anos letivos anteriores e atual
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint buscar os anos letivos
    Then retorna os anos anteriores e atual com status 200

  Scenario: Não permitir acessar sem autenticação
    Given que não possuo um token de acesso válido
    When tento a requisição GET para o endpoint buscar o ano letivo
    Then não consulta ano letivo mostrando o status 401

