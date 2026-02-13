# language: pt

Funcionalidade: API - Fechamento - Acompanhamento de pendências por aula

  Cenário: Listar todas as pendências por aula
    Dado que possuo um token de acesso válido
    Quando informo o id de pendência da aula
    E envio uma requisição GET para o endpoint
    Então a reposta deve conter status 200

  Cenário: Não permitir acessar sem autenticação
    Dado que não possuo um token de acesso válido
    Quando informo o id de pendência da aula
    E envio uma requisição GET para o endpoint sem autenticação
    Então a resposta deve ter o status 401 sem acompanhamento de pendências por aula

  Cenário: Não listar pendência da aula sem id informado
    Dado que possuo um token de acesso válido
    Quando não informo o id de pendência da aula
    E envio uma requisição GET para o endpoint sem o id
    Então a resposta deve ter o status 601 com a mensagem de erro de id não informado
