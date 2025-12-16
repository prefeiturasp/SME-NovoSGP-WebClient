Feature: API - Recuperação paralela

  Scenario: Listar através do código da turma
    Given que possuo um token de acesso válido
    When envio a requisição GET ao endpoint recuperação paralela informando o código da turma
    Then recebo status 200 listando os dados

  Scenario: Código da turma é obrigatório para listar
    Given que possuo um token de acesso válido
    When envio a requisição GET ao endpoint recuperação paralela sem o código da turma
    Then recebo status 601 indicando que o código da turma é obrigatório

  Scenario: Não lista através do código da turma sem autenticação
    Given que não possuo um token de acesso válido
    When tento a requisição GET ao endpoint recuperação paralela com código da turma
    Then retorna o status 401 sem listar os dados

  Scenario: Lista total de estudantes
    Given que possuo um token de acesso válido
    When envio a requisição GET ao endpoint recuperação paralela informando de total
    Then recebo status 200 totalizando os estudantes

  Scenario: Não totaliza estudantes sem autenticação
    Given que não possuo um token de acesso válido
    When tento a requisição GET ao endpoint recuperação paralela informando de total
    Then retorna o status 401 sem total de estudantes

  Scenario: Retornar o gráfico de frequência
    Given que possuo um token de acesso válido
    When envio a requisição GET ao endpoint do gráfico da recuperação paralela
    Then recebo status 200 com gráfico de frequência

  Scenario: Não retornar o gráfico de frequências sem autenticação
    Given que não possuo um token de acesso válido
    When tento a requisição GET ao endpoint do gráfico da recuperação paralela
    Then retorna o status 401 sem gráfico de frequência

  Scenario: Busca todos resultados
    Given que possuo um token de acesso válido
    When envio a requisição GET ao endpoint de resultados da recuperação paralela
    Then recebo status 200 com todos resultados

  Scenario: Não busca os resultados sem autenticação
    Given que não possuo um token de acesso válido
    When tento a requisição GET ao endpoint de resultados da recuperação paralela
    Then retorna o status 401 sem resultados

  Scenario: Busca resultados de encaminhamento
    Given que possuo um token de acesso válido
    When envio a requisição GET ao endpoint de encaminhamento da recuperação paralela
    Then recebo status 200 com todos resultados de encaminhamento

  Scenario: Não busca os encaminhamentos sem autenticação
    Given que não possuo um token de acesso válido
    When tento a requisição GET ao endpoint de encaminhamento da recuperação paralela
    Then retorna o status 401 sem resultados de encaminhamento

  Scenario: Listar no período através do código da turma
    Given que possuo um token de acesso válido
    When envio a requisição GET ao endpoint recuperação paralela no período
    Then recebo status 200 listando os dados através do código da turma

  Scenario: Código da turma é obrigatório para listar no período
    Given que possuo um token de acesso válido
    When envio a requisição GET ao endpoint recuperação paralela no período sem o código da turma
    Then recebo status 500 sem lista a turma

  Scenario: Não lista no período através do código da turma sem autenticação
    Given que não possuo um token de acesso válido
    When tento a requisição GET ao endpoint recuperação paralela no período 
    Then retorna o status 401 sem listar os dados através do código da turma

  Scenario: Retorna os anos letivos
    Given que possuo um token de acesso válido
    When envio a requisição GET ao endpoint dos anos da recuperação paralela
    Then recebo status 200 com todos anos letivos

  Scenario: Não rtorna os anos letivos sem autenticação
    Given que não possuo um token de acesso válido
    When tento a requisição GET ao endpoint dos anos da recuperação paralela
    Then retorna o status 401 sem os anos letivos