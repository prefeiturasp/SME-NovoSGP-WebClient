# language: pt

Funcionalidade: API - Atribuir supervisor responsável a UE

  Cenário: Realizar a atribuição do supervisor na UE
    Dado que possuo um token de acesso válido
    Quando envio uma requisição POST no endpoiint de atribuição responsável
    Então retorna o status 200 associando o supervisor na UE

  Cenário: DRE deve ser obrigatório
    Dado que possuo um token de acesso válido
    Quando envio uma requisição POST no endpoiint de atribuição sem a DRE
    Então retorna o status 422 que código da DRE do responsável deve ser informado

  Cenário: Responsável deve ser obrigatório
    Dado que possuo um token de acesso válido
    Quando envio uma requisição POST no endpoiint de atribuição sem responsável
    Então retorna o status 422 que responsável deve ser informado

  Cenário: UE deve ser obrigatório
    Dado que possuo um token de acesso válido
    Quando envio uma requisição POST no endpoiint de atribuição sem UE
    Então retorna o status 601 que código da UE do responsável deve ser informado

  Cenário: Tipo de responsável deve ser obrigatório
    Dado que possuo um token de acesso válido
    Quando envio uma requisição POST no endpoiint de atribuição sem tipo
    Então retorna o status 601 que tipo do responsável deve ser informado

  Cenário: Não retorna dados sem usuário autenticado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição POST no endpoiint de atribuição responsável
    Então não associa o supervisor na UE mostrando o status 401

