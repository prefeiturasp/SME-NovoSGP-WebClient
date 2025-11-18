Feature: API - Autenticação do logout

  Scenario: Confirmar o logout do usuário
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para deslogar
    Then retorna o status 200 de sucesso

  Scenario: Não confirmar quando estiver deslogado
    Given que não login não gerou um token de acesso válido
    When tento a requisição GET para deslogar
    Then retorna o status 401 


