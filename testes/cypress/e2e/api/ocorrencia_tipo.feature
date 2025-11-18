Feature: API - Tipos de ocorrências

  Scenario: Retornar os ids e tipos de ocorrências
    Given que login gerou um token de acesso válido
    When envio a requisição GET para o endpoint de ocorrências
    Then retorna o status 200 com os ids e tipos

  Scenario: Não acessar os tipos de ocorrências sem autenticação
    Given que não login não gerou um token de acesso válido
    When tento a requisição GET para o endpoint de ocorrências
    Then retorna o status 401 sem os ids e tipos