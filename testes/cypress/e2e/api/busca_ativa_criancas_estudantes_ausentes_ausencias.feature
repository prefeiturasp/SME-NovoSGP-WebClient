# language: pt

Funcionalidade: API - Filtros por período de ausências do estudante

  Cenário: Retornar a descrição e id das ausências
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET de ausências
    Então retorna o status 200 com todas as ausências descritas e id
  
  Cenário: Não retorna ausências quando estiver deslogado
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

  Cenário: Garantir que a lista de ausências não esteja vazia quando autenticado
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET de ausências
    Então retorna o status 200 com todas as ausências descritas e id

  Cenário: Garantir que cada ausência possua id e descrição
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET de ausências
    Então retorna o status 200 com todas as ausências descritas e id
  