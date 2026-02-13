# language: pt

Funcionalidade: API - Fechamento - Acompanhamento da turma, aluno e componentes curriculares e situação do fechamento

  Cenário: Retorna dados através da situação do fechamento, turma e bimestre
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o status 200 através da situação do fechamento, turma e bimestre
  
  Cenário: Não retorna dados com código da turma inválida
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET com turma inválida
    Então não retorna os dados exibindo o status 601

  Cenário: Não retorna dados sem usuário autenticado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET
    Então não retorna os dados mostrando o status 401

