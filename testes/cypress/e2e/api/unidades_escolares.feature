# language: pt

Funcionalidade: API - Unidades escolares - Funcionários e usuários

  Cenário: Atribuir um funcionário a UE
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição POST 
    Então retorna o status 200 de sucesso ao atribuir

  Cenário: Dados de funcionário devem ser obrigatórios
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição POST sem os dados do funcionário
    Então retorna o status 415 sem atribuir
  
  Cenário: DRE deve ser obrigatória ao atribuir funcionário
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição POST sem a DRE
    Então retorna o status 601 sem atribuir funcionário

  Cenário: Não atribuir um funcionário a UE sem autenticação
    Dado que não gerou um token de acesso válido
    Quando tento uma requisição POST
    Então retorna o status 401 sem atribuir funcionário

  Cenário: Atribuir um usuário a UE
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição POST 
    Então retorna o status 200 de sucesso ao atribuir

  Cenário: Dados de usuário devem ser obrigatórios
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição POST sem os dados do usuário
    Então retorna o status 415 sem atribuir

  Cenário: DRE deve ser obrigatória ao atribuir usuário
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição POST sem a DRE
    Então retorna o status 601 sem atribuir usuário

  Cenário: Não atribuir um usuário a UE sem autenticação
    Dado que não gerou um token de acesso válido
    Quando tento uma requisição POST
    Então retorna o status 401 sem atribuir usuário


