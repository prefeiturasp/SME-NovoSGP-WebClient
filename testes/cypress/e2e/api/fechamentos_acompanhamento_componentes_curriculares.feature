# language: pt

Funcionalidade: API - Fechamento - Acompanhamento da turma, aluno e componentes curriculares e situação do fechamento

  Cenário: Retorna dados através da situação do fechamento, turma e bimestre
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o status 200 através da situação do fechamento, turma e bimestre

  Cenário: Garantir que o retorno contenha estrutura válida do acompanhamento
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o status 200 através da situação do fechamento, turma e bimestre

  Cenário: Garantir que os dados estejam corretamente vinculados à turma e ao bimestre
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o status 200 através da situação do fechamento, turma e bimestre

  Cenário: Garantir que os alunos retornem com campos obrigatórios preenchidos
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o status 200 através da situação do fechamento, turma e bimestre

  Cenário: Garantir que os componentes curriculares estejam associados corretamente aos alunos
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o status 200 através da situação do fechamento, turma e bimestre

  Cenário: Garantir que a situação do fechamento esteja coerente com os dados retornados
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o status 200 através da situação do fechamento, turma e bimestre

  Cenário: Não retorna dados com código da turma inválida
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET com turma inválida
    Então não retorna os dados exibindo o status 601

  Cenário: Não realizar acompanhamento com turma inválida
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET com turma inválida
    Então não retorna os dados exibindo o status 601

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