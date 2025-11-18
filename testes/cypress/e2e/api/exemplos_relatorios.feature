Feature: API - Exemplos relatórios

  Scenario: Retorna dados de relatórios
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de exemplos relatórios    
    Then retorna o relatório com status 200

  Scenario: Não retorna relatório sem usuário autenticado
    Given que não login não gerou um token de acesso válido
    When tento a requisição GET para o endpoint de exemplos relatórios
    Then retorna o status 401 sem dados

