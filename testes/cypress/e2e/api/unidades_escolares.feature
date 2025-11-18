Feature: API - Unidades escolares - Funcionários e usuários

  Scenario: Atribuir um funcionário a UE
    Given que login gerou um token de acesso válido
    When envio uma requisição POST 
    Then retorna o status 200 de sucesso ao atribuir

  Scenario: Dados de funcionário devem ser obrigatórios
    Given que login gerou um token de acesso válido
    When envio uma requisição POST sem os dados do funcionário
    Then retorna o status 415 sem atribuir
  
  Scenario: DRE deve ser obrigatória ao atribuir funcionário
    Given que login gerou um token de acesso válido
    When envio uma requisição POST sem a DRE
    Then retorna o status 601 sem atribuir funcionário

  Scenario: Não atribuir um funcionário a UE sem autenticação
    Given que não gerou um token de acesso válido
    When tento uma requisição POST
    Then retorna o status 401 sem atribuir funcionário

  Scenario: Atribuir um usuário a UE
    Given que login gerou um token de acesso válido
    When envio uma requisição POST 
    Then retorna o status 200 de sucesso ao atribuir

  Scenario: Dados de usuário devem ser obrigatórios
    Given que login gerou um token de acesso válido
    When envio uma requisição POST sem os dados do usuário
    Then retorna o status 415 sem atribuir

  Scenario: DRE deve ser obrigatória ao atribuir usuário
    Given que login gerou um token de acesso válido
    When envio uma requisição POST sem a DRE
    Then retorna o status 601 sem atribuir usuário

  Scenario: Não atribuir um usuário a UE sem autenticação
    Given que não gerou um token de acesso válido
    When tento uma requisição POST
    Then retorna o status 401 sem atribuir usuário


