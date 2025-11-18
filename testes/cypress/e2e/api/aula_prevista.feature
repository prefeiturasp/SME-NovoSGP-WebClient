Feature: API - Aula prevista

  Scenario: Retornar aulas prevista por bimestre
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para buscar aula no bimestre
    Then retorna o status 200 com as aulas previstas

  Scenario: Modalidade deve ser obrigatória
    Given que login gerou um token de acesso válido
    When envio uma requisição GET sem modalidade
    Then retorna o status 500 sem as aulas previstas
  
  Scenario: Não retornar aula com modalidade inválida
    Given que login gerou um token de acesso válido
    When envio uma requisição GET com modalidade inválida
    Then retorna o status 422 sem as aulas previstas

  Scenario: Turma deve ser obrigatória
    Given que login gerou um token de acesso válido
    When envio uma requisição GET sem turma
    Then retorna o status 500 sem as aulas previstas

  Scenario: Não retornar aula com turma inválida
    Given que login gerou um token de acesso válido
    When envio uma requisição GET com turma inválida
    Then retorna o status 601 sem as aulas previstas

  Scenario: Disciplina deve ser obrigatória
    Given que login gerou um token de acesso válido
    When envio uma requisição GET sem disciplina
    Then retorna o status 500 sem as aulas previstas

  Scenario: Semestre deve ser obrigatório
    Given que login gerou um token de acesso válido
    When envio uma requisição GET sem semestre
    Then retorna o status 500 sem as aulas previstas

  Scenario: Não retornar aula no bimestre quando estiver deslogado
    Given que não login não gerou um token de acesso válido
    When tento a requisição GET para buscar aula no bimestre
    Then retorna o status 401 sem as aulas

  Scenario: Retornar aulas prevista através do ID
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para buscar o ID aula
    Then retorna o status 200 com a aula prevista

  Scenario: Não retornar aula prevista quando estiver deslogado
    Given que não login não gerou um token de acesso válido
    When tento a requisição GET para buscar o ID aula
    Then retorna o status 401 sem a aula

  Scenario: ID da aulas prevista deve ser obrigatório
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para buscar sem o ID
    Then retorna o status 405 de método inválido

  Scenario: Alterar aulas prevista através do ID
    Given que login gerou um token de acesso válido
    When envio uma requisição PUT com o ID aula
    Then retorna o status 200 com a mensagem de sucesso
  
  Scenario: Não alterar aulas prevista sem o ID
    Given que login gerou um token de acesso válido
    When envio uma requisição PUT sem o ID aula
    Then retorna o status 405 sem realizar a alteração

  Scenario: Corpo da requisição não poderá estar vazio
    Given que login gerou um token de acesso válido
    When envio uma requisição PUT sem o corpo da requisição
    Then retorna o status 415 com a mensagem de vazio
  
  Scenario: Não alterar aula prevista quando estiver deslogado
    Given que não login não gerou um token de acesso válido
    When tento a requisição PUT com o ID aula
    Then retorna o status 401 sem realizar a alteração

  Scenario: Componente curricular deve ser informado
    Given que login gerou um token de acesso válido
    When envio uma requisição PUT sem o componente curricular
    Then retorna o status 422 com a mensagem que a disciplina deve ser informada para alterar

  Scenario: Modalidade deve ser informada
    Given que login gerou um token de acesso válido
    When envio uma requisição PUT sem a modalidade
    Then retorna o status 422 com a mensagem que deve ser informada para alterar

  Scenario: Turma deve ser informada
    Given que login gerou um token de acesso válido
    When envio uma requisição PUT sem a turma
    Then retorna o status 422 com a mensagem que a turma deve ser informada para alterar

  Scenario: Criar aulas prevista
    Given que login gerou um token de acesso válido
    When envio uma requisição POST 
    Then retorna o status 200 com a mensagem de aulas previstas no bimestre

  Scenario: Não criar aulas sem componente curricular informado
    Given que login gerou um token de acesso válido
    When envio uma requisição POST sem o componente curricular
    Then retorna o status 422 com a mensagem que a disciplina deve ser informada para criar

  Scenario: Não criar aulas sem modalidade informada
    Given que login gerou um token de acesso válido
    When envio uma requisição POST sem a modalidade
    Then retorna o status 422 com a mensagem que deve ser informada para criar

  Scenario: Não criar aulas sem turma informada
    Given que login gerou um token de acesso válido
    When envio uma requisição POST sem a turma
    Then retorna o status 422 com a mensagem que a turma deve ser informada para criar

  Scenario: Corpo da requisição  para criar aula não poderá estar vazio
    Given que login gerou um token de acesso válido
    When envio uma requisição POST sem o corpo da requisição
    Then retorna o status 415 com a mensagem de vazio ao criar

  Scenario: Não criar aula prevista quando estiver deslogado
    Given que não login não gerou um token de acesso válido
    When tento a requisição POST
    Then retorna o status 401 sem realizar a alteração ao criar
