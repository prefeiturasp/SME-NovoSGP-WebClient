# language: pt

Funcionalidade: API - Fechamento - Pendências de turma e bimestre através do componentes curriculares

  Cenário: Retorna dados de pendência do componente curricular
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o status 200 com as pendências do componente curricular

  Cenário: Garantir que o retorno contenha estrutura válida das pendências
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o status 200 com as pendências do componente curricular

  Cenário: Garantir que as pendências estejam vinculadas corretamente à turma e bimestre
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o status 200 com as pendências do componente curricular

  Cenário: Garantir que não existam campos obrigatórios nulos nas pendências
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o status 200 com as pendências do componente curricular

  Cenário: Garantir que a lista de pendências esteja consistente quando houver dados
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o status 200 com as pendências do componente curricular

  Cenário: Não retorna pendência do componente curricular sem usuário autenticado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET
    Então não retorna pendência do componente curricular mostrando o status 401

  Cenário: Não retorna pendência com token inválido
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET
    Então não retorna pendência do componente curricular mostrando o status 401

  Cenário: Não retorna pendência com token expirado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET
    Então não retorna pendência do componente curricular mostrando o status 401