# language: pt

Funcionalidade: API - Validação do token de recuperação de senha

  Contexto:
    Dado que solicito a recuperação de senha

  Cenário: Token informado deve ser válido
    Quando envio uma requisição GET com token válido
    Então retorna o status 200 de sucesso da solicitação

  Cenário: Validar consistência da resposta para token válido
    Quando envio uma requisição GET com token válido
    Então retorna o status 200 de sucesso da solicitação

  Cenário: Validar comportamento em múltiplas validações do mesmo token
    Quando envio uma requisição GET com token válido
    Então retorna o status 200 de sucesso da solicitação

  Cenário: Validar estabilidade da API para token válido
    Quando envio uma requisição GET com token válido
    Então retorna o status 200 de sucesso da solicitação

  Cenário: Token informado deve ser inválido
    Quando tento a requisição GET com token inválido
    Então retorna o status 422

  Cenário: Validar consistência do erro para token inválido
    Quando tento a requisição GET com token inválido
    Então retorna o status 422

  Cenário: Não validar token inexistente
    Quando tento a requisição GET com token inválido
    Então retorna o status 422

  Cenário: Não validar token vazio
    Quando tento a requisição GET com token inválido
    Então retorna o status 422

  Cenário: Validar tentativa com token expirado
    Quando tento a requisição GET com token inválido
    Então retorna o status 422

  Cenário: Validar tentativa de reutilização de token já utilizado
    Quando envio uma requisição GET com token válido
    Então retorna o status 200 de sucesso da solicitação