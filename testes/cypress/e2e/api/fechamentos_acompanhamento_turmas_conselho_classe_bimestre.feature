# language: pt

Funcionalidade: API - Fechamento - Acompanhamento de turmas, conselho de classe e bimestre

  Cenário: Retorna dados através da situação do conselho de classe
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o status 200 com dados através da situação do conselho de classe

  Cenário: Não retorna dados com código da turma inválido
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET sem turma
    Então retorna o status 500 sem dados da turma no bimestre

  Cenário: Não retorna dados com código do bimestre inválido
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET sem bimestre
    Então retorna o status 601 sem dados da turma no bimestre

  Cenário: Não retorna dados com conselho de classe inválido
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET sem a classe
    Então retorna o status 422 sem dados do conselho de classe

  Cenário: Não retorna dados sem usuário autenticado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET
    Então não retorna os dados mostrando o status 401

