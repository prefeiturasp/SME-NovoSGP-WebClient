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

  Cenário: Listar todas as ocorrências
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint buscar
    Então o corpo da resposta deve conter todos tipos de ocorrências com status 200

  Cenário: Não permitir acessar sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento enviar uma requisição GET para o endpoint
    Então a consulta de tipos de ocorrências deve ter o status 401