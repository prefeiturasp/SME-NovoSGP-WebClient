# language: pt

Funcionalidade: API - Dashboard AEE de encaminhamentos deferidos

  Cenário: Retorna dados AEE de encaminhamentos deferidos
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint
    Então retorna o status 200 com os dados AEE de encaminhamentos deferidos

  Cenário: Ano letivo deve ser obrigatório no encaminhamentos deferidos
    Dado que login gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint sem o ano
    Então retorna o status 422 que o ano letivo é obrigatório no encaminhamentos deferidos
 
  Cenário: DRE deve ser obrigatório no encaminhamentos deferidos
    Dado que login gerou um token de acesso válido
    Quando tento a requisição GET sem a DRE
    Então retorna o status 422 que a DRE deve ser obrigatório no encaminhamentos deferidos

  Cenário: UE deve ser obrigatório no encaminhamentos deferidos
    Dado que login gerou um token de acesso válido
    Quando tento a requisição GET sem a UE
    Então retorna o status 422 que a UE deve ser obrigatório no encaminhamentos deferidos

  Cenário: Não retorna dados de encaminhamentos deferidos sem usuário autenticado
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint do dashboard AEE
    Então retorna o status 401 sem buscar de encaminhamentos deferidos
