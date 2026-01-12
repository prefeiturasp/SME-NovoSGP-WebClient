# language: pt

Funcionalidade: API - Dashboard de acompanhamento aprendizagem por aluno

  Cenário: Retornar dashboard de acompanhamento do aluno
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint os dados
    Então retorna o status 200 carregando o dashboard de acompanhamento do aluno

  Cenário: Ano letivo deve ser informado
    Dado que login gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint sem o ano
    Então retorna o status 422 que o ano letivo deve ser informado
 
  Cenário: Semestre deve ser informado
    Dado que login gerou um token de acesso válido
    Quando tento a requisição GET sem o semestre
    Então retorna o status 422 que o semestre deve ser informado

  Cenário: Não retorna dados de acompanhamento do aluno sem usuário autenticado
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint do dashboard
    Então retorna o status 401 sem dados de acompanhamento
