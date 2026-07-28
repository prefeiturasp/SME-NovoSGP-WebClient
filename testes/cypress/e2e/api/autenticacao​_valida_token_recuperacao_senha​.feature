# language: pt

Funcionalidade: API - Validação do token de recuperação de senha

  Cenário: Token informado deve ser válido
    Dado que solicito a recuperação de senha
    Quando envio uma requisição GET com token válido
    Então retorna o status 200 de sucesso da solicitação

  #Cenário: Token informado deve ser inválido
  #  Dado que solicito a recuperação de senha
  #  Quando tento a requisição GET com token inválido
  #  Então retorna o status 422

    


