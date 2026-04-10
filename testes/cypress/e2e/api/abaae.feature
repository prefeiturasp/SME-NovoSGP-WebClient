# language: pt

Funcionalidade: API - ABAE

  Cenário: Não cadastrar usuário com dados inválidos
    Dado que possuo um token de acesso válido
    Quando envio uma requisição POST de usuário inválida
    Então retorna status 500 de erro

  Cenário: Não cadastrar usuário com CPF inválido
    Dado que possuo um token de acesso válido
    Quando envio uma requisição POST de usuário inválida
    Então retorna status 500 de erro

  Cenário: Não cadastrar usuário com email inválido
    Dado que possuo um token de acesso válido
    Quando envio uma requisição POST de usuário inválida
    Então retorna status 500 de erro

  Cenário: Não cadastrar usuário sem nome
    Dado que possuo um token de acesso válido
    Quando envio uma requisição POST de usuário inválida
    Então retorna status 500 de erro

  Cenário: Não cadastrar usuário sem UE
    Dado que possuo um token de acesso válido
    Quando envio uma requisição POST de usuário inválida
    Então retorna status 500 de erro

  Cenário: Não cadastrar usuário com DRE inválida
    Dado que possuo um token de acesso válido
    Quando envio uma requisição POST de usuário inválida
    Então retorna status 500 de erro

  Cenário: Não cadastrar usuário com CEP inválido
    Dado que possuo um token de acesso válido
    Quando envio uma requisição POST de usuário inválida
    Então retorna status 500 de erro

  Cenário: Não cadastrar usuário com campos obrigatórios ausentes
    Dado que possuo um token de acesso válido
    Quando envio uma requisição POST de usuário inválida
    Então retorna status 500 de erro