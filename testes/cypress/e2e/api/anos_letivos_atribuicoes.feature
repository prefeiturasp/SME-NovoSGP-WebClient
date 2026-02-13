# language: pt

Funcionalidade: API - Anos letivos anteriores e atual

  Cenário: Retorna o ano letivo atual
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint buscar o ano letivo
    Então retorna o ano atual com status 200


  @ignore
  Cenário: Retorna os anos letivos anteriores e atual
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint buscar os anos letivos
    Então retorna os anos anteriores e atual com status 200

  Cenário: Não permitir acessar sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET para o endpoint buscar o ano letivo
    Então não consulta ano letivo mostrando o status 401


  Cenário: Consulta do ano atual pode ser realizada múltiplas vezes com sucesso
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint buscar o ano letivo
    Então retorna o ano atual com status 200


  Cenário: Continua bloqueando acesso ao ano letivo sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET para o endpoint buscar o ano letivo
    Então não consulta ano letivo mostrando o status 401
