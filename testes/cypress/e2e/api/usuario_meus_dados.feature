# language: pt

Funcionalidade: API - Dados do usuário

  Cenário: Retorna os dados do usuário após autenticação
    Dado que o usuário é autenticado
    Quando envio uma requisição GET para o endpoint de dados da autenticação
    Então retorna o status 200 com informações do usuário

  Cenário: Não retorna dados para usuário não autenticado
    Dado que o usuário não é autenticado
    Quando tento a requisição GET para o endpoint
    Então retorna o status 401 sem dados do usuário