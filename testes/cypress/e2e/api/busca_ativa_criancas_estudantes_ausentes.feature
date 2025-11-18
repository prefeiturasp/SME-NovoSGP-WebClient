Feature: API - Busca ativa de crianças e estudantes ausentes

  Scenario: Retornar todas as ausências
    Given que login gerou um token de acesso válido
    When envio uma requisição GET de ausentes
    Then retorna o status 200 com todas as ausências

  Scenario: Retornar as ausências no dia de hoje
    Given que login gerou um token de acesso válido
    When envio uma requisição GET de ausentes do dia
    Then retorna o status 200 com ausências de hoje

  Scenario: Retornar as ausências há 2 dias seguidos
    Given que login gerou um token de acesso válido
    When envio uma requisição GET de ausentes há 2 dias seguidos
    Then retorna o status 200 somente as ausências do filtro

  Scenario: Retornar as ausências há 3 dias seguidos
    Given que login gerou um token de acesso válido
    When envio uma requisição GET de ausentes há 3 dias seguidos
    Then retorna o status 200 somente as ausências do filtro

  Scenario: Retornar as ausências há 4 dias seguidos
    Given que login gerou um token de acesso válido
    When envio uma requisição GET de ausentes há 4 dias seguidos
    Then retorna o status 200 somente as ausências do filtro

  Scenario: Retornar as ausências há 5 dias seguidos
    Given que login gerou um token de acesso válido
    When envio uma requisição GET de ausentes há 5 dias seguidos
    Then retorna o status 200 somente as ausências do filtro

  Scenario: Retornar as ausências entre 6 e 10 dias seguidos
    Given que login gerou um token de acesso válido
    When envio uma requisição GET os ausentes entre 6 e 10 dias seguidos
    Then retorna o status 200 somente as ausências do filtro

  Scenario: Retornar as ausências entre 11 e 15 dias seguidos
    Given que login gerou um token de acesso válido
    When envio uma requisição GET os ausentes entre 11 e 15 dias seguidos
    Then retorna o status 200 somente as ausências do filtro

  Scenario: Retornar as ausências há mais de 15 dias seguidos
    Given que login gerou um token de acesso válido
    When envio uma requisição GET os ausentes há mais de 15 dias seguidos
    Then retorna o status 200 somente as ausências do filtro

  Scenario: Retornar 3 ausências nos últimos 10 dias
    Given que login gerou um token de acesso válido
    When envio uma requisição GET de 3 ausências nos últimos 10 dias
    Then retorna o status 200 somente as ausências do filtro

  Scenario: UE deve ser obrigatório na consulta
    Given que login gerou um token de acesso válido
    When envio uma requisição GET os ausentes sem a UE
    Then retorna o status 601 que a UE deve ser informada

  Scenario: Ano letivo deve ser obrigatório na consulta
    Given que login gerou um token de acesso válido
    When envio uma requisição GET os ausentes sem o ano letivo
    Then retorna o status 601 que invalidando a consulta

  Scenario: Turma deve ser obrigatório na consulta
    Given que login gerou um token de acesso válido
    When envio uma requisição GET os ausentes sem a turma
    Then retorna o status 601 que a turma deve ser informada

  Scenario: Não ausências da turma quando estiver deslogado
    Given que não login não gerou um token de acesso válido
    When tento uma requisição GET os ausentes da turma
    Then retorna o status 401 sem as ausências

  