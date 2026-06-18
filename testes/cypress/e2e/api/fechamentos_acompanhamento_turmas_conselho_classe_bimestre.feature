# language: pt

Funcionalidade: API - Fechamento - Acompanhamento de turmas, conselho de classe e bimestre

  Cenário: Retorna dados através da situação do conselho de classe
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o status 200 com dados através da situação do conselho de classe

  Cenário: Garantir que o retorno contenha estrutura válida do conselho de classe
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o status 200 com dados através da situação do conselho de classe

  Cenário: Garantir que os dados estejam corretamente vinculados à turma e ao bimestre
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o status 200 com dados através da situação do conselho de classe

  Cenário: Garantir que a situação do conselho seja coerente com o bimestre informado
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o status 200 com dados através da situação do conselho de classe

  Cenário: Garantir que não existam campos obrigatórios nulos no retorno
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o status 200 com dados através da situação do conselho de classe

  Cenário: Não retorna dados com código da turma inválido
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET sem turma
    Então retorna o status 500 sem dados da turma no bimestre

  Cenário: Não realizar acompanhamento sem informar a turma
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET sem turma
    Então retorna o status 500 sem dados da turma no bimestre

  Cenário: Não retorna dados com código do bimestre inválido
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET sem bimestre
    Então retorna o status 601 sem dados da turma no bimestre

  Cenário: Não realizar acompanhamento sem informar o bimestre
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET sem bimestre
    Então retorna o status 601 sem dados da turma no bimestre

  Cenário: Não retorna dados com conselho de classe inválido
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET sem a classe
    Então retorna o status 422 sem dados do conselho de classe

  Cenário: Não realizar acompanhamento com conselho de classe inválido
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET sem a classe
    Então retorna o status 422 sem dados do conselho de classe

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