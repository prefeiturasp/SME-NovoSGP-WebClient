Feature: API - CEP

  Scenario: Buscar dados com CEP válido
    Given que possuo um token de acesso
    When envio uma requisição GET com CEP válido
    Then retorna o status 200 de confirmação da busca

   Scenario: CEP informado deve ser inválido
    Given que possuo um token de acesso
    When envio uma requisição GET com CEP inválido
    Then retorna o status 204 que não foi possível buscar os dados

  Scenario: CEP deve ser informado para busca
    Given que possuo um token de acesso
    When tento a requisição GET para o endpoint buscar sem o cep
    Then não realiza a consulta retornando o status 500