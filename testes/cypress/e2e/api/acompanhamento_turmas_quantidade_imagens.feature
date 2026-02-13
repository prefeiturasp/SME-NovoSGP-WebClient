# language: pt

Funcionalidade: API - Acompanhamento de turmas por quantidade de imagens

  Cenário: Retorna a quantidade de imagens do percurso coletivo e individual
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de quantidade de imagens
    Então retorna do percurso coletivo e individual com status 200

<<<<<<< HEAD

  Cenário: Ano letivo é obrigado na consulta das imagens
=======
   Cenário: Ano letivo é obrigado na consulta das imagens
>>>>>>> 30bf60295d01cd530ce194fd0d6be7b5374d3805
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de imagens sem ano letivo
    Então retorna o ano não informado é inválido

<<<<<<< HEAD

=======
>>>>>>> 30bf60295d01cd530ce194fd0d6be7b5374d3805
  Cenário: Não retorna quantidade de imagens sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET para o endpoint de quantidade de imagens
    Então não retorna a quantidade no letivo mostrando o status 401

<<<<<<< HEAD

  Cenário: Consulta válida pode ser executada mais de uma vez com sucesso
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de quantidade de imagens
    Então retorna do percurso coletivo e individual com status 200


  Cenário: Requisição sem token continua retornando 401
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET para o endpoint de quantidade de imagens
    Então não retorna a quantidade no letivo mostrando o status 401


=======
>>>>>>> 30bf60295d01cd530ce194fd0d6be7b5374d3805
