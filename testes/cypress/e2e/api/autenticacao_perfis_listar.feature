# language: pt

Funcionalidade: API - Listar perfis do usuário

  Cenário: Listar as informações de perfil após autenticação
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de listar perfis
    Então retorna os dados de todos perfis do usuário com status 200

  Cenário: Sem dados de perfis quando usuário não está autenticado
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint de listar perfis
    Então retorna o status 401 sem dados de perfis

  Cenário: Realizar múltiplas consultas de perfis com token válido
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de listar perfis
    Então retorna os dados de todos perfis do usuário com status 200

  Cenário: Garantir que não retorna perfis com token inválido
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint de listar perfis
    Então retorna o status 401 sem dados de perfis
