Feature: API - Cadastro e alteração das anotações de frequência do aluno 

  Scenario: Alterar anotações através do id aluno
    Given que possuo um token de acesso válido de CP
    When envio uma requisição PUT para o endpoint de alterar anotações
    Then retorna o status 200 que foi alterado para o aluno

  Scenario: Aluno é obrigatório para alterar anotações 
    Given que possuo um token de acesso válido de CP
    When envio uma requisição PUT para o endpoint de alterar anotações sem id aluno
    Then retorna o status 405 que o metódo não foi aceito

  Scenario: Motivo é obrigatório para alterar anotações 
    Given que possuo um token de acesso válido de CP
    When envio uma requisição PUT para o endpoint de alterar anotações sem motivo
    Then retorna o status 500 que não foi processado

  Scenario: Anotação é obrigatório para alteração 
    Given que possuo um token de acesso válido de CP
    When envio uma requisição PUT para o endpoint de alterar sem anotação
    Then retorna o status 500 sem alterar devido anotação

  Scenario: Não altera anotações através do id aluno sem autenticação
    Given que não possuo um token de acesso válido de CP
    When tento uma requisição PUT para o endpoint de alterar anotações
    Then retorna o status 401 sem alteração para o aluno

  Scenario: Cadastra anotações através do aluno
    Given que possuo um token de acesso válido de CP
    When envio uma requisição POST para o endpoint de cadastro de anotações
    Then retorna o status 200 que foi salvo com sucesso

  Scenario: Id do motivo de ausência é obrigatório
    Given que possuo um token de acesso válido de CP
    When envio uma requisição POST para o endpoint de cadastro sem id do motivo
    Then retorna o status 422 que o id da ausência é obrigatório

  Scenario: Id da aula é obrigatório
    Given que possuo um token de acesso válido de CP
    When envio uma requisição POST para o endpoint de cadastro sem o id aula
    Then retorna o status 422 que deve informar a aula

  Scenario: Id do componente curricular é obrigatório
    Given que possuo um token de acesso válido de CP
    When envio uma requisição POST para o endpoint de cadastro sem id do componente
    Then retorna o status 422 que deve informar o componente

  Scenario: Código do aluno é obrigatório
    Given que possuo um token de acesso válido de CP
    When envio uma requisição POST para o endpoint de cadastro sem código aluno
    Then retorna o status 422 que o valor do código deve ser informado

  Scenario: Se turma é infantil deve estar preenchido 
    Given que possuo um token de acesso válido de CP
    When envio uma requisição POST para o endpoint de cadastro o infantil
    Then retorna o status 422 que o valor é esperado

  Scenario: Não cadastra anotações através do id aluno sem autenticação
    Given que não possuo um token de acesso válido de CP
    When tento uma requisição POST para o endpoint de cadastro de anotações
    Then retorna o status 401 sem cadastrar anotação para o aluno