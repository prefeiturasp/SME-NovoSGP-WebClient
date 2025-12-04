Feature: API - Mural de atividades infantis

  Scenario: Retorna mural de atividades da turma
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint do mural
    Then retorna as atividades da turma com status 200

   Scenario: Não retorna com turma inválida
    Given que possuo um token de acesso válido
    When envio a requisição GET para o endpoint com a aula inválida
    Then não retorna as atividades exibindo mensagem para informar

  Scenario: Não retorna as atividades sem usuário autenticado
    Given que não possuo um token de acesso válido
    When tento requisição GET para o endpoint do mural
    Then não retorna as atividades mostrando o status 401

