# language: pt

Funcionalidade: API - Fechamento - Pendências de turma e bimestre através do componentes curriculares

  Cenário: Retorna dados de pendência do componente curricular
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o status 200 com as pendências do componente curricular

  Cenário: Não retorna pendência do componente curricular sem usuário autenticado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET
    Então não retorna pendência do componente curricular mostrando o status 401

