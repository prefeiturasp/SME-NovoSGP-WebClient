# language: pt

Funcionalidade: API - Acompanhamento de alunos

  Cenário: Retorna os acompanhamentos dos alunos
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de acompanhamento de alunos
    Então retorna os acompanhamentos dos alunos com status 200

  Cenário: Id da turma inexistente na consulta dos acompanhamentos dos alunos
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint com id da turma inexistente
    Então retorna o status 601 que o Id da turma deve ser informado

  Cenário: Id do componente curricular inexistente na consulta dos acompanhamentos dos alunos
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint com id do componente curricular inexistente
    Então retorna o status 601 que o Id do componente curricular deve ser informado

  Cenário: Id do aluno inexistente na consulta dos acompanhamentos dos alunos
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint com id do aluno inexistente
    Então retorna o status 601 que o Id do aluno deve ser informado

  Cenário: Semestre inexistente na consulta dos acompanhamentos dos alunos
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint com semestre inexistente
    Então retorna o status 601 que o semestre deve ser informado

  Cenário: Não retorna os acompanhamentos dos alunos sem autenticação
    Dado que não possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint sem token de acesso
    Então retorna o status 401 de acesso não autorizado

  Cenário: Retorna as fotos dos alunos acompanhados por semestres
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de fotos dos alunos acompanhados
    Então retorna as fotos dos alunos acompanhados com status 200

  Cenário: Semestre inexistente na consulta das fotos dos alunos acompanhados
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de fotos dos alunos acompanhados com semestre inexistente
    Então retorna o status 601 que o Id do acompanhamento no semestre deve ser informado

  Cenário: Semestre não encontrado na consulta das fotos dos alunos acompanhados
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de fotos dos alunos acompanhados com semestre não encontrado
    Então retorna o status 601 que o ano do acompanhamento não foi localizado
