Feature: API - Perfis do usuário

  Scenario: Usuário logado deve possuir perfil selecionado
    Given que o usuário é autenticado
    When envio uma requisição GET para o endpoint de perfil
    Then retorna o status 200 com perfil do usuário

  Scenario: Não acessa perfil sem autenticação
    Given que o usuário não é autenticado
    When tento a requisição GET para o endpoint de perfil
    Then retorna o status 401 sem perfil associado