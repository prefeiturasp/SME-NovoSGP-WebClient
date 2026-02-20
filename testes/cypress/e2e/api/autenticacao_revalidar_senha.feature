# language: pt

Funcionalidade: API - Autenticação - Revalidar senha

  Cenário: Deve revalidar o token do usuário
    Given que possuo um token de acesso válido
    Quando envio uma requisição POST para revalidar o token
    Então retorna a expiração com status 200 

  Cenário: Não revalidar com usuário deslogado
    Given que não possuo um token de acesso válido
    Quando tento a requisição POST para revalidar o token
    Então não revalida retornando o status 401


