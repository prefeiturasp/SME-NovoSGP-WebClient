# language: pt

Funcionalidade: API - Listar ocorrências

  Cenário: Listar todas as ocorrências
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint buscar
    Então o corpo da resposta deve conter todos tipos de ocorrências com status 200

  Cenário: Não permitir acessar sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento enviar uma requisição GET para o endpoint
    Então a consulta de tipos de ocorrências deve ter o status 401

