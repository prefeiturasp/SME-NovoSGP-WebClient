Feature: API - Modalidades da UE no ano letivo

  Scenario: Retorna dados de UE através do código
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint de modalidades da UE
    Then retorna os dados da UE com status 200

  Scenario: Ano letivo deve ser obrigatório
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint sem o ano letivo
    Then retorna o status 422 sem os dados da turma

  Scenario: Não retornar dados sem usuário autenticado
    Given que não possuo um token de acesso válido
    When tento uma requisição GET para o endpoint de modalidades
    Then não retorna os dados da UE com status 401

