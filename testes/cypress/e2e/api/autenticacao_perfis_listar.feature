Feature: API - Listar perfis do usuário

  Scenario: Listar as informações de perfil após autenticação
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de listar perfis
    Then retorna os dados de todos perfis do usuário com status 200

  Scenario: Sem dados de perfis quando usuário não está autenticado
    Given que não login não gerou um token de acesso válido
    When tento a requisição GET para o endpoint de listar perfis
    Then retorna o status 401 sem dados de perfis

