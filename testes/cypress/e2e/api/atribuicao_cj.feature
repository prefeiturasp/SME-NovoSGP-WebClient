# language: pt

Funcionalidade: API - Atribuição CJ

  Cenário: Busca as atribuições CJ
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint atribuições
    Então retorna atribuições CJ com status 200

  Cenário: Não busca as atribuições CJ sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET para o endpoint atribuições
    Então não retorna atribuições CJ mostrando o status 401

  Cenário: Cadastrar atribuição CJS com dados válidos
    Dado que possuo um token de acesso válido
    Quando envio uma requisição POST para cadastrar atribuições CJ
    Então retorna status 200 confirmando o cadastro

  Cenário: Código da disciplina deve ser preenchido
    Dado que possuo um token de acesso válido
    Quando envio a requisição do CJ com disciplina vazia
    Então deve retornar status 422 por não ter sido preenchido

  Cenário: Código da turma deve ser preenchido
    Dado que possuo um token de acesso válido
    Quando envio a requisição CJS com turma vazia
    Então deve retornar status 422 de sem preenchimento

  Cenário: Modalidade deve ser preenchida
    Dado que possuo um token de acesso válido
    Quando envio a requisição CJS com modalidade vazia
    Então deve retornar status 422 de sem modalidade

  Cenário: DRE deve ser preenchida
    Dado que possuo um token de acesso válido
    Quando envio a requisição CJS com DRE vazio
    Então deve retornar status 422 sem a DRE

  Cenário: UE deve ser preenchida
    Dado que possuo um token de acesso válido
    Quando envio a requisição CJS com UE vazio
    Então deve retornar status 422 sem a UE

  Cenário: Ano letivo deve ser preenchido
    Dado que possuo um token de acesso válido
    Quando envio a requisição CJS com ano letivo vazio
    Então deve retornar status 500 devido o ano ser obrigatório 

  Cenário: Cadastrar atribuição CJS com histórico false
    Dado que possuo um token de acesso válido
    Quando envio a requisição CJS com historico false
    Então o sistema deve retornar status 200 de cadastrado

  Cenário: Não cadastrar atribuições CJ sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento a requisição POST para cadastrar atribuições CJ
    Então não cadastra atribuições CJ mostrando o status 401

  Cenário: Buscar as atribuições CJ no ano letivo
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de atribuições CJ
    Então retorna o status 200 da busca no ano letivo

  Cenário: Não busca as atribuições CJ no ano letivo sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET para o endpoint de atribuições CJ
    Então não retorna no ano letivo mostrando o status 401

  Cenário: Buscar as atribuições CJ através dos dados de UE
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint com todos os campos
    Então retorna o status 200 com dados de UE de atribuições CJ

  Cenário: Ano letivo deve ser preenchido nos dados de UE nas atribuições
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint com os campos sem ano
    Então retorna o status 422 que ano letivo deve ser preenchido na atribuições CJ

  Cenário: Professores deve ser preenchido nos dados de UE nas atribuições
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint com os campos sem professores
    Então retorna o status 500 que professor deve ser preenchido na atribuições CJ

  Cenário: Turmas deve ser preenchido nos dados de UE nas atribuições
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint com os campos sem turmas
    Então retorna o status 500 que a turma deve ser preenchida na atribuições CJ

  Cenário: UEs deve ser preenchido nos dados de UE nas atribuições
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint com os campos sem UEs
    Então retorna o status 500 que a UE deve ser preenchida na atribuições CJ

  Cenário: Não busca as atribuições CJ dos dados de UE sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET para o endpoint com todos os campos
    Então não retorna dados de UE de atribuições CJ mostrando o status 401