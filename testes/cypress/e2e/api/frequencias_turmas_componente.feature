Feature: API - Frequências das turmas por componente

  Scenario: Listar frequências das aulas por turma e componente
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint de frequências das turmas por componente    
    Then a resposta deve ter o status 200 contendo os dados

  Scenario: Não permitir acessar sem autenticação
    Given que não possuo um token de acesso válido
    When tento uma requisição GET para o endpoint de frequências das turmas por componente
    Then a resposta deve ter o status 401 sem a frequência de turma por componente

  Scenario: Código da turma informado é inexistente
    Given que possuo um token de acesso válido
    When envio uma requisição GET para o endpoint com turma inexistente
    Then a resposta deve ter o status 601 com a mensagem de erro