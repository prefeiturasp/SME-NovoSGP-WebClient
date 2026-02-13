# language: pt

Funcionalidade: API - Dashboard compensações de ausência consideradas

  Cenário: Retorna dados da turma no bimestre
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint
    Então retorna o status 200 com os dados da turma no bimestre

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
    Então retorna o status 422 que UE é obrigatória

  Cenário: Modalidade deve ser obrigatório
    Dado que login gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint sem modalidade
    Então retorna o status 500 que a modalidade é obrigatória

  Cenário: Não retorna compensações de ausência consideradas sem usuário autenticado
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint
    Então retorna o status 401 sem buscar compensações de ausência consideradas
