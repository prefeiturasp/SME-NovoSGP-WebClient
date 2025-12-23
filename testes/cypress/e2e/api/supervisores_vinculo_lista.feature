# language: pt

Funcionalidade: API - Lista de vínculo de supervisores

  Cenário: Listar os vínculos através da DRE
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para endpoint de vínculo
    Então retorna o status 200 com supervisores da DRE

  Cenário: Listar os vínculos através da DRE e UE
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para endpoint de vínculo da DRE e UE
    Então retorna o status 200 com supervisores da abranagência

  Cenário: Listar os vínculos através da DRE, UE e supervisor
    Dado que possuo um token de acesso válido
    Quando envio a requisição GET para endpoint de vínculo da DRE e UE
    Então retorna o status 200 e os supervisores

  Cenário: UE não deve ter supervisor responsável
    Dado que possuo um token de acesso válido
    Quando envio a requisição GET para endpoint sem vínculo na DRE e UE
    Então retorna o status 200 sem supervisor responsável

  Cenário: Código da DRE deve ser obrigatório
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para endpoint de vínculo sem a DRE
    Então retorna o status 601 que não foi preenchido o código

  Cenário: Não retornar dados de vínculos de supervisores sem usuário autenticado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET para endpoint de vínculo
    Então retorna o status 401 sem os dados

