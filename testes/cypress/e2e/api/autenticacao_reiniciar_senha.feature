Feature: API - Reiniciar senha do usuário

  Scenario: Reiniciar senha de usuário válido
    Given que possuo um token de acesso válido
    When envio uma requisição PUT para reiniciar a senha
    Then deve confirmar com status 200

  Scenario: Não reiniciar para usuário inválido
    Given que possuo um token de acesso válido
    When envio uma requisição PUT para reiniciar a senha de usuário inválido
    Then retorna o status 601 que não foi possível reiniciar deste usuário

  Scenario: Código da DRE deve ser obrigatório
    Given que não possuo um token de acesso válido
    When envio uma requisição PUT sem a DRE para reiniciar a senha
    Then retorna o status 601 que o código é obrigatório

