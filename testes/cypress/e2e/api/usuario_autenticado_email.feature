# language: pt

Funcionalidade: API - Autenticação do e-mail de usuário

  Cenário: Confirmar que o e-mail foi autenticado
    Dado que possuo um token de acesso válido
    Quando envio uma requisição PUT para autenticar o e-mail
    Então retorna o status 200 confirmando

  Cenário: E-mail para o usuário deve ser informado
    Dado que possuo um token de acesso válido
    Quando envio uma requisição PUT com usuário
    E não informo o e-mail
    Então retorna o status 422 que o e-mail deve informado

  Cenário: Não autenticar e-mail inválido
    Dado que possuo um token de acesso válido
    Quando envio uma requisição PUT para autenticar com usuário
    E insiro e-mail inválido
    Então retorna o status 422 que o e-mail é inválido

  Cenário: Não autenticar usuário deslogado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição PUT para autenticar o e-mail
    Então retorna o status 401 de não autorizado