Feature: API - Cache chaves

  Scenario: Retornar os dados de cache chaves
    Given que acesso o endpoint de cache
    When envio uma requisição GET
    Then retorna o status 200 com as chaves



