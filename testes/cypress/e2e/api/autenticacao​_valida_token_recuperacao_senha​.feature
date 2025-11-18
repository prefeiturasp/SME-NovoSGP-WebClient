Feature: API - Validação do token de recuperação de senha

  Scenario: Token informado deve ser válido
    Given que solicito a recuperação de senha
    When envio uma requisição GET com token válido
    Then retorna o status 200 de sucesso da solicitação

  Scenario: Token informado deve ser inválido
    Given que solicito a recuperação de senha
    When tento a requisição GET com token inválido
    Then retorna o status 422

    


