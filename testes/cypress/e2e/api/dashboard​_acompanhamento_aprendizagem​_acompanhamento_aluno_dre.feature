Feature: API - Dashboard de acompanhamento aprendizagem por aluno e DRE

  Scenario: Retornar dashboard de acompanhamento do aluno e DRE
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de acompanhamento de aprendizagem
    Then retorna o status 200 com dados por aluno e DRE

  Scenario: Não retorna dados sem usuário autenticado
    Given que login gerou um token de acesso válido
    When tento a requisição GET para o endpoint de acompanhamento de aprendizagem
    Then retorna o status 401 sem dados por aluno e DRE

  Scenario: Ano letivo deve ser informado
    Given que não login não gerou um token de acesso válido
    When tento a requisição GET para o endpoint de dashboard de aprendizagem
    And não insiro o ano letivo
    Then retorna o status 422 sem os dados de acompanhamento por aluno e DRE

