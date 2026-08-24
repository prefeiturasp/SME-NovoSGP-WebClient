# language: pt

Funcionalidade: API - Fechamento - Acompanhamento por turmas, conselho de classe, bimestre e alunos

  Cenário: Retorna dados através da situação do conselho de classe e alunos
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o status 200 através do conselho de classe e alunos

  Cenário: Garantir que o retorno contenha estrutura válida do acompanhamento
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o status 200 através do conselho de classe e alunos

  Cenário: Garantir que os dados estejam vinculados corretamente à turma e ao bimestre
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o status 200 através do conselho de classe e alunos

  Cenário: Garantir que os alunos retornem com campos obrigatórios preenchidos
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o status 200 através do conselho de classe e alunos

  Cenário: Garantir que a situação do conselho de classe esteja coerente com os alunos retornados
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o status 200 através do conselho de classe e alunos

  Cenário: Garantir que não existam inconsistências entre conselho de classe e bimestre informado
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o status 200 através do conselho de classe e alunos

  Cenário: Não retorna dados com código da turma inválida
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET com turma inválida
    Então não retorna os dados exibindo o status 601

  Cenário: Não realizar acompanhamento com turma inválida
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET com turma inválida
    Então não retorna os dados exibindo o status 601

  Cenário: Não retorna dados com código do bimestre inválido
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET com bimestre inválido
    Então não retorna as informações exibindo o status 500

  Cenário: Não realizar acompanhamento com bimestre inválido
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET com bimestre inválido
    Então não retorna as informações exibindo o status 500

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