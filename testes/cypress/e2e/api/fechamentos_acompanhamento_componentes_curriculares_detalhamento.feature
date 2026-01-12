# language: pt

Funcionalidade: API - Fechamento - Detalhamento da turma através do conselho de classe, bimestre, aluno e componentes curriculares

  Cenário: Retorna dados através da situação do conselho de classe e alunos
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o status 200 através da situação do conselho de classe e alunos
  
  Cenário: Não retorna dados com código da turma inválida
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET com turma inválida
    Então não retorna os dados exibindo o status 601

  Cenário: Não retorna dados com código do bimestre inválido
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET com bimestre inválido
    Então não retorna as informações exibindo o status 500

  Cenário: Não retorna dados sem usuário autenticado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET
    Então não retorna os dados mostrando o status 401

