Feature: API - Buscar DREs, UE e sem tipos de responsável

  Scenario: Retornar todas as DREs cadastradas
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint DREs
    Then retorna todas DREs cadastradas com status 200

  Scenario: Sem retornar DREs quando usuário não está autenticado
    Given não gerou um token de acesso válido
    When tento a requisição GET para o endpoint DREs
    Then retorna o status 401 sem dados de DREs

  Scenario: Buscar todas UEs sem Assistente Social
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint buscar sem atribuição
    And insiro o tipo de responsável Assistente Social
    Then retorna todas UEs com status 200

  Scenario: Buscar todas UEs sem PAAI
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint buscar sem atribuição
    And insiro o tipo de responsável PAAI
    Then retorna todas UEs com status 200

  Scenario: Buscar todas UEs sem Psicólogo Escolar
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint buscar sem atribuição
    And insiro o tipo de responsável Psicólogo Escolar
    Then retorna todas UEs com status 200

  Scenario: Buscar todas UEs sem Psicopedagogo
  Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint buscar sem atribuição
    And insiro o tipo de responsável Psicopedagogo
    Then retorna todas UEs com status 200

  Scenario: Buscar todas UEs sem Supervisor Escolar
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint buscar sem atribuição
    And insiro o tipo de responsável Supervisor Escolar
    Then retorna todas UEs com status 200

  Scenario: DRE deve ser informada
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint buscar sem DRE    
    Then deve retornar status 404 sem nenhuma UE

  Scenario: Tipo de responsável deve ser informado
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint buscar sem tipo de responsável
    Then deve retornar status 404 sem nenhum responsável

  Scenario: Sem retornar UES quando usuário não está autenticado
    Given não gerou um token de acesso válido
    When tento a requisição GET para o endpoint de buscar DRE sem atribuição
    Then retorna o status 401 sem dados de UEs

  Scenario: Retornar todas as UEs cadastradas
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de UEs na DRE
    Then retorna todas UEs cadastradas com status 200

  Scenario: DRE deve ser informada para buscar UE
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint sem DRE da UE
    Then retorna sem UE com status 500

  Scenario: Sem retornar UEs quando usuário não está autenticado
    Given não gerou um token de acesso válido
    When tento uma requisição GET para o endpoint de UEs na DRE
    Then retorna o status 401 sem dados de UEs