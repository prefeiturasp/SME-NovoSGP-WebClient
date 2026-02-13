# language: pt

Funcionalidade: API - Autenticação do primeiro acesso

  Cenário: Realizar o primeiro acesso do usuário
    Dado que minhas credenciais geraram um token válido
    Quando envio uma requisição POST para o endpoint de primeiro acesso
    Então retorna a confirmação no status 200

  Cenário: Confirmação deve ser igual a nova senha
    Dado que insiro minhas credenciais
    E a confirmação não é igual a senha
    Quando tento a requisição POST para o endpoint de primeiro acesso
    Então retorna o status 422 com a mensagem de senhas diferentes

  Cenário: Não permitir cadastro de senha vazia
    Dado que insiro as credenciais sem a nova senha
    Quando tento a requisição POST para o endpoint com perfil inválido
    Então retorna o status 422 com a mensagem de senha obrigatória

  Cenário: Não realizar o primeiro acesso sem autenticação
    Dado que minhas credenciais não autenticaram
    Quando tento a requisição PUT para o endpoint sem usuário
    Então retorna o status 401

