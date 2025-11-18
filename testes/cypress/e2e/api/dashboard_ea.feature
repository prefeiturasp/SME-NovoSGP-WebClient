Feature: API - Dashboard EA

  Scenario: Buscar adesão no dashboard EA
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de adesão EA
    And informo a UE com a DRE
    Then retorna o status 200 de busca no dashboard EA

  Scenario: Buscar adesão ao dashboard na UE
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de adesão sem DRE
    And informo somente a UE
    Then retorna o status 200 de busca EA da UE

  Scenario: Buscar adesão ao dashboard na DRE
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de adesão sem UE
    And informo somente a DRE
    Then retorna o status 200 de busca EA da DRE

  Scenario: Não buscar adesão no dashboard EA sem autenticação
    Given que não login não gerou um token de acesso válido
    When tento uma requisição GET para o endpoint de adesão EA
    Then retorna o status 401 sem as adesões

  Scenario: Buscar adesão no dashboard EA agrupado por DRE
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de adesão EA agrupados 
    Then retorna o status 200 de busca no dashboard EA totalizado as Dres

  Scenario: Não buscar adesão agrupado no dashboard EA sem autenticação
    Given que não login não gerou um token de acesso válido
    When tento uma requisição GET para o endpoint de adesão EA
    Then retorna o status 401 sem o agrupamento

  Scenario: Nome do processamento no dashboard EA é obrigatório
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint sem o processamento
    Then retorna o status 601 que o nome do processo é obrigatório

  Scenario: Não buscar com nome do processamento no dashboard EA inválido
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint com nome inválido
    Then retorna o status 601 ao obter dados de adesão do aplicativo

  Scenario: Não buscar processamento no dashboard EA sem autenticação
    Given que não login não gerou um token de acesso válido
    When tento uma requisição GET para o endpoint de processamento
    Then retorna o status 401 sem os nomes de processos

  Scenario: Buscar comunicados totais no dashboard
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de comunicados totais
    Then retorna o status 200 com os vigentes e expirados

   Scenario: Ano letivo no dashboard de comunicados totais é obrigatório
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de comunicados sem ano letivo
    Then retorna o status 422 que o valor é inválido

  Scenario: Não buscar comunicados totais no dashboard sem autenticação
    Given que não login não gerou um token de acesso válido
    When tento uma requisição GET para o endpoint de comunicados totais
    Then retorna o status 401 sem os vigentes e expirados

  Scenario: Buscar comunicados totais agrupados no dashboard
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de comunicados totais agrupados
    Then retorna o status 200 com nome da DRE, os vigentes e expirados

  Scenario: Ano letivo no dashboard de comunicados totais agrupados é obrigatório
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de comunicados agrupados sem ano letivo
    Then retorna o status 422 que o valor é inválido para listar

  Scenario: Não buscar comunicados totais agrupados no dashboard sem autenticação
    Given que não login não gerou um token de acesso válido
    When tento uma requisição GET para o endpoint de comunicados totais agrupados
    Then retorna o status 401 sem nome da DRE, os vigentes e expirados

   Scenario: Buscar leitura dos comunicados no dashboard
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de leituras de comunicados
    Then retorna o status 200 com nome da DRE, Ue, não receberam, não visualizaram e visualizaram

  Scenario: Campo do código do comunicado é obrigatório
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de leituras sem o código do comunicado
    Then retorna o status 422 informando que o comunicado é obrigatório

  Scenario: Não buscar com código do comunicado inválido
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de leituras com o código do comunicado inválido
    Then retorna o status 400 informando que não existe

  Scenario: Modo de visualização é obrigatório
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de leituras sem o modo de visualização
    Then retorna o status 422 informando que o modo é obrigatório

  Scenario: Não buscar comunicados totais agrupados no dashboard sem autenticação
    Given que não login não gerou um token de acesso válido
    When tento uma requisição GET para o endpoint de leituras de comunicados
    Then retorna o status 401 sem nome da DRE, Ue, não receberam, não visualizaram e visualizaram

  Scenario: Buscar leitura dos comunicados agrupados no dashboard
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de leituras de comunicados agrupados
    Then retorna o status 200 com as notificações

  Scenario: Campo do código do comunicado agrupados é obrigatório
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de leituras agrupados sem o código do comunicado
    Then retorna o status 422 informando que o comunicado é obrigatório para agrupar

  Scenario: Não buscar agrupado com código do comunicado inválido
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de leituras agrupados com o código do comunicado inválido
    Then retorna o status 400 informando que não existe para agrupar

  Scenario: Modo de visualização é obrigatório para agrupar
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de leituras agrupados sem o modo de visualização
    Then retorna o status 422 informando que o modo é obrigatório para agrupar

  Scenario: Não buscar comunicados totais agrupados no dashboard sem autenticação
    Given que não login não gerou um token de acesso válido
    When tento uma requisição GET para o endpoint de leituras agrupados de comunicados
    Then retorna o status 401 sem agrupar nome da DRE, Ue, não receberam, não visualizaram e visualizaram

  Scenario: Filtrar comunicados no dashboard EA
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de filtro de comunicados
    Then retorna o status 200 de sucesso do dashboard EA

  Scenario: Ano letivo é obrigatório para filtrar dashboard EA
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de filtro de comunicados sem o ano
    Then retorna o status 422 informando que o ano letivo é inválido

  Scenario: Modalidade é obrigatório para filtrar dashboard EA
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de filtro de comunicados sem a modalidade
    Then retorna o status 422 informando que a modalidade é inválida

  Scenario: Não filtrar comunicados no dashboard EA sem autenticação
    Given que não login não gerou um token de acesso válido
    When tento uma uma requisição GET para o endpoint de filtro de comunicados
    Then retorna o status 401 sem filtrar o dashboard EA

  Scenario: Leitura de comunicados de modalidades no dashboard EA
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de leitura de comunicados
    Then retorna o status 200 de sucesso do dashboard EA de comunicados

  Scenario: Código da DRE é obrigatório para leitura de comunicados de modalidades
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de leitura de comunicados sem a DRE
    Then retorna o status 601 que o código da DRE é obrigatório

  Scenario: Código da UE é obrigatório para leitura de comunicados de modalidades
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de leitura de comunicados sem a UE
    Then retorna o status 601 que o código da UE é obrigatório

  Scenario: Código da notificação é obrigatório para leitura de comunicados de modalidades
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de leitura de comunicados sem a notificação
    Then retorna o status 422 que o código da notificação é obrigatório

  Scenario: Modo de visualização é obrigatório para leitura de comunicados de modalidades
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de leitura de comunicados sem o modo de visualização
    Then retorna o status 422 que o modo de visualização é obrigatório

  Scenario: Não retornar a leitura de comunicados de modalidades no dashboard EA sem autenticação
    Given que não login não gerou um token de acesso válido
    When tento uma requisição GET para o endpoint de leitura de comunicados
    Then retorna o status 401 sem a leitura no dashboard EA

  Scenario: Leitura de comunicados de turmas no dashboard EA
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de leitura de turmas
    Then retorna o status 200 de leitura do dashboard EA de comunicados

  Scenario: Código da DRE é obrigatório para leitura de comunicados de turmas
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de leitura de turmas sem a DRE
    Then retorna o status 422 que o código da DRE é obrigatório na leitura

  Scenario: Código da UE é obrigatório para leitura de comunicados de turmas
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de leitura de turmas sem a UE
    Then retorna o status 422 que o código da UE é obrigatório na leitura

  Scenario: Código da notificação é obrigatório para leitura de comunicados de turmas
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de leitura de turmas sem a notificação
    Then retorna o status 422 que o código da notificação é obrigatório na leitura

  Scenario: Modo de visualização é obrigatório para leitura de comunicados de turmas
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de leitura de turmas sem o modo de visualização
    Then retorna o status 422 que o modo de visualização é obrigatório na leitura

  Scenario: Não retornar a leitura de turmas de modalidades no dashboard EA sem autenticação
    Given que não login não gerou um token de acesso válido
    When tento uma requisição GET para o endpoint de leitura de turmas
    Then retorna o status 401 sem a leitura no dashboard EA na leitura

  Scenario: Leitura de comunicados de alunos no dashboard EA
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de alunos de turmas
    Then retorna o status 200 de alunos do dashboard EA de comunicados

  Scenario: Código da turma é obrigatório para leitura de comunicados de alunos
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de leitura de alunos sem a turma
    Then retorna o status 422 que o código da turma é obrigatório na leitura

  Scenario: Código da notificação é obrigatório para leitura de comunicados de alunos
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de leitura de alunos sem a notificação
    Then retorna o status 422 que o código da notificação é obrigatório na turma

  Scenario: Não retornar a leitura de alunos de modalidades no dashboard EA sem autenticação
    Given que não login não gerou um token de acesso válido
    When tento uma requisição GET para o endpoint de leitura de alunos
    Then retorna o status 401 sem a leitura no dashboard EA da turma