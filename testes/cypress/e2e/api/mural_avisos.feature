# language: pt

Funcionalidade: API - Mural de avisos da aula

  Cenário: Retorna avisos da aula
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint o ID da aula
    Então retorna o mural de avisos com status 200

  Cenário: Não retorna avisos com código da turma vazio
    Dado que login gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint sem o ID da aula
    Então retorna o status 422 sem o mural de avisos
    
  Cenário: Não retorna avisos sem usuário autenticado
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint o ID da aula
    Então retorna o status 401 sem o mural de avisos