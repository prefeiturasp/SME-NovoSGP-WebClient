# language: pt

Funcionalidade: API - Recuperação paralela

  Cenário: Listar através do código da turma
    Dado que possuo um token de acesso válido
    Quando envio a requisição GET ao endpoint recuperação paralela informando o código da turma
    Então recebo status 200 listando os dados

  Cenário: Código da turma é obrigatório para listar
    Dado que possuo um token de acesso válido
    Quando envio a requisição GET ao endpoint recuperação paralela sem o código da turma
    Então recebo status 601 indicando que o código da turma é obrigatório

  Cenário: Não lista através do código da turma sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET ao endpoint recuperação paralela com código da turma
    Então retorna o status 401 sem listar os dados

  Cenário: Lista total de estudantes
    Dado que possuo um token de acesso válido
    Quando envio a requisição GET ao endpoint recuperação paralela informando de total
    Então recebo status 200 totalizando os estudantes

  Cenário: Não totaliza estudantes sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET ao endpoint recuperação paralela informando de total
    Então retorna o status 401 sem total de estudantes

  Cenário: Retornar o gráfico de frequência
    Dado que possuo um token de acesso válido
    Quando envio a requisição GET ao endpoint do gráfico da recuperação paralela
    Então recebo status 200 com gráfico de frequência

  Cenário: Não retornar o gráfico de frequências sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET ao endpoint do gráfico da recuperação paralela
    Então retorna o status 401 sem gráfico de frequência

  Cenário: Busca todos resultados
    Dado que possuo um token de acesso válido
    Quando envio a requisição GET ao endpoint de resultados da recuperação paralela
    Então recebo status 200 com todos resultados

  Cenário: Não busca os resultados sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET ao endpoint de resultados da recuperação paralela
    Então retorna o status 401 sem resultados

  Cenário: Busca resultados de encaminhamento
    Dado que possuo um token de acesso válido
    Quando envio a requisição GET ao endpoint de encaminhamento da recuperação paralela
    Então recebo status 200 com todos resultados de encaminhamento

  Cenário: Não busca os encaminhamentos sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET ao endpoint de encaminhamento da recuperação paralela
    Então retorna o status 401 sem resultados de encaminhamento

  Cenário: Listar no período através do código da turma
    Dado que possuo um token de acesso válido
    Quando envio a requisição GET ao endpoint recuperação paralela no período
    Então recebo status 200 listando os dados através do código da turma

  Cenário: Código da turma é obrigatório para listar no período
    Dado que possuo um token de acesso válido
    Quando envio a requisição GET ao endpoint recuperação paralela no período sem o código da turma
    Então recebo status 500 sem lista a turma

  Cenário: Não lista no período através do código da turma sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET ao endpoint recuperação paralela no período 
    Então retorna o status 401 sem listar os dados através do código da turma

  Cenário: Retorna os anos letivos
    Dado que possuo um token de acesso válido
    Quando envio a requisição GET ao endpoint dos anos da recuperação paralela
    Então recebo status 200 com todos anos letivos

  Cenário: Não rtorna os anos letivos sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET ao endpoint dos anos da recuperação paralela
    Então retorna o status 401 sem os anos letivos