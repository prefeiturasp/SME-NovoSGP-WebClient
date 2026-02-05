# language: pt

Funcionalidade: API - Listar tipos e pendências da turma

  Cenário: Listar todas as pendências
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint buscar a lista de pendencias
    Então o corpo da resposta deve conter dados de pendências com status 200

  Cenário: Listar pendências da turma
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de pendências da turma
    Então o corpo da resposta deve conter dados de pendências com status 200

  Cenário: Listar por tipo de pendências
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint por tipo de pendências
    Então o corpo da resposta deve conter dados de pendências com status 200

  Cenário: Listar por turma e tipo de pendências
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint por turma com tipo de pendência
    Então o corpo da resposta deve conter dados de pendências com status 200

  Cenário: Não permitir acessar sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento enviar uma requisição GET para o endpoint
    Então a lista de pendencias deve ter o status 401

