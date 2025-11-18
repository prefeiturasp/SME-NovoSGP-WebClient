Feature: API - Dashboard do diário de bordo

  Scenario: Retorna a quantidade preenchidos pendentes
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint do dashboard
    And insiro o ano letivo, modallidade, DRE, UE, usuário
    Then retorna o status 200 do diário de bordo

  Scenario: Ano letivo deve ser obrigatório no dashboard do diário de bordo
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de preenchidos pendentes
    And não insiro o ano letivo
    Then retorna o status 422 de valor do ano inválido

  Scenario: Modallidade deve ser obrigatória no dashboard do diário de bordo
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint do dashboard do diário de bordo
    And não insiro modallidade
    Then retorna o status 422 que não foi preenchido

  Scenario: Usuário sem autenticação não acessa o dashboard do diário de bordo
    Given que login não gerou um token de acesso válido
    When tento a requisição GET para buscar a quantidade de preenchidos
    Then retorna o status 401 sem os dados pendentes

 Scenario: Retorna a quantidade preenchidos pendentes por DREs
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint do dashboard das DREs
    And insiro o ano letivo
    Then retorna o status 200 com quantidade das DREs
 
  Scenario: Retorna os pendentes das DREs no ano
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de DREs
    And insiro o ano com o letivo
    Then retorna o status 200 dos dados pendentes

  Scenario: Ano letivo deve ser informado para consulta por DRE
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint somente ano
    And não insiro o letivo na busca
    Then retorna o status 601 com a mensagem que ano letivo não foi informado

  Scenario: Usuário sem autenticação não acessa o dashboard do diário de bordo por DRE
    Given que login não gerou um token de acesso válido
    When tento a requisição GET para buscar a quantidade de preenchidos
    Then retorna o status 401 sem os dados pendentes de DREs

  Scenario: Buscar a consolidação do diário de bordo no dashboard
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de consolidação
    And insiri o ano letivo
    Then retorna o status 200 com o registro

  Scenario: Ano letivo deve ser informado para consulta por DRE
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de consolidação sem o ano letivo
    Then retorna o status 601 com a mensagem que o ano deve ser informado

  Scenario: Usuário sem autenticação não acessa o dashboard do diário de bordo por DRE
    Given que login não gerou um token de acesso válido
    When tento a requisição GET para buscar a consolidação
    Then retorna o status 401 sem os dados de registro