Feature: API - Apanhado geral da turmas

  Scenario: Retorna a quantidade do apanhado geral
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint de apanhado geral
    Then retorna a quantidade com status 200

  Scenario: Turma é obrigatório na consulta do apanhado geral
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint de apanhado sem a turma
    Then retorna o status 422 que a turma é inválida

  Scenario: Semestre é obrigatório na consulta do apanhado geral
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint de apanhado sem o semestre
    Then retorna o status 422 que o semestre é inválido

  Scenario: Não retorna quantidade do apanhado geral sem autenticação
    Given que não possuo um token de acesso válido
    When tento a requisição GET para o endpoint de apanhado geral
    Then não retorna a quantidade do apanhado mostrando o status 401

