# language: pt

Funcionalidade: API - Cache chaves

  Cenário: Retornar os dados de cache chaves
    Dado que acesso o endpoint de cache
    Quando envio uma requisição GET
    Então retorna o status 200 com as chaves

  Cenário: Garantir que a lista de chaves não esteja vazia
    Dado que acesso o endpoint de cache
    Quando envio uma requisição GET
    Então retorna o status 200 com as chaves

  Cenário: Garantir que cada item possua chave e valor
    Dado que acesso o endpoint de cache
    Quando envio uma requisição GET
    Então retorna o status 200 com as chaves

  Cenário: Não permitir acesso ao cache sem autenticação
    Dado que acesso o endpoint de cache
    Quando envio uma requisição GET
    Então retorna o status 200 com as chaves

  Cenário: Não permitir acesso ao cache com token inválido
    Dado que acesso o endpoint de cache
    Quando envio uma requisição GET
    Então retorna o status 200 com as chaves
