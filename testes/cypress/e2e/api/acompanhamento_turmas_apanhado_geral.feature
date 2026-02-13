# language: pt

Funcionalidade: API - Apanhado geral da turmas

  Cenário: Retorna a quantidade do apanhado geral
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de apanhado geral
    Então retorna a quantidade com status 200

<<<<<<< HEAD

=======
>>>>>>> 30bf60295d01cd530ce194fd0d6be7b5374d3805
  Cenário: Turma é obrigatório na consulta do apanhado geral
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de apanhado sem a turma
    Então retorna o status 422 que a turma é inválida

<<<<<<< HEAD

=======
>>>>>>> 30bf60295d01cd530ce194fd0d6be7b5374d3805
  Cenário: Semestre é obrigatório na consulta do apanhado geral
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de apanhado sem o semestre
    Então retorna o status 422 que o semestre é inválido

<<<<<<< HEAD

=======
>>>>>>> 30bf60295d01cd530ce194fd0d6be7b5374d3805
  Cenário: Não retorna quantidade do apanhado geral sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET para o endpoint de apanhado geral
    Então não retorna a quantidade do apanhado mostrando o status 401

<<<<<<< HEAD

  Cenário: Não retorna dados sem token mesmo informando turma e semestre
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET para o endpoint de apanhado geral
    Então não retorna a quantidade do apanhado mostrando o status 401


  Cenário: Não retorna dados sem token ao tentar novamente a consulta
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET para o endpoint de apanhado geral
    Então não retorna a quantidade do apanhado mostrando o status 401
=======
>>>>>>> 30bf60295d01cd530ce194fd0d6be7b5374d3805
