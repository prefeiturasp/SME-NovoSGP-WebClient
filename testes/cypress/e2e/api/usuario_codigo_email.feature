# language: pt

Funcionalidade: API - Atualizar email de usuários através do codigoRf

  Cenário: Deve inserir um novo e-mail para o usuário
    Dado que o usuário é autenticado
    Quando envio uma requisição PUT para alterar o e-mail
    Então retorna o status 200 com o novo e-mail

  Cenário: Não inserir e-mail para usuário inexistente
    Dado que o usuário é autenticado
    Quando envio uma requisição PUT
    E o usuário inserido é inexistente
    Então retorna o status 601 informando erro ao obter dados

  Cenário: E-mail para o usuário deve ser informado
    Dado que o usuário é autenticado
    Quando envio uma requisição PUT com usuário
    E não informo um novo e-mail
    Então retorna o status 422 que o e-mail deve informado

  Cenário: Não permitir e-mail inválido
    Dado que o usuário é autenticado
    Quando envio uma requisição PUT para alterar
    E insiro e-mail inválido
    Então retorna o status 422 que o e-mail é inválido

  Cenário: Não atualizar e-mail sem autenticação
    Dado que o usuário não é autenticado
    Quando tento a requisição PUT para alterar o e-mail
    Então retorna o status 401 de não autorizado