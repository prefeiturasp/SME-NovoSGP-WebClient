# language: pt

Funcionalidade: API - Situação do usuário

  Cenário: Situações do usuário devem ser listadas
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de situações dos usuários
    Então retorna o status 200 listando todas disponíveis

  Cenário: Não acessar sem autenticação
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint de situações dos usuários
    Então retorna o status 401

