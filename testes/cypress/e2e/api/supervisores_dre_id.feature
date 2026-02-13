# language: pt

Funcionalidade: API - Lista de supervisores da DRE

  Cenário: Realiza a busca através do código da DRE
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET a lista de supervisores
    Então retorna o status 200 através do código da DRE

  Cenário: Realiza a busca através do código da DRE e tipo de responsável 1
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET a lista tipo do 1
    Então retorna o status 200 através do código da DRE

  Cenário: Realiza a busca através do código da DRE e tipo de responsável 2
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET a lista tipo do 2
    Então retorna o status 200 através do código DRE

  Cenário: Realiza a busca através do código da DRE e tipo de responsável 3
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET a lista tipo do 3
    Então retorna o status 200 através do código de DRE

  Cenário: Realiza a busca através do código da DRE e tipo de responsável 4
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET a lista tipo do 4
    Então retorna o status 200 através de código da DRE

   Cenário: Realiza a busca através do código da DRE e tipo de responsável 5
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET a lista tipo do 5
    Então retorna o status 200 através código da DRE

  Cenário: Não retorna dados sem usuário autenticado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET a lista de supervisores
    Então não retorna código da DRE mostrando o status 401

