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