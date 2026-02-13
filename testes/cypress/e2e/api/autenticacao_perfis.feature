# language: pt

Funcionalidade: API - Autenticação de id do perfil do usuário

  Cenário: Selecionar perfil válido para o usuário
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição PUT para o endpoint de autenticação do perfil
    Então retorna o id com status 200

  Cenário: Não permitir selecionar perfil inválido
    Dado que login gerou um token de acesso válido
    Quando tento a requisição PUT para o endpoint com perfil inválido
    Então retorna o status 422

  Cenário: Não selecionar perfil sem autenticação
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição PUT para o endpoint de autenticação do perfil
    Então retorna o status 401

<<<<<<< HEAD
  Cenário: Realizar seleção de perfil válido mais de uma vez
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição PUT para o endpoint de autenticação do perfil
    Então retorna o id com status 200

  Cenário: Garantir que perfil inválido sempre retorna erro
    Dado que login gerou um token de acesso válido
    Quando tento a requisição PUT para o endpoint com perfil inválido
    Então retorna o status 422

  Cenário: Não permitir seleção de perfil com token inválido
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição PUT para o endpoint de autenticação do perfil
    Então retorna o status 401


=======
>>>>>>> 30bf60295d01cd530ce194fd0d6be7b5374d3805
