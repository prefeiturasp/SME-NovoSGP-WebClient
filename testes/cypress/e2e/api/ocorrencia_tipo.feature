# language: pt

Funcionalidade: API - Tipos de ocorrências

  Cenário: Retornar os ids e tipos de ocorrências
    Dado que login gerou um token de acesso válido
    Quando envio a requisição GET para o endpoint de ocorrências
    Então retorna o status 200 com os ids e tipos

  Cenário: Não acessar os tipos de ocorrências sem autenticação
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint de ocorrências
    Então retorna o status 401 sem os ids e tipos