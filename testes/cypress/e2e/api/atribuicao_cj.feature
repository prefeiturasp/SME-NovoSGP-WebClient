Feature: API - Atribuição CJ

  Scenario: Busca as atribuições CJ
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint atribuições
    Then retorna atribuições CJ com status 200

  Scenario: Não busca as atribuições CJ sem autenticação
    Given que não possuo um token de acesso válido
    When tento a requisição GET para o endpoint atribuições
    Then não retorna atribuições CJ mostrando o status 401

  Scenario: Cadastrar atribuição CJS com dados válidos
    Given que possuo um token de acesso válido
    When envio uma requisição POST para cadastrar atribuições CJ
    Then retorna status 200 confirmando o cadastro

  Scenario: Código da disciplina deve ser preenchido
    Given que possuo um token de acesso válido
    When envio a requisição do CJ com disciplina vazia
    Then deve retornar status 422 por não ter sido preenchido

  Scenario: Código da turma deve ser preenchido
    Given que possuo um token de acesso válido
    When envio a requisição CJS com turma vazia
    Then deve retornar status 422 de sem preenchimento

  Scenario: Modalidade deve ser preenchida
    Given que possuo um token de acesso válido
    When envio a requisição CJS com modalidade vazia
    Then deve retornar status 422 de sem modalidade

  Scenario: DRE deve ser preenchida
    Given que possuo um token de acesso válido
    When envio a requisição CJS com DRE vazio
    Then deve retornar status 422 sem a DRE

  Scenario: UE deve ser preenchida
    Given que possuo um token de acesso válido
    When envio a requisição CJS com UE vazio
    Then deve retornar status 422 sem a UE

  Scenario: Ano letivo deve ser preenchido
    Given que possuo um token de acesso válido
    When envio a requisição CJS com ano letivo vazio
    Then deve retornar status 500 devido o ano ser obrigatório 

  Scenario: Cadastrar atribuição CJS com histórico false
    Given que possuo um token de acesso válido
    When envio a requisição CJS com historico false
    Then o sistema deve retornar status 200 de cadastrado

  Scenario: Não cadastrar atribuições CJ sem autenticação
    Given que não possuo um token de acesso válido
    When tento a requisição POST para cadastrar atribuições CJ
    Then não cadastra atribuições CJ mostrando o status 401