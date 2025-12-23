# language: pt

Funcionalidade: API - Mural de atividades infantis

  Cenário: Retorna mural de atividades da turma
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint do mural
    Então retorna as atividades da turma com status 200

  Cenário: Não retorna com turma inválida
    Dado que possuo um token de acesso válido
    Quando envio a requisição GET para o endpoint com a aula inválida
    Então não retorna as atividades exibindo mensagem para informar

  Cenário: Não retorna as atividades sem usuário autenticado
    Dado que não possuo um token de acesso válido
    Quando tento requisição GET para o endpoint do mural
    Então não retorna as atividades mostrando o status 401

