Feature: API - Mural de avisos da aula

  Scenario: Retorna avisos da aula
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint o ID da aula
    Then retorna o mural de avisos com status 200

  Scenario: Não retorna avisos com código da turma vazio
    Given que login gerou um token de acesso válido
    When tento a requisição GET para o endpoint sem o ID da aula
    Then retorna o status 422 sem o mural de avisos
    
  Scenario: Não retorna avisos sem usuário autenticado
    Given que não login não gerou um token de acesso válido
    When tento a requisição GET para o endpoint o ID da aula
    Then retorna o status 401 sem o mural de avisos