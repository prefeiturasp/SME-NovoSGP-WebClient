# language: pt

Funcionalidade: API - Filtro de ciclos

  Cenário: Filtrar o ciclo de alfabetização
    Dado que possuo um token de acesso válido
    Quando envio uma requisição POST com anos de 1 até 3
    Então retorna o status 200 filtrando o ciclo de alfabetização

  Cenário: Filtrar o ciclo interdisciplinar
    Dado que possuo um token de acesso válido
    Quando envio uma requisição POST com anos de 4 até 6
    Então retorna o status 200 filtrando o ciclo interdisciplinar

  Cenário: Filtrar o ciclo autoral
    Dado que possuo um token de acesso válido
    Quando envio uma requisição POST com anos de 7 até 9
    Então retorna o status 200 filtrando o ciclo autoral

  Cenário: Filtro de ciclo inválido
    Dado que possuo um token de acesso válido
    Quando envio uma requisição POST com ano inexistente
    Então retorna o status 601 que o filtro de ciclo é inválido

  Cenário: Não retorna filtro de ciclo sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento a requisição POST para o endpoint de filtro de ciclo
    Então não retorna o filtro mostrando o status 401

