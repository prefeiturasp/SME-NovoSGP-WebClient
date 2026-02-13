# language: pt

Funcionalidade: API - Dashboard AEE de encaminhamentos situações

  Cenário: Retorna dados AEE das situações
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint
    Então retorna o status 200 com os dados AEE das situações

  Cenário: Ano letivo é obrigatório no AEE das situações
    Dado que login gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint sem o ano
    Então retorna o status 422 que o ano letivo é obrigatório no AEE das situações

  Cenário: DRE deve ser obrigatório no AEE das situações
    Dado que login gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint sem o DRE
    Então retorna o status 422 que DRE é obrigatório no AEE das situações

  Cenário: UE deve ser obrigatório no AEE das situações
    Dado que login gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint sem UE
    Então retorna o status 422 que o ano letivo é obrigatório no AEE das situações

  Cenário: Não retorna dados sem usuário autenticado
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint
    Então retorna o status 401 sem buscar AEE das situações
