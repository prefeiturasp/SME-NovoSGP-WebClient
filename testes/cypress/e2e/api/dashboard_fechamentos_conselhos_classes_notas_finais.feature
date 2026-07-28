# language: pt

Funcionalidade: API - Dashboard de fechamentos - Conselhos de classes - Notas finais

  Cenário: Carregar o dashboard do conselho de classe com notas finais
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o dashboard do conselho de classe de notas finais com status 200

  Cenário: Garantir que o retorno contenha estrutura válida de notas finais
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o dashboard do conselho de classe de notas finais com status 200

  Cenário: Garantir que as notas finais estejam consolidadas corretamente
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o dashboard do conselho de classe de notas finais com status 200

  Cenário: Garantir que não retorne valores inválidos nas notas finais
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o dashboard do conselho de classe de notas finais com status 200

  Cenário: Não retorna notas finais de fechamento sem usuário autenticado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET
    Então não retorna o dashboard do conselho de classe de notas finais mostrando o status 401

  Cenário: Não retorna notas finais com token inválido
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET
    Então não retorna o dashboard do conselho de classe de notas finais mostrando o status 401

  Cenário: Não retorna notas finais com token expirado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET
    Então não retorna o dashboard do conselho de classe de notas finais mostrando o status 401
