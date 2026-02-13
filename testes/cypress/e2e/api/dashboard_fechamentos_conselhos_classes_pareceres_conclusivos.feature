# language: pt

Funcionalidade: API - Dashboard de fechamentos - Conselhos de classes - Pareceres conclusivos

  Cenário: Carrega o dashboard de fechamento do conselho de classe de pareceres conclusivos
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o dashboard de fechamento do conselho de classe de pareceres conclusivos com status 200

  Cenário: Não retorna os pareceres conclusivos de fechamento sem usuário autenticado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET
    Então não retorna os pareceres conclusivos de fechamento mostrando o status 401

