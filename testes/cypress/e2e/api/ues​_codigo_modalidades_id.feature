# language: pt

Funcionalidade: API - Modalidades na UE através do ID no ano letivo

  Cenário: Retorna dados da modalidade no ano letivo
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de modalidades
    Então retorna os dados do ano letivo com status 200

  Cenário: Retorna dados das modalidades da UE no ano letivo
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de modalidades da UE
    Então retorna o status 200 com os dados da turma

  Cenário: UE deve ser obrigatório
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de modalidades sem UE
    Então retorna o status 422 sem os dados do ano

  Cenário: Ano letivo deve ser obrigatório
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de modalidades sem o ano
    Então retorna o status 422 sem da UE

  Cenário: Não retorna dados dados da modalidade no ano letivo sem usuário autenticado
    Dado que não possuo um token de acesso válido
    Quando tento uma requisição GET para o endpoint de modalidades
    Então não retorna os dados da UE com status 401

