Feature: API - Tipo e descrição da UE

  Scenario: Retorna dados do tipo da UE
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para endpoint de tipos escolas 
    Then retorna o status 200 de sucesso com os dados  

  Scenario: Não retorna dados sem usuário autenticado
    Given que não gerou um token de acesso válido
    When tento uma requisição GET para endpoint de tipos escolas
    Then retorna o status 401 sem os dados

  Scenario: Código da DRE deve ser obrigatório
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para endpoint dos tipos de UE
    And não informo a DRE
    Then retorna o status 500 sem os dados de UE

  Scenario: Código da UE deve ser obrigatório
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para endpoint de tipos
    And não informo a UE
    Then retorna o status 500 sem os dados da DRE


