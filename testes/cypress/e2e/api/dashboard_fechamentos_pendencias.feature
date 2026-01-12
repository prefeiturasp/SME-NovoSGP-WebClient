# language: pt

Funcionalidade: API - Dashboard de fechamentos - Pendências

  Cenário: Carrega pendências no dashboard de fechamentos
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então carrega pendências no dashboard de fechamentos com status 200

  Cenário: Não retorna pendências sem usuário autenticado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET
    Então não retorna pendências mostrando o status 401

