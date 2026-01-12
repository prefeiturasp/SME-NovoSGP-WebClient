# language: pt

Funcionalidade: API - Fechamento - Acompanhamento por turmas

  Cenário: Retorna dados da turma no bimestre
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o status 200 com dados da turma no bimestre

  Cenário: Não retorna dados com código da turma inválido
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET sem turma
    Então retorna o status 500 sem dados da turma no bimestre

  Cenário: Não retorna dados sem usuário autenticado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET
    Então não retorna os dados mostrando o status 401

