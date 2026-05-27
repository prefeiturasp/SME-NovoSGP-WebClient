# language: pt

Funcionalidade: API - Mapeamentos de estudantes - Seções - ID

  Cenário: Retornar os dados do mapeamento do estudante
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o status 200 com dados do mapeamento do estudante

  Cenário: Não retorna dados sem usuário autenticado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET
    Então não retorna os dados mostrando o status 401

  Cenário: Não retorna dados com token inválido
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET
    Então não retorna os dados mostrando o status 401

  Cenário: Não retorna dados com token expirado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET
    Então não retorna os dados mostrando o status 401