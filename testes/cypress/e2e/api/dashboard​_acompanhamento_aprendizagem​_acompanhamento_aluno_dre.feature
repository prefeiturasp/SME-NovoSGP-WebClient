# language: pt

Funcionalidade: API - Dashboard de acompanhamento aprendizagem por aluno e DRE

  Cenário: Retornar dashboard de acompanhamento do aluno e DRE
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de acompanhamento de aprendizagem
    Então retorna o status 200 com dados por aluno e DRE

  Cenário: Não retorna dados sem usuário autenticado
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint de acompanhamento de aprendizagem
    Então retorna o status 401 sem dados por aluno e DRE

  Cenário: Não retornar dados com token inválido
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint de acompanhamento de aprendizagem
    Então retorna o status 401 sem dados por aluno e DRE

  Cenário: Não retornar dados com token expirado
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint de acompanhamento de aprendizagem
    Então retorna o status 401 sem dados por aluno e DRE

  Cenário: Ano letivo deve ser informado
    Dado que login gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint de dashboard de aprendizagem
    E não insiro o ano letivo
    Então retorna o status 422 sem os dados de acompanhamento por aluno e DRE

  Cenário: Garantir que o retorno contenha dados estruturados por aluno e DRE
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de acompanhamento de aprendizagem
    Então retorna o status 200 com dados por aluno e DRE

  Cenário: Garantir que não retorne dados quando houver erro de validação
    Dado que login gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint de dashboard de aprendizagem
    E não insiro o ano letivo
    Então retorna o status 422 sem os dados de acompanhamento por aluno e DRE
