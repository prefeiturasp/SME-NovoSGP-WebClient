Feature: API - Acompanhamento de turmas por quantidade de imagens

  Scenario: Retorna a quantidade de imagens do percurso coletivo e individual
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint de quantidade de imagens
    Then retorna do percurso coletivo e individual com status 200

   Scenario: Ano letivo é obrigado na consulta das imagens
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint de imagens sem ano letivo
    Then retorna o ano não informado é inválido

  Scenario: Não retorna quantidade de imagens sem autenticação
    Given que não possuo um token de acesso válido
    When tento a requisição GET para o endpoint de quantidade de imagens
    Then não retorna a quantidade no letivo mostrando o status 401

