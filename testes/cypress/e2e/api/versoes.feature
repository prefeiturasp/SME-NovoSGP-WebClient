# language: pt

Funcionalidade: API - Versão do sistema

  Cenário: Retornar versão atual do sistema
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de versão
    Então retorna o status 200 com a atual

  Cenário: Não acessar a versão sem autenticação
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint de versões
    Então retorna o status 401

  Cenário: Realizar o teste de ping
    Dado que acesso o endpoint
    Quando envio uma requisição GET para testar o ping
    Então retorna o status 200

