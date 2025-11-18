Feature: API - Retorna a turma por código, ano letivo, tipo de calendário, modalidade e UE

  Scenario: Buscar alunos da turma no ano letivo
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de código da turma com ano letivo
    Then retorna os dados de todos alunos com status 200

  Scenario: Não buscar alunos com turma inválida
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de código da turma inválida
    Then retorna a mensagem de erro com status 601 sem os dados de alunos

  Scenario: Código da turma deve ser obrigatório
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint sem código da turma
    Then não retorna os dados de alunos com status 500

  Scenario: Ano letivo deve ser obrigatório
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint sem ano letivo
    Then não retorna os dados de alunos com status 500

  Scenario: Não busca os dados da turma sem autenticação
    Given que não gerou um token de acesso válido
    When tento a requisição GET para o endpoint de código da turma com ano letivo
    Then retorna o status 401 sem dados dos alunos

  Scenario: Buscar tipo de calendário
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de tipo de calendário
    Then retorna o status 200 com nome junto ao id
  
  Scenario: Código da turma deve ser obrigatório no tipo de calendário
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint sem turma no tipo de calendário
    Then retorna o status 404 sem dados do calendário

  Scenario: Não buscar tipo de calendário com turma inválida
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint com turma inválida no tipo de calendário
    Then retorna a mensagem de erro com status 601 sem os tipos

  Scenario: Não busca o tipo de calendário sem autenticação
    Given que não gerou um token de acesso válido
    When tento a requisição GET para o endpoint o tipo de calendário
    Then retorna o status 401 sem dados de calendário

  Scenario: Buscar modalidades da turma
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de modalidades
    Then retorna o status 200 com código junto a descrição

  Scenario: Não busca modalidades da turma sem autenticação
    Given que não gerou um token de acesso válido
    When tento a requisição GET para o endpoint de modalidades
    Then retorna o status 401 sem dados de modalidades

  Scenario: Buscar turmas de sondagem da UE 
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de sondagem da UE
    Then retorna o status 200 com código da turma junto ao nome

  Scenario: Ano deve ser obrigatório na sondagem da UE 
    Given que login gerou um token de acesso válido
    When tento uma requisição GET para o endpoint de sondagem sem ano
    Then retorna o status 422 com mensagem de ano inválido

  Scenario: UE deve ser obrigatório na sondagem da UE 
    Given que login gerou um token de acesso válido
    When tento uma requisição GET para o endpoint de sondagem sem UE
    Then retorna o status 404 sem dados de UE

  Scenario: Não busca sondagem da turma sem autenticação
    Given que não gerou um token de acesso válido
    When tento a requisição GET para o endpoint de sondagem
    Then retorna o status 401 sem dados de sondagem

  Scenario: Retornar listagem de turmas
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de listagem de turmas
    Then retorna o status 200 com itens, total de páginas e total de registros

  Scenario: Não retornar listagem de turmas sem ano letivo
    Given que login gerou um token de acesso válido
    When tento uma requisição GET para o endpoint da listagem sem ano
    Then retorna o status 422 que o ano está inválido

  Scenario: Não retornar listagem de turmas sem modalidade
    Given que login gerou um token de acesso válido
    When tento uma requisição GET para o endpoint da listagem sem modalidade
    Then retorna o status 500 que a modalidade está inválida

  Scenario: Não retornar listagem de turmas sem bimestre
    Given que login gerou um token de acesso válido
    When tento uma requisição GET para o endpoint da listagem sem o bimestre
    Then retorna o status 422 que o bimestre está inválido

  Scenario: Retornar listagem de turmas sem histórico
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de listagem sem histórico
    Then retorna o status 200

  Scenario: Não listar turmas sem autenticação
    Given que não gerou um token de acesso válido
    When tento uma requisição GET para o endpoint de listagem
    Then retorna o status 401