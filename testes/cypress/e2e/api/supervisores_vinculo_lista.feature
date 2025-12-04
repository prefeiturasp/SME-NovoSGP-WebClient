Feature: API - Lista de vínculo de supervisores

  Scenario: Listar os vínculos através da DRE
    Given que possuo um token de acesso válido
    When envio uma requisição GET para endpoint de vínculo
    Then retorna o status 200 com supervisores da DRE

  Scenario: Listar os vínculos através da DRE e UE
    Given que possuo um token de acesso válido
    When envio uma requisição GET para endpoint de vínculo da DRE e UE
    Then retorna o status 200 com supervisores da abranagência

  Scenario: Listar os vínculos através da DRE, UE e supervisor
    Given que possuo um token de acesso válido
    When envio a requisição GET para endpoint de vínculo da DRE e UE
    Then retorna o status 200 e os supervisores

  Scenario: UE não deve ter supervisor responsável
    Given que possuo um token de acesso válido
    When envio a requisição GET para endpoint sem vínculo na DRE e UE
    Then retorna o status 200 sem supervisor responsável

  Scenario: Código da DRE deve ser obrigatório
    Given que possuo um token de acesso válido
    When envio uma requisição GET para endpoint de vínculo sem a DRE
    Then retorna o status 601 que não foi preenchido o código

  Scenario: Não retornar dados de vínculos de supervisores sem usuário autenticado
    Given que não possuo um token de acesso válido
    When tento a requisição GET para endpoint de vínculo
    Then retorna o status 401 sem os dados

