# language: pt

Funcionalidade: API - Criação e busca do plano de ciclo

  Cenário: Cria o plano de ciclo
    Dado que possuo um token de acesso válido
    Quando envio uma requisição POST
    Então cria o plano de ciclo com status 200

   Cenário: Ano letivo é obrigatório
    Dado que possuo um token de acesso válido
    Quando envio uma requisição POST sem o ano
    Então não cria que o ano letivo é obrigatório com status 422

  Cenário: Ciclo é obrigatório
    Dado que possuo um token de acesso válido
    Quando envio uma requisição POST sem o plano
    Então não cria que o ciclo é obrigatório com status 422

  Cenário: UE é obrigatória
    Dado que possuo um token de acesso válido
    Quando envio uma requisição POST sem a UE
    Então não cria que a UE é obrigatória com status 422

  Cenário: Não cria o plano de ciclo sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento a requisição POST
    Então não cria o plano de ciclo mostrando o status 401

  Cenário: Retorna o plano de ciclo
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET
    Então retorna o plano de ciclo com status 200

  Cenário: Ano letivo é obrigatório
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET sem o ano
    Então retorna que o ano letivo é obrigatório com status 500

  Cenário: Ciclo é obrigatório
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET sem o plano
    Então retorna que o ciclo é obrigatório com status 500

  Cenário: UE é obrigatória
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET sem a UE
    Então retorna que a UE é obrigatória com status 500

  Cenário: Não retorna o plano de ciclo sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET
    Então não retorna o plano de ciclo mostrando o status 401

