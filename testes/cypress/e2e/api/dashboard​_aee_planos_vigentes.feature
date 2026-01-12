# language: pt

Funcionalidade: API - Dashboard AEE de planos vigentes

  Cenário: Retorna dados AEE planos vigentes
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint
    Então retorna o status 200 com os dados de planos

  Cenário: Ano letivo deve ser obrigatório
    Dado que login gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint sem o ano
    Então retorna o status 422 que o ano letivo é obrigatório

  Cenário: DRE deve ser obrigatório
    Dado que login gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint sem o DRE
    Então retorna o status 422 que DRE é obrigatório

  Cenário: UE deve ser obrigatório
    Dado que login gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint sem UE
    Então retorna o status 422 que o ano letivo é obrigatório

  Cenário: Não retorna dados sem usuário autenticado
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint
    Então retorna o status 401 sem buscar planos 
