# language: pt

Funcionalidade: API - Dashboard de devolutivas DRE

  Cenário: Retorna dados da DRE
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint
    Então retorna o status 200 com os dados da DRE

  Cenário: Ano deve ser obrigatório
    Dado que login gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint sem o ano
    Então retorna o status 422 que o ano letivo é obrigatório

  Cenário: Não retorna dados da DRE sem usuário autenticado
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint
    Então retorna o status 401 sem buscar dados da DRE
