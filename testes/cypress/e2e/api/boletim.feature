# language: pt

Funcionalidade: API - Boletim

  Cenário: Consultar boletim por Turma #1
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de boletim com id da turma existente
    Então retorna sucesso com status 200
    E as informações do boletim dos alunos da turma

  Cenário: Consultar boletim com ID de turma inexistente #2
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de boletim com id da turma inexistente
    Então retorna o status 200
    E as informações do boletim dos alunos da turma vazias

  Cenário: Consultar boletim sem ID de turma #3
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint sem id da turma
    Então retorna o status 601
    E a mensagem de ID da turma é obrigatório

  Cenário: Não retorna o boletim sem autenticação #4
    Dado que não possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint sem token de acesso
    Então retorna o status 401 de acesso não autorizado

  Cenário: Consultar boletim por Turma de Alunos Observações #1
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de boletim por turma de alunos observações com id da turma existente
    Então retorna sucesso com status 200
    E as informações do boletim dos alunos observações da turma

  Cenário: Consultar boletim por Turma de Alunos Observações com ID de turma inexistente #2
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de boletim por turma de alunos observações com id da turma inexistente
    Então retorna o status 601
    E a mensagem de ID é obrigatório

  Cenário: Consultar boletim alunos observações sem ID de turma #3
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint alunos observações sem id da turma
    Então retorna o status 601
    E a mensagem de ID da turma é obrigatório

  Cenário: Não retorna o boletim alunos observações sem autenticação #4
    Dado que não possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint alunos observações sem token de acesso
    Então retorna o status 401 de acesso não autorizado
