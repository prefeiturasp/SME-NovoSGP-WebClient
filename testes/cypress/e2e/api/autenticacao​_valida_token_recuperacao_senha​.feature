# language: pt

Funcionalidade: API - Validação do token de recuperação de senha

  Cenário: Token informado deve ser válido
    Dado que solicito a recuperação de senha
    Quando envio uma requisição GET com token válido
    Então retorna o status 200 de sucesso da solicitação

  Cenário: Token informado deve ser inválido
    Dado que solicito a recuperação de senha
    Quando tento a requisição GET com token inválido
    Então retorna o status 422

<<<<<<< HEAD
  Cenário: Não validar token sem autenticação
    Dado que solicito a recuperação de senha
    Quando tento a requisição GET com token inválido
    Então retorna o status 422

  Cenário: Não validar token inexistente
    Dado que solicito a recuperação de senha
    Quando tento a requisição GET com token inválido
    Então retorna o status 422

  Cenário: Não validar token vazio
    Dado que solicito a recuperação de senha
    Quando tento a requisição GET com token inválido
    Então retorna o status 422
=======
    


>>>>>>> 30bf60295d01cd530ce194fd0d6be7b5374d3805
