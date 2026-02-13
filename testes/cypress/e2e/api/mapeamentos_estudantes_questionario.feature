# language: pt

Funcionalidade: API - Mapeamentos de estudantes - Questionários - ID

  Cenário: Retorna os dados referente ao ID do questionário
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o status 200 com dados referente ao ID do questionário

  Cenário: Não retorna dados sem usuário autenticado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET
    Então não retorna os dados mostrando o status 401

