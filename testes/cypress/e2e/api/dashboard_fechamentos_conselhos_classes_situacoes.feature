# language: pt

Funcionalidade: API - Dashboard de fechamentos - Conselhos de classes - Situações

  Cenário: Retorna situações do dashboard de fechamento do conselho de classe
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o dashboard de fechamento do conselho de classe com status 200

  Cenário: Garantir que o retorno contenha estrutura válida das situações
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o dashboard de fechamento do conselho de classe com status 200

  Cenário: Garantir que as situações estejam consolidadas corretamente
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o dashboard de fechamento do conselho de classe com status 200

  Cenário: Garantir que não retorne situações com valores inválidos
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o dashboard de fechamento do conselho de classe com status 200

  Cenário: Não retorna as situações de fechamento sem usuário autenticado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET
    Então não retorna as situações de fechamento mostrando o status 401

  Cenário: Não retorna as situações com token inválido
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET
    Então não retorna as situações de fechamento mostrando o status 401

  Cenário: Não retorna as situações com token expirado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET
    Então não retorna as situações de fechamento mostrando o status 401
