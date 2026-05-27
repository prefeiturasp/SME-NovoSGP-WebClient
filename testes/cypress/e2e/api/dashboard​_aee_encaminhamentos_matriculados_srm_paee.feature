# language: pt

Funcionalidade: API - Dashboard AEE de planos acessibilidades

  Cenário: Retorna dados AEE planos acessibilidades
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint
    Então retorna o status 200 com os dados AEE planos acessibilidades

  Cenário: Garantir que o retorno contenha estrutura de dados válida
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint
    Então retorna o status 200 com os dados AEE planos acessibilidades

  Cenário: Garantir que a lista de planos não esteja vazia quando houver dados
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint
    Então retorna o status 200 com os dados AEE planos acessibilidades

  Cenário: Ano letivo deve ser obrigatório no AEE planos acessibilidades
    Dado que login gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint sem o ano
    Então retorna o status 422 que o ano letivo é obrigatório no AEE planos acessibilidades

  Cenário: Não retornar dados quando ano letivo não for informado
    Dado que login gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint sem o ano
    Então retorna o status 422 que o ano letivo é obrigatório no AEE planos acessibilidades

  Cenário: Não retorna dados de no AEE planos acessibilidades sem usuário autenticado
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint do dashboard AEE
    Então retorna o status 401 sem buscar AEE planos acessibilidades

  Cenário: Não retorna dados com token inválido
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint do dashboard AEE
    Então retorna o status 401 sem buscar AEE planos acessibilidades

  Cenário: Não retorna dados com token expirado
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint do dashboard AEE
    Então retorna o status 401 sem buscar AEE planos acessibilidades
