# language: pt

Funcionalidade: API - Buscar o fechamento final através da disciplina, turma e semestre

  Cenário: Necessário realizar o fechamento do bimestre
    Dado que possuo um token de acesso válido
    Quando envio uma requisição POST
    Então retorna o status 200 sendo necessário realizar o fechamento do bimestre
  
  Cenário: Não retornar dados com código da turma inválida
    Dado que possuo um token de acesso válido
    Quando envio uma requisição POST com turma inválida
    Então não retorna os dados exibindo o status 601

  Cenário: Não retornar dados sem usuário autenticado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição POST
    Então não retorna os dados mostrando o status 401

