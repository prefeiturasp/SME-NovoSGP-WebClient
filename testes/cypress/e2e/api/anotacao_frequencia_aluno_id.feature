# language: pt

Funcionalidade: API - Cadastro e alteração das anotações de frequência do aluno 

  Cenário: Alterar anotações através do id aluno
    Dado que possuo um token de acesso válido de CP
    Quando envio uma requisição PUT para o endpoint de alterar anotações
    Então retorna o status 200 que foi alterado para o aluno


  Cenário: Aluno é obrigatório para alterar anotações 
    Dado que possuo um token de acesso válido de CP
    Quando envio uma requisição PUT para o endpoint de alterar anotações sem id aluno
    Então retorna o status 405 que o metódo não foi aceito


  Cenário: Motivo é obrigatório para alterar anotações 
    Dado que possuo um token de acesso válido de CP
    Quando envio uma requisição PUT para o endpoint de alterar anotações sem motivo
    Então retorna o status 500 que não foi processado


  Cenário: Anotação é obrigatório para alteração 
    Dado que possuo um token de acesso válido de CP
    Quando envio uma requisição PUT para o endpoint de alterar sem anotação
    Então retorna o status 500 sem alterar devido anotação


  Cenário: Não altera anotações através do id aluno sem autenticação
    Dado que não possuo um token de acesso válido de CP
    Quando tento uma requisição PUT para o endpoint de alterar anotações
    Então retorna o status 401 sem alteração para o aluno


  Cenário: Cadastra anotações através do aluno
    Dado que possuo um token de acesso válido de CP
    Quando envio uma requisição POST para o endpoint de cadastro de anotações
    Então retorna o status 200 que foi salvo com sucesso


  Cenário: Id do motivo de ausência é obrigatório
    Dado que possuo um token de acesso válido de CP
    Quando envio uma requisição POST para o endpoint de cadastro sem id do motivo
    Então retorna o status 422 que o id da ausência é obrigatório


  Cenário: Id da aula é obrigatório
    Dado que possuo um token de acesso válido de CP
    Quando envio uma requisição POST para o endpoint de cadastro sem o id aula
    Então retorna o status 422 que deve informar a aula


  Cenário: Id do componente curricular é obrigatório
    Dado que possuo um token de acesso válido de CP
    Quando envio uma requisição POST para o endpoint de cadastro sem id do componente
    Então retorna o status 422 que deve informar o componente


  Cenário: Código do aluno é obrigatório
    Dado que possuo um token de acesso válido de CP
    Quando envio uma requisição POST para o endpoint de cadastro sem código aluno
    Então retorna o status 422 que o valor do código deve ser informado


  Cenário: Se turma é infantil deve estar preenchido 
    Dado que possuo um token de acesso válido de CP
    Quando envio uma requisição POST para o endpoint de cadastro o infantil
    Então retorna o status 422 que o valor é esperado


  Cenário: Não cadastra anotações através do id aluno sem autenticação
    Dado que não possuo um token de acesso válido de CP
    Quando tento uma requisição POST para o endpoint de cadastro de anotações
    Então retorna o status 401 sem cadastrar anotação para o aluno
    

  Cenário: Alteração pode ser realizada mais de uma vez com sucesso
    Dado que possuo um token de acesso válido de CP
    Quando envio uma requisição PUT para o endpoint de alterar anotações
    Então retorna o status 200 que foi alterado para o aluno


  Cenário: Continua bloqueando alteração sem autenticação
    Dado que não possuo um token de acesso válido de CP
    Quando tento uma requisição PUT para o endpoint de alterar anotações
    Então retorna o status 401 sem alteração para o aluno


  Cenário: Continua bloqueando cadastro sem autenticação
    Dado que não possuo um token de acesso válido de CP
    Quando tento uma requisição POST para o endpoint de cadastro de anotações
    Então retorna o status 401 sem cadastrar anotação para o aluno


  Cenário: Cadastro pode ser realizado novamente com sucesso
    Dado que possuo um token de acesso válido de CP
    Quando envio uma requisição POST para o endpoint de cadastro de anotações
    Então retorna o status 200 que foi salvo com sucesso
