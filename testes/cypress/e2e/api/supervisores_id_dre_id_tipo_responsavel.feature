# language: pt

Funcionalidade: API - Lista de supervisores da DRE por tipo de responsável

  Cenário: Realiza a busca através do supervisor da DRE e tipo 1
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET com o tipo 1
    Então retorna o status 200 com supervisor da DRE

  Cenário: Realiza a busca através do supervisor da DRE e tipo 2
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET com o tipo 2
    Então retorna o status 200 com supervisor de DRE

  Cenário: Realiza a busca através do supervisor da DRE e tipo 3
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET com o tipo 3
    Então retorna o status 200 com supervisor DRE

  Cenário: Realiza a busca através do supervisor da DRE e tipo 4
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET com o tipo 4
    Então retorna o status 200 e supervisor da DRE

  Cenário: Realiza a busca através do supervisor da DRE e tipo 5
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET com o tipo 5
    Então retorna o status 200 ceom supervisor DRE

  Cenário: Tipo deve ser obrigatório
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para supervisores sem tipo
    Então carrega o status 500 que a DRE do responsável deve ser obrigatório

  Cenário: DRE deve ser obrigatório
    Dado que possuo um token de acesso válido
    Quando envio a requisição GET para supervisores sem dre
    Então carrega o status 500 que a DRE do responsável deve ser obrigatório

  Cenário: Supervisor deve ser obrigatório
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET sem supervisor
    Então carrega o status 500 que a DRE do responsável deve ser obrigatório

  Cenário: Não retornar dados sem usuário autenticado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET de supervisores responsável por tipo
    Então não retorna os tipos de supervisores mostrando o status 401

