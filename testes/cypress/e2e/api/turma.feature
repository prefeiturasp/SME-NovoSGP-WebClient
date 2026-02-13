# language: pt

Funcionalidade: API - Retorna a turma por código, ano letivo, tipo de calendário, modalidade e UE

  Cenário: Buscar alunos da turma no ano letivo
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de código da turma com ano letivo
    Então retorna os dados de todos alunos com status 200

  Cenário: Não buscar alunos com turma inválida
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de código da turma inválida
    Então retorna a mensagem de erro com status 601 sem os dados de alunos

  Cenário: Código da turma deve ser obrigatório
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint sem código da turma
    Então não retorna os dados de alunos com status 500

  Cenário: Ano letivo deve ser obrigatório
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint sem ano letivo
    Então não retorna os dados de alunos com status 500

  Cenário: Não busca os dados da turma sem autenticação
    Dado que não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint de código da turma com ano letivo
    Então retorna o status 401 sem dados dos alunos

  Cenário: Buscar tipo de calendário
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de tipo de calendário
    Então retorna o status 200 com nome junto ao id
  
  Cenário: Código da turma deve ser obrigatório no tipo de calendário
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint sem turma no tipo de calendário
    Então retorna o status 404 sem dados do calendário

  Cenário: Não buscar tipo de calendário com turma inválida
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint com turma inválida no tipo de calendário
    Então retorna a mensagem de erro com status 601 sem os tipos

  Cenário: Não busca o tipo de calendário sem autenticação
    Dado que não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint o tipo de calendário
    Então retorna o status 401 sem dados de calendário

  Cenário: Buscar modalidades da turma
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de modalidades
    Então retorna o status 200 com código junto a descrição

  Cenário: Não busca modalidades da turma sem autenticação
    Dado que não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint de modalidades
    Então retorna o status 401 sem dados de modalidades

  Cenário: Buscar turmas de sondagem da UE 
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de sondagem da UE
    Então retorna o status 200 com código da turma junto ao nome

  Cenário: Ano deve ser obrigatório na sondagem da UE 
    Dado que login gerou um token de acesso válido
    Quando tento uma requisição GET para o endpoint de sondagem sem ano
    Então retorna o status 422 com mensagem de ano inválido

  Cenário: UE deve ser obrigatório na sondagem da UE 
    Dado que login gerou um token de acesso válido
    Quando tento uma requisição GET para o endpoint de sondagem sem UE
    Então retorna o status 404 sem dados de UE

  Cenário: Não busca sondagem da turma sem autenticação
    Dado que não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint de sondagem
    Então retorna o status 401 sem dados de sondagem

  Cenário: Retornar listagem de turmas
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de listagem de turmas
    Então retorna o status 200 com itens, total de páginas e total de registros

  Cenário: Não retornar listagem de turmas sem ano letivo
    Dado que login gerou um token de acesso válido
    Quando tento uma requisição GET para o endpoint da listagem sem ano
    Então retorna o status 422 que o ano está inválido

  Cenário: Não retornar listagem de turmas sem modalidade
    Dado que login gerou um token de acesso válido
    Quando tento uma requisição GET para o endpoint da listagem sem modalidade
    Então retorna o status 500 que a modalidade está inválida

  Cenário: Não retornar listagem de turmas sem bimestre
    Dado que login gerou um token de acesso válido
    Quando tento uma requisição GET para o endpoint da listagem sem o bimestre
    Então retorna o status 422 que o bimestre está inválido

  Cenário: Retornar listagem de turmas sem histórico
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de listagem sem histórico
    Então retorna o status 200

  Cenário: Não listar turmas sem autenticação
    Dado que não gerou um token de acesso válido
    Quando tento uma requisição GET para o endpoint de listagem
    Então retorna o status 401