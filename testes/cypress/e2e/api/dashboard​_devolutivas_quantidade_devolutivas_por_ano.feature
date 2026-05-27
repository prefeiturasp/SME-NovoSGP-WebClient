# language: pt

Funcionalidade: API - Dashboard de quantidade de devolutivas por ano

  Cenário: Retorna quantidade de devolutivas
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint
    Então retorna o status 200 com quantidade de devolutivas

  Cenário: Garantir que o retorno contenha valor numérico válido
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint
    Então retorna o status 200 com quantidade de devolutivas

  Cenário: Garantir que a quantidade retornada não seja negativa
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint
    Então retorna o status 200 com quantidade de devolutivas

  Cenário: Ano deve ser obrigatório
    Dado que login gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint sem o ano
    Então retorna o status 422 que o ano letivo é obrigatório

  Cenário: Não retornar quantidade quando ano não for informado
    Dado que login gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint sem o ano
    Então retorna o status 422 que o ano letivo é obrigatório

  Cenário: Não retorna quantidade de devolutivas sem usuário autenticado
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint
    Então retorna o status 401 sem quantidade de devolutivas

  Cenário: Não retorna quantidade com token inválido
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint
    Então retorna o status 401 sem quantidade de devolutivas

  Cenário: Não retorna quantidade com token expirado
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint
    Então retorna o status 401 sem quantidade de devolutivas
