# language: pt

Funcionalidade: API - Anos letivos anteriores e atual

  Cenário: Retorna o ano letivo atual
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint buscar o ano letivo
    Então retorna o ano atual com status 200
<<<<<<< HEAD


  @ignore
  Cenário: Retorna os anos letivos anteriores e atual
=======
@ignore
   Cenário: Retorna os anos letivos anteriores e atual
>>>>>>> 30bf60295d01cd530ce194fd0d6be7b5374d3805
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint buscar os anos letivos
    Então retorna os anos anteriores e atual com status 200

<<<<<<< HEAD

=======
>>>>>>> 30bf60295d01cd530ce194fd0d6be7b5374d3805
  Cenário: Não permitir acessar sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET para o endpoint buscar o ano letivo
    Então não consulta ano letivo mostrando o status 401

<<<<<<< HEAD

  Cenário: Consulta do ano atual pode ser realizada múltiplas vezes com sucesso
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint buscar o ano letivo
    Então retorna o ano atual com status 200


  Cenário: Continua bloqueando acesso ao ano letivo sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET para o endpoint buscar o ano letivo
    Então não consulta ano letivo mostrando o status 401
=======
>>>>>>> 30bf60295d01cd530ce194fd0d6be7b5374d3805
