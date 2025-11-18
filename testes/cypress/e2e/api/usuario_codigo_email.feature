Feature: API - Atualizar email de usuários através do codigoRf

  Scenario: Deve inserir um novo e-mail para o usuário
    Given que o usuário é autenticado
    When envio uma requisição PUT para alterar o e-mail
    Then retorna o status 200 com o novo e-mail

  Scenario: Não inserir e-mail para usuário inexistente
    Given que o usuário é autenticado
    When envio uma requisição PUT
    And o usuário inserido é inexistente
    Then retorna o status 601 informando erro ao obter dados

  Scenario: E-mail para o usuário deve ser informado
    Given que o usuário é autenticado
    When envio uma requisição PUT com usuário
    And não informo um novo e-mail
    Then retorna o status 422 que o e-mail deve informado

  Scenario: Não permitir e-mail inválido
    Given que o usuário é autenticado
    When envio uma requisição PUT para alterar
    And insiro e-mail inválido
    Then retorna o status 422 que o e-mail é inválido

  Scenario: Não atualizar e-mail sem autenticação
    Given que o usuário não é autenticado
    When tento a requisição PUT para alterar o e-mail
    Then retorna o status 401 de não autorizado