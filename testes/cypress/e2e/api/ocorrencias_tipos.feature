Feature: API - Listar ocorrências

  Scenario: Listar todas as ocorrências
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint buscar
    Then o corpo da resposta deve conter todos tipos de ocorrências com status 200

  Scenario: Não permitir acessar sem autenticação
    Given que não possuo um token de acesso válido
    When tento enviar uma requisição GET para o endpoint
    Then a consulta de tipos de ocorrências deve ter o status 401

