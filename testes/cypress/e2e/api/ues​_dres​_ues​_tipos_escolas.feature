# language: pt

Funcionalidade: API - Tipo e descrição da UE

  Cenário: Retorna dados do tipo da UE
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para endpoint de tipos escolas 
    Então retorna o status 200 de sucesso com os dados  

  Cenário: Não retorna dados sem usuário autenticado
    Dado que não gerou um token de acesso válido
    Quando tento uma requisição GET para endpoint de tipos escolas
    Então retorna o status 401 sem os dados

  Cenário: Código da DRE deve ser obrigatório
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para endpoint dos tipos de UE
    E não informo a DRE
    Então retorna o status 500 sem os dados de UE

  Cenário: Código da UE deve ser obrigatório
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para endpoint de tipos
    E não informo a UE
    Então retorna o status 500 sem os dados da DRE


