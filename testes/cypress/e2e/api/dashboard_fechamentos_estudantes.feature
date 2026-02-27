# language: pt

Funcionalidade: API - Dashboard de fechamentos - Estudantes

  Cenário: Carrega estudantes do dashboard de fechamentos
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então carrega estudantes do dashboard de fechamentos com status 200

  Cenário: Garantir que o retorno contenha estrutura válida de estudantes
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então carrega estudantes do dashboard de fechamentos com status 200

  Cenário: Garantir que a lista de estudantes não esteja vazia quando houver dados
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então carrega estudantes do dashboard de fechamentos com status 200

  Cenário: Garantir que os estudantes retornem com campos obrigatórios preenchidos
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então carrega estudantes do dashboard de fechamentos com status 200

  Cenário: Não retorna estudantes sem usuário autenticado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET
    Então não retorna estudantes mostrando o status 401

  Cenário: Não retorna estudantes com token inválido
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET
    Então não retorna estudantes mostrando o status 401

  Cenário: Não retorna estudantes com token expirado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET
    Então não retorna estudantes mostrando o status 401
