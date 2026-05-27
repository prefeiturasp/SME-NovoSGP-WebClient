# language: pt

Funcionalidade: API - Fechamento - Acompanhamento de id de pendências

  Cenário: Listar todas as pendências por id
    Dado que possuo um token de acesso válido
    Quando informo o id da pendência
    E envio uma requisição GET para o endpoint
    Então retorna o status 200

  Cenário: Validar retorno da pendência com id válido
    Dado que possuo um token de acesso válido
    Quando informo o id da pendência
    E envio uma requisição GET para o endpoint
    Então retorna o status 200

  Cenário: Não permitir acessar sem autenticação
    Dado que não possuo um token de acesso válido
    Quando informo somente o id da pendência
    E tento o envio uma requisição GET para o endpoint
    Então a resposta deve ter o status 401 sem detalhamento da pendência

  Cenário: Não listar pendência sem id informado
    Dado que possuo um token de acesso válido
    Quando não informo o id da pendência
    E envio uma requisição GET para o endpoint sem id válido
    Então a resposta deve ter o status 601 com a mensagem de erro de id da pendência não informado