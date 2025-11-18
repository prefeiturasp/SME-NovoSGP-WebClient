Feature: API - Consultas de anotações de frequência do aluno

  Scenario: Retorna a anotação do aluno através do id
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint do id da anotação
    Then retorna os dados do id com status 200

  Scenario: Id da anotação é obrigatório na consulta do aluno
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint sem id da anotação
    Then retorna o status 405 que o id é obrigatório

  Scenario: Id da anotação inválido na consulta do aluno
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint com id da anotação incorreto
    Then retorna o status 601 que o id deve ser informado

  Scenario: Id da anotação inexistente na consulta do aluno
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint com id da anotação inexistente
    Then retorna o status 601 que anotação não foi encontrada

  Scenario: Não retorna a anotação do aluno através do id sem autenticação
    Given que não possuo um token de acesso válido
    When tento a requisição GET para o endpoint do id da anotação
    Then não retorna dados da anotação id mostrando o status 401
  
  Scenario: Retorna a anotação do aluno na aula
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint de anotação do aluno na aula
    Then retorna os dados do id aula com status 204

  Scenario: Id do aluno é obrigatório na anotação da aula
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint sem id do aluno na aula
    Then retorna o status 500 sem dados de aula

  Scenario: Id da aula é obrigatório na anotação do aluno
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint sem id da aula do aluno
    Then retorna o status 500 sem dados de aluno  

  Scenario: Não retorna a anotação do aluno através do id sem autenticação
    Given que não possuo um token de acesso válido
    When tento a requisição GET para o endpoint do id da anotação
    Then não retorna dados da anotação id mostrando o status 401

  Scenario: Retorna os motivos de ausências nas anotações do aluno
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint de motivos de ausências
    Then retorna o status 200 as descrições nas anotações do aluno

  Scenario: Não retorna os motivos de ausências sem autenticação
    Given que não possuo um token de acesso válido
    When tento uma requisição GET para o endpoint de motivos de ausências
    Then não retorna as descrições exibindo o status 401

  Scenario: Retorna as anotações do aluno na data selecionada
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint de anotações na data
    Then retorna o status 200 com os dados de aluno no período

  Scenario: Data de fim deve ser maior que início
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint de anotações com data
    And data de fim é maior que início
    Then retorna o status 601 que o fim deve ser maior

  Scenario: Não permitir data inválida
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint de anotações da data
    And a data está inválida
    Then retorna o status 422 que o valor é inválido

  Scenario: Data fim deve ser preenchida
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint sem data fim preenchida
    Then retorna o status 422 que data fim é inválida

  Scenario: Filtrar somente com data fim
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint sem data fim
    Then retorna o status 601 que data fim é obrigatório

  Scenario: Data início deve ser preenchida
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint sem data início preenchida
    Then retorna o status 422 que data início é inválida

  Scenario: Filtrar somente com data início
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint sem data início
    Then retorna o status 601 que data início é obrigatório

  Scenario: Aluno deve ser preenchido
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint da data sem o aluno
    Then retorna o status 422 que a consulta do aluno é inválida

  Scenario: Não retorna as anotações do aluno na data selecionada sem autenticação
    Given que não possuo um token de acesso válido
    When tento uma requisição GET para o endpoint de anotações na data
    Then não retorna os dados de aluno no período exibindo o status 401
