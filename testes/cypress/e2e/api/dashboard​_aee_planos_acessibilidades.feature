# language: pt

Funcionalidade: API - Dashboard AEE de planos acessibilidades

  Cenário: Retorna os dados AEE de planos acessibilidades
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint
    Então retorna o status 200 com os dados AEE de planos acessibilidades

  Cenário: Ano letivo deve ser obrigatório no AEE de planos acessibilidades
    Dado que login gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint sem o ano
    Então retorna o status 422 que o ano letivo é obrigatório AEE de planos acessibilidades

  Cenário: DRE deve ser obrigatório no AEE de planos acessibilidades
    Dado que login gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint sem o DRE
    Então retorna o status 422 que DRE é obrigatório no AEE de planos acessibilidades

  Cenário: UE deve ser obrigatório no AEE de planos acessibilidades
    Dado que login gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint sem UE
    Então retorna o status 422 que o ano letivo é obrigatório no AEE de planos acessibilidades

  Cenário: Não retorna dados sem usuário autenticado no AEE de planos acessibilidades
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint
    Então retorna o status 401 sem buscar AEE de planos acessibilidades
