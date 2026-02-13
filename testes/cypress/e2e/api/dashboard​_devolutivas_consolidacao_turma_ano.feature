# language: pt

Funcionalidade: API - Dashboard de devolutivas consolidação por turma e ano

  Cenário: Retorna dados da turma no ano
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint
    Então retorna o status 200 com os dados da turma no ano

  Cenário: Ano letivo deve ser obrigatório
    Dado que login gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint sem o ano
    Então retorna o status 422 que o ano letivo é obrigatório

  Cenário: Modalidade deve ser obrigatório
    Dado que login gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint sem modalidade
    Então retorna o status 500 que a modalidade é obrigatória

  Cenário: Não retorna dados da turma no ano sem usuário autenticado
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint
    Então retorna o status 401 sem buscar dados da turma no ano
