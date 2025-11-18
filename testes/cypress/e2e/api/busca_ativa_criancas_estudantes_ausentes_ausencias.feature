Feature: API - Filtros por período de ausências do estudante

  Scenario: Retornar a descrição e id das ausências
    Given que login gerou um token de acesso válido
    When envio uma requisição GET de ausências
    Then retorna o status 200 com todas as ausências descritas e id
  
  Scenario: Não retorna ausências quando estiver deslogado
    Given que não login não gerou um token de acesso válido
    When tento uma requisição GET de ausências
    Then retorna o status 401 a descrição e id

  