# language: pt

Funcionalidade: API - Dias letivos do calendário

  Cenário: Quantidade de dias letivos do calendário
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição POST na api de dias letivos
    Então retorna o status 200 com a quantidade

  Cenário: Não acessar dias letivos do calendário sem autenticação
    Dado que não gerou um token de acesso válido
    Quando tento uma requisição POST na api de dias letivos
    Então retorna o status 401 que não foi permitido

  Cenário: Não acessar dias letivos com token inválido
    Dado que não gerou um token de acesso válido
    Quando tento uma requisição POST na api de dias letivos
    Então retorna o status 401 que não foi permitido

  Cenário: Não acessar dias letivos com token expirado
    Dado que não gerou um token de acesso válido
    Quando tento uma requisição POST na api de dias letivos
    Então retorna o status 401 que não foi permitido

  Cenário: Garantir que a quantidade retornada seja maior ou igual a zero
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição POST na api de dias letivos
    Então retorna o status 200 com a quantidade

  Cenário: Garantir que o retorno contenha apenas valor numérico para quantidade
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição POST na api de dias letivos
    Então retorna o status 200 com a quantidade
