# language: pt

Funcionalidade: API - Fechamento - Acompanhamento por turmas e bimestre

  Cenário: Retorna dados da turma no bimestre
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o status 200 com dados da turma no bimestre

  Cenário: Garantir que o retorno contenha estrutura válida do acompanhamento por turma
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o status 200 com dados da turma no bimestre

  Cenário: Garantir que os dados estejam vinculados corretamente ao bimestre informado
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o status 200 com dados da turma no bimestre

  Cenário: Garantir que os totalizadores estejam coerentes com os dados retornados
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o status 200 com dados da turma no bimestre

  Cenário: Garantir que não existam campos obrigatórios nulos no retorno
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o status 200 com dados da turma no bimestre

  Cenário: Não retorna dados sem usuário autenticado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET
    Então não retorna os dados mostrando o status 401

  Cenário: Não retorna dados com token inválido
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET
    Então não retorna os dados mostrando o status 401

  Cenário: Não retorna dados com token expirado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET
    Então não retorna os dados mostrando o status 401

