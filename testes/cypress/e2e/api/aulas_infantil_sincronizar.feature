Feature: API - Sincronizar aulas infantil através do código da turma

  Scenario: Realizar sincronização das aulas infantil
    Given que possuo um token de acesso válido
    When envio uma requisição GET para sincronizar através do código da turma
    Then a sincronização aulas infantil retorna com status 200

  Scenario: Não sincronizar sem autenticação
    Given que não possuo um token de acesso válido
    When tento sincronizar através do código da turma com requisição GET
    Then não sincroniza as aulas infantil retornando com status 401

