# language: pt

Funcionalidade: API - Modalidades da UE no ano letivo

  Cenário: Retorna dados de UE através do código
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de modalidades da UE
    Então retorna os dados da UE com status 200

  Cenário: Ano letivo deve ser obrigatório
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint sem o ano letivo
    Então retorna o status 422 sem os dados da turma

  Cenário: Não retornar dados sem usuário autenticado
    Dado que não possuo um token de acesso válido
    Quando tento uma requisição GET para o endpoint de modalidades
    Então não retorna os dados da UE com status 401

