Feature: API - Listar tipos e pendências da turma

  Scenario: Listar todas as pendências
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint buscar a lista de pendencias
    Then o corpo da resposta deve conter dados de pendências com status 200

  Scenario: Listar pendências da turma
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint de pendências da turma
    Then o corpo da resposta deve conter dados de pendências com status 200

  Scenario: Listar por tipo de pendências
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint por tipo de pendências
    Then o corpo da resposta deve conter dados de pendências com status 200

  Scenario: Listar por turma e tipo de pendências
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint por turma com tipo de pendência
    Then o corpo da resposta deve conter dados de pendências com status 200

  Scenario: Não permitir acessar sem autenticação
    Given que não possuo um token de acesso válido
    When tento enviar uma requisição GET para o endpoint
    Then a lista de pendencias deve ter o status 401

