# language: pt

Funcionalidade: API - Dashboard de acompanhamento aprendizagem por última consolidação

  Cenário: Retorna dashboard do ano letivo por última consolidação
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint com os dados
    Então retorna o status 200 carregando o dashboard do ano letivo por última consolidação

  Cenário: Ano letivo da última consolidação deve ser informado
    Dado que login gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint sem o ano
    Então retorna o status 422 que o ano letivo da última consolidação deve ser informado
 
  Cenário: Ano letivo deve ser inválido
    Dado que login gerou um token de acesso válido
    Quando tento a requisição GET com ano inválido
    Então retorna o status 500 que o ano letivo deve ser inválido

  Cenário: Não busca dashboard sem usuário autenticado
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint do dashboard
    Então retorna o status 401 sem buscar dashboard de acompanhamento
