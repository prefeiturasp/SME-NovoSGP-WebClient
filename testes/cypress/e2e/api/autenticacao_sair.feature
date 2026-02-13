# language: pt

Funcionalidade: API - Autenticação do logout

  Cenário: Confirmar o logout do usuário
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para deslogar
    Então retorna o status 200 de sucesso

  Cenário: Não confirmar quando estiver deslogado
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para deslogar
    Então retorna o status 401 

  Cenário: Confirmar o logout do usuário
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para deslogar
    Então retorna o status 200 de sucesso

  Cenário: Não confirmar quando estiver deslogado
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para deslogar
    Então retorna o status 401 

  Cenário: Não permitir logout com token inválido
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para deslogar
    Então retorna o status 401 

  Cenário: Não permitir logout com token expirado
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para deslogar
    Então retorna o status 401 

  Cenário: Não permitir logout sem enviar token
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para deslogar
    Então retorna o status 401 

