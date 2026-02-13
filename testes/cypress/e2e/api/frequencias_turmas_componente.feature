# language: pt

Funcionalidade: API - Frequências das turmas por componente

  Cenário: Listar frequências das aulas por turma e componente
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de frequências das turmas por componente    
    Então a resposta deve ter o status 200 contendo os dados

  Cenário: Não permitir acessar sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento uma requisição GET para o endpoint de frequências das turmas por componente
    Então a resposta deve ter o status 401 sem a frequência de turma por componente

  Cenário: Código da turma informado é inexistente
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint com turma inexistente
    Então a resposta deve ter o status 601 com a mensagem de erro