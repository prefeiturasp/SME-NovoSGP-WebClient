# language: pt

Funcionalidade: API - Sinteses

  Cenário: Retornar os valores do ano letivo
    Dado que login gerou um token de acesso válido
    Quando insiro o ano letivo
    E envio uma requisição GET para o endpoint de sinteses
    Então retorna o status 200 com os valores

  Cenário: Não acessar a versão sem autenticação
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint de sinteses
    Então retorna o status 401 sem valores

  Cenário: Ano letivo deve ser obrigatório nas sinteses
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET de sinteses sem ano letivo
    Então retorna o status 500

  Cenário: Ano letivo deve ser válido nas sinteses
    Dado que login gerou um token de acesso válido
    Quando insiro o ano letivo inválido
    E tento o envio uma requisição GET de sinteses
    Então retorna o status 601 com a mensagem de erro

  Cenário: Não retorna dados com token expirado
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint de sinteses
    Então retorna o status 401 sem valores

  Cenário: Garante consistência ao consultar múltiplas vezes com ano letivo válido
    Dado que login gerou um token de acesso válido
    Quando insiro o ano letivo
    E envio uma requisição GET para o endpoint de sinteses
    Então retorna o status 200 com os valores

  Cenário: Garante que não retorna dados sem ano letivo mesmo após sucesso anterior
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET de sinteses sem ano letivo
    Então retorna o status 500

  Cenário: Garante erro ao informar ano letivo inválido sem autenticação
    Dado que não login não gerou um token de acesso válido
    Quando insiro o ano letivo inválido
    E tento a requisição GET para o endpoint de sinteses
    Então retorna o status 401 sem valores

  Cenário: Valida acesso autorizado após tentativa não autorizada
    Dado que login gerou um token de acesso válido
    Quando insiro o ano letivo
    E envio uma requisição GET para o endpoint de sinteses
    Então retorna o status 200 com os valores

  Cenário: Valida que ano letivo inválido sempre retorna erro mesmo em chamadas repetidas
    Dado que login gerou um token de acesso válido
    Quando insiro o ano letivo inválido
    E tento o envio uma requisição GET de sinteses
    Então retorna o status 601 com a mensagem de erro