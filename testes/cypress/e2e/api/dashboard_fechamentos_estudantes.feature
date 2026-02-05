# language: pt

Funcionalidade: API - Dashboard de fechamentos - Estudantes

  Cenário: Carrega estudantes do dashboard de fechamentos
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então carrega estudantes do dashboard de fechamentos com status 200

  Cenário: Não retorna estudantes sem usuário autenticado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET
    Então não retorna estudantes mostrando o status 401

