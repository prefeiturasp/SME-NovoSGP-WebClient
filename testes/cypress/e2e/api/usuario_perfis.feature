# language: pt

Funcionalidade: API - Perfis do usuário

  Cenário: Usuário logado deve possuir perfil selecionado
    Dado que o usuário é autenticado
    Quando envio uma requisição GET para o endpoint de perfil
    Então retorna o status 200 com perfil do usuário

  Cenário: Não acessa perfil sem autenticação
    Dado que o usuário não é autenticado
    Quando tento a requisição GET para o endpoint de perfil
    Então retorna o status 401 sem perfil associado