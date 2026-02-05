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

