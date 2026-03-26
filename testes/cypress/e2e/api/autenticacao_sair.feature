# language: pt

Funcionalidade: API - Autenticação do logout

  Contexto:
    Dado que login gerou um token de acesso válido

  Cenário: Confirmar o logout do usuário
    Quando envio uma requisição GET para deslogar
    Então retorna o status 200 de sucesso

  Cenário: Validar consistência do logout com sucesso
    Quando envio uma requisição GET para deslogar
    Então retorna o status 200 de sucesso

  Cenário: Validar comportamento em múltiplas requisições de logout
    Quando envio uma requisição GET para deslogar
    Então retorna o status 200 de sucesso

  Cenário: Validar estabilidade da API no logout
    Quando envio uma requisição GET para deslogar
    Então retorna o status 200 de sucesso

  Cenário: Não confirmar quando estiver deslogado
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para deslogar
    Então retorna o status 401 

  Cenário: Validar consistência do erro sem autenticação
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

  Cenário: Validar tentativa de logout após logout já realizado
    Quando envio uma requisição GET para deslogar
    Então retorna o status 200 de sucesso