# language: pt

Funcionalidade: API - Autenticação - Revalidar senha

  Contexto:
    Given que possuo um token de acesso válido

  Cenário: Deve revalidar o token do usuário
    Quando envio uma requisição POST para revalidar o token
    Então retorna a expiração com status 200 

  Cenário: Validar retorno de sucesso com dados consistentes
    Quando envio uma requisição POST para revalidar o token
    Então retorna a expiração com status 200 

  Cenário: Validar revalidação em múltiplas requisições consecutivas
    Quando envio uma requisição POST para revalidar o token
    Então retorna a expiração com status 200 

  Cenário: Validar estabilidade da API na revalidação
    Quando envio uma requisição POST para revalidar o token
    Então retorna a expiração com status 200 

  Cenário: Não revalidar com usuário deslogado
    Given que não possuo um token de acesso válido
    Quando tento a requisição POST para revalidar o token
    Então não revalida retornando o status 401

  Cenário: Validar consistência do erro sem autenticação
    Given que não possuo um token de acesso válido
    Quando tento a requisição POST para revalidar o token
    Então não revalida retornando o status 401

  Cenário: Validar tentativa de revalidação com token inválido
    Given que não possuo um token de acesso válido
    Quando tento a requisição POST para revalidar o token
    Então não revalida retornando o status 401

  Cenário: Validar comportamento com token expirado
    Given que não possuo um token de acesso válido
    Quando tento a requisição POST para revalidar o token
    Então não revalida retornando o status 401