# language: pt

Funcionalidade: API - Dashboard do diário de bordo

  Cenário: Retorna a quantidade preenchidos pendentes
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint do dashboard
    E insiro o ano letivo, modallidade, DRE, UE, usuário
    Então retorna o status 200 do diário de bordo

  Cenário: Ano letivo deve ser obrigatório no dashboard do diário de bordo
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de preenchidos pendentes
    E não insiro o ano letivo
    Então retorna o status 422 de valor do ano inválido

  Cenário: Modallidade deve ser obrigatória no dashboard do diário de bordo
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint do dashboard do diário de bordo
    E não insiro modallidade
    Então retorna o status 422 que não foi preenchido

  Cenário: Usuário sem autenticação não acessa o dashboard do diário de bordo
    Dado que login não gerou um token de acesso válido
    Quando tento a requisição GET para buscar a quantidade de preenchidos
    Então retorna o status 401 sem os dados pendentes

 Cenário: Retorna a quantidade preenchidos pendentes por DREs
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint do dashboard das DREs
    E insiro o ano letivo
    Então retorna o status 200 com quantidade das DREs
 
  Cenário: Retorna os pendentes das DREs no ano
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de DREs
    E insiro o ano com o letivo
    Então retorna o status 200 dos dados pendentes

  Cenário: Ano letivo deve ser informado para consulta por DRE
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint somente ano
    E não insiro o letivo na busca
    Então retorna o status 601 com a mensagem que ano letivo não foi informado

  Cenário: Usuário sem autenticação não acessa o dashboard do diário de bordo por DRE
    Dado que login não gerou um token de acesso válido
    Quando tento a requisição GET para buscar a quantidade de preenchidos
    Então retorna o status 401 sem os dados pendentes de DREs

  Cenário: Buscar a consolidação do diário de bordo no dashboard
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de consolidação
    E insiri o ano letivo
    Então retorna o status 200 com o registro

  Cenário: Ano letivo deve ser informado para consulta por DRE
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de consolidação sem o ano letivo
    Então retorna o status 601 com a mensagem que o ano deve ser informado

  Cenário: Usuário sem autenticação não acessa o dashboard do diário de bordo por DRE
    Dado que login não gerou um token de acesso válido
    Quando tento a requisição GET para buscar a consolidação
    Então retorna o status 401 sem os dados de registro