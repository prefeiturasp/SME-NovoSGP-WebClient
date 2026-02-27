# language: pt

Funcionalidade: API - Dashboard de devolutivas DRE

  Cenário: Retorna dados da DRE
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint
    Então retorna o status 200 com os dados da DRE

  Cenário: Garantir que o retorno contenha estrutura válida da DRE
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint
    Então retorna o status 200 com os dados da DRE

  Cenário: Garantir que os dados estejam consolidados corretamente por DRE
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint
    Então retorna o status 200 com os dados da DRE

  Cenário: Ano deve ser obrigatório
    Dado que login gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint sem o ano
    Então retorna o status 422 que o ano letivo é obrigatório

  Cenário: Não retornar dados quando ano não for informado
    Dado que login gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint sem o ano
    Então retorna o status 422 que o ano letivo é obrigatório

  Cenário: Não retorna dados da DRE sem usuário autenticado
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint
    Então retorna o status 401 sem buscar dados da DRE

  Cenário: Não retorna dados com token inválido
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint
    Então retorna o status 401 sem buscar dados da DRE

  Cenário: Não retorna dados com token expirado
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint
    Então retorna o status 401 sem buscar dados da DRE
