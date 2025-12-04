Feature: API - Modalidades na UE através do ID no ano letivo

  Scenario: Retorna dados da modalidade no ano letivo
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint de modalidades
    Then retorna os dados do ano letivo com status 200

  Scenario: Retorna dados das modalidades da UE no ano letivo
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint de modalidades da UE
    Then retorna o status 200 com os dados da turma

  Scenario: UE deve ser obrigatório
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint de modalidades sem UE
    Then retorna o status 422 sem os dados do ano

  Scenario: Ano letivo deve ser obrigatório
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint de modalidades sem o ano
    Then retorna o status 422 sem da UE

  Scenario: Não retorna dados dados da modalidade no ano letivo sem usuário autenticado
    Given que não possuo um token de acesso válido
    When tento uma requisição GET para o endpoint de modalidades
    Then não retorna os dados da UE com status 401

