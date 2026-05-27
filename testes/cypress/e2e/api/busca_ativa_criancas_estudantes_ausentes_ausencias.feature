# language: pt

Funcionalidade: API - Filtros por período de ausências do estudante

  Contexto:
    Dado que login gerou um token de acesso válido

  Cenário: Retornar a descrição e id das ausências
    Quando envio uma requisição GET de ausências
    Então retorna o status 200 com todas as ausências descritas e id
  
  Cenário: Garantir que a lista de ausências não esteja vazia quando autenticado
    Quando envio uma requisição GET de ausências
    Então retorna o status 200 com todas as ausências descritas e id

  Cenário: Garantir que cada ausência possua id e descrição
    Quando envio uma requisição GET de ausências
    Então retorna o status 200 com todas as ausências descritas e id

  Cenário: Validar consistência dos dados retornados
    Quando envio uma requisição GET de ausências
    Então retorna o status 200 com todas as ausências descritas e id

  Cenário: Validar comportamento em múltiplas requisições consecutivas
    Quando envio uma requisição GET de ausências
    Então retorna o status 200 com todas as ausências descritas e id

  Cenário: Validar estabilidade da API ao consultar ausências
    Quando envio uma requisição GET de ausências
    Então retorna o status 200 com todas as ausências descritas e id

  Cenário: Não retorna ausências quando estiver deslogado
    Dado que não login não gerou um token de acesso válido
    Quando tento uma requisição GET de ausências
    Então retorna o status 401 a descrição e id

  Cenário: Validar consistência do erro sem autenticação
    Dado que não login não gerou um token de acesso válido
    Quando tento uma requisição GET de ausências
    Então retorna o status 401 a descrição e id

  Cenário: Não retornar ausências com token inválido
    Dado que não login não gerou um token de acesso válido
    Quando tento uma requisição GET de ausências
    Então retorna o status 401 a descrição e id

  Cenário: Não retornar ausências com token expirado
    Dado que não login não gerou um token de acesso válido
    Quando tento uma requisição GET de ausências
    Então retorna o status 401 a descrição e id