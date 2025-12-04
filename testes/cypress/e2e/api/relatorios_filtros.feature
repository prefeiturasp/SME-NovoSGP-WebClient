Feature: API - Relatório filtros

  Scenario: Filtra DREs no relatório
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint relatórios filtros DRE
    Then retorna o status 200 com dados da DRE

  Scenario: Não acessar a versão sem autenticação sem autenticação
    Given que não login não gerou um token de acesso válido
    When tento a requisição GET para o endpoint relatórios filtros DRE
    Then retorna o status 401 sem dados da DRE

  Scenario: Filtra o código da DRE no relatório
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint relatórios filtros o código DRE
    Then retorna o status 200 com dados de DRE no ano

  Scenario: Ano letivo é obrigatório ao filtrar o código da DRE no relatório
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint relatórios filtros código DRE
    And não insiro o ano letivo
    Then retorna o status 422 sem dados de DRE pois o ano é inválido

  Scenario: DRE é obrigatória ao filtrar por código no relatório
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint relatórios filtros código de DRE
    And não insiro a DRE
    Then retorna o status 500 sem dados de DRE pois o código é vazio

  Scenario: Não filtra o código da DRE no relatório sem autenticação
    Given que não login não gerou um token de acesso válido
    When tento a requisição GET para o endpoint relatórios filtros o código DRE
    Then retorna o status 401 sem dados da DRE no ano

  Scenario: Filtra as UEs no relatório
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint relatórios filtros com UE
    Then retorna o status 200 com dados de UE no ano

  Scenario: Ano letivo é obrigatório ao filtrar a UE no relatório
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint relatórios filtros UE
    And não insiro ano letivo
    Then retorna o status 422 sem dados de UE pois o ano é inválido

  Scenario: UE é obrigatória ao filtrar por código no relatório
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint relatórios dos filtros UE
    And não insiro a UE
    Then retorna o status 500 sem dados de UE pois o código é vazio

  Scenario: Não filtra o código da UE no relatório sem autenticação
    Given que não login não gerou um token de acesso válido
    When tento uma requisição GET para o endpoint relatórios filtros com UE
    Then retorna o status 401 sem dados da UE no ano

  Scenario: Filtra modalidade das UEs no relatório
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint relatórios modalidade filtros com UE
    Then retorna o status 200 com dados de UE das modalidades no ano

  Scenario: Ano letivo é obrigatório ao filtrar a UE no relatório de modalidade
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint relatórios filtros UE modalidades
    And não insire ano letivo
    Then retorna o status 500 sem dados de UE no ano inválido

  Scenario: UE é obrigatória ao filtrar por código no relatório de modalidade
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint relatórios dos filtros UE modalidades
    And não insire a UE
    Then retorna o status 500 sem dados de UE do código é vazio

  Scenario: Histórico é obrigatório ao filtrar por código no relatório de modalidade
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint relatórios dos filtros modalidades
    And não insiro histórico
    Then retorna o status 500 sem dados de UE do histórico vazio

  Scenario: Não filtra o código da UE no relatório modalidade sem autenticação
    Given que não login não gerou um token de acesso válido
    When tento requisição GET para o endpoint relatórios modalidade filtros com UE
    Then retorna o status 401 sem dados da UE do ano

   Scenario: Filtra modalidade e abrangencias das UEs no relatório
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint relatórios modalidade e abrangencias de filtros da UE
    Then retorna o status 200 com dados de abrangencias da UE

  Scenario: UE é obrigatória ao filtrar relatório de modalidade com abrangencia
    Given que login gerou um token de acesso válido
    When envio requisição GET para endpoint relatórios dos filtros de abrangencias da modalidade
    And não insiro ano letivo no filtro
    Then retorna o status 500 sem dados de abrangencias da UE

  Scenario: Não filtra modalidade e abrangencias das UEs no relatório
    Given que não login não gerou um token de acesso válido
    When tento requisição GET para endpoint relatórios modalidade e abrangencias de filtros da UE
    Then retorna o status 401 sem dados de abrangencias da UE

  Scenario: Filtra modalidade dos anos escolares no relatório
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint relatórios modalidade no ano escolar
    Then retorna o status 200 com valor e descrição da modalidade

  Scenario: UE é obrigatória ao filtrar modalidade dos anos escolares
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint relatórios modalidade do ano escolar
    And não insiro a UE ao filtrar
    Then retorna o status 500 sem dados de modalidade da UE

  Scenario: Modalidade é obrigatória ao filtrar anos escolares
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint relatórios modalidade ano escolar
    And não seleciono o código ao filtrar
    Then retorna o status 500 sem dados de modalidade no ano

  Scenario: Não filtra modalidade dos anos escolares no relatório sem autenticação
    Given que não login não gerou um token de acesso válido
    When tento a requisição GET para o endpoint relatórios modalidade no ano escolar
    Then retorna o status 401 sem valor e descrição da modalidade

  Scenario: Filtra turmas do ano letivo no relatório
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint relatórios filtrar turmas
    Then retorna o status 200 com turmas no ano letivo

  Scenario: UE é obrigatória ao filtrar turmas do ano letivo no relatório
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint relatórios turmas do ano letivo
    And não insiro UE ao enviar
    Then retorna o status 500 sem dados de UE das turmas

  Scenario: Ano letivo é obrigatória ao filtrar turmas no relatório
    Given que login gerou um token de acesso válido
    When envio requisição GET para o endpoint relatórios turmas do ano letivo
    And não seleciono o ano ao filtrar
    Then retorna o status 500 sem dados de turmas no ano

  Scenario: Não filtra turmas do ano letivo no relatório sem autenticação
    Given que não login não gerou um token de acesso válido
    When tento requisição GET para o endpoint relatórios filtrar turmas
    Then retorna o status 401 sem turmas no ano letivo

  Scenario: Filtra turmas do ano atual no relatório
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint filtrar turmas no ano
    Then retorna o status 200 com turmas do ano atual

  Scenario: UE é obrigatória ao filtrar turmas do ano atual no relatório
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint relatórios turmas do ano 
    And sem UE
    Then retorna o status 500 sem dados de UE das turmas no atual

  Scenario: Ano atual é obrigatória ao filtrar turmas no relatório
    Given que login gerou um token de acesso válido
    When envio requisição GET para o endpoint relatórios turmas atual
    And sem selecionar o ano
    Then retorna o status 500 sem dados devido ao ano

  Scenario: Não filtra turmas do ano atual no relatório
    Given que não login não gerou um token de acesso válido
    When tento requisição GET para o endpoint filtrar turmas no ano
    Then retorna o status 401 sem turmas no ano atual

  Scenario: Filtra ciclos da modalidade na UE
    Given que login gerou um token de acesso válido
    When envio a requisição GET para o endpoint de filtrar ciclos
    Then retorna o status 200 com as modalidades da UE

  Scenario: UE é obrigatória ao filtrar ciclos da modalidade
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de filtrar ciclos da modalidade
    And sem UE selecionada
    Then retorna o status 500 sem dados de UE neste ciclo

  Scenario: Modalidade é obrigatória ao filtrar ciclos da turma
    Given que login gerou um token de acesso válido
    When envio requisição GET para o endpoint de filtrar ciclos modalidade
    And sem selecionar modalidade
    Then retorna o status 500 sem dados de ciclos da UE

  Scenario: Não filtra turmas do ano atual no relatório
    Given que não login não gerou um token de acesso válido
    When tento requisição GET para o endpoint filtrar turmas no ano
    Then retorna o status 401 sem turmas no ano atual

  Scenario: Filtra componentes curriculares da modalidade na UE
    Given que login gerou um token de acesso válido
    When envio a requisição GET para o endpoint de filtrar modalidade
    Then retorna o status 200 e componentes curriculares da UE

  Scenario: UE é obrigatória ao filtrar componentes curriculares da modalidade
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de filtrar componentes curriculares
    And sem UE selecionada da modalidade
    Then retorna o status 500 sem dados de UE neste componentes

  Scenario: Modalidade é obrigatória ao filtrar componentes curriculares
    Given que login gerou um token de acesso válido
    When envio requisição GET para endpoint de filtrar componentes curriculares
    And sem selecionar o código da modalidade
    Then retorna o status 500 sem dados de componentes da UE

  Scenario: Ano letivo é obrigatório ao filtrar componentes curriculares da modalidade
    Given que login gerou um token de acesso válido
    When envio requisição GET para o endpoint filtrar componentes curriculares
    And sem selecionar o ano letivo
    Then retorna o status 500 sem dados da modalidade no ano

  Scenario: Não filtra componentes curriculares da modalidade na UE
    Given que não login não gerou um token de acesso válido
    When tento a requisição GET para o endpoint de filtrar modalidade
    Then retorna o status 401 sem componentes curriculares da modalidade

  Scenario: Filtra tipos de visualização da ata final
    Given que login gerou um token de acesso válido
    When envio a requisição GET para o endpoint de filtrar a ata final
    Then retorna o status 200 com os tipos de visualização

  Scenario: Não filtra tipos de visualização da ata final sem autenticação
    Given que não login não gerou um token de acesso válido
    When tento a requisição GET para o endpoint de filtrar a ata final
    Then retorna o status 401 sem os tipos de visualização

  Scenario: Filtra modalidade dos bimestres
    Given que login gerou um token de acesso válido
    When envio a requisição GET para o endpoint de filtrar a modalidade
    Then retorna o status 200 com as modalidades dos bimestres

  Scenario: Modalidade é obrigatória ao filtrar componentes curriculares
    Given que login gerou um token de acesso válido
    When envio requisição GET para o endpoint de filtrar a modalidade
    And sem o código da modalidade
    Then retorna o status 500 sem dados dos bimestres

  Scenario: Não filtra modalidade dos bimestres sem autenticação
    Given que não login não gerou um token de acesso válido
    When tento a requisição GET para o endpoint de filtrar a modalidade
    Then retorna o status 401 sem as modalidades dos bimestres

  Scenario: Filtra as situações de acompanhamento do fechamento
    Given que login gerou um token de acesso válido
    When envio a requisição GET para o endpoint de filtrar situações do fechamento
    Then retorna o status 200 do acompanhamento

  Scenario: Não filtra as situações de acompanhamento do fechamento sem autenticação
    Given que não login não gerou um token de acesso válido
    When tento a requisição GET para o endpoint de filtrar situações do fechamento
    Then retorna o status 401 sem acompanhamento

  Scenario: Filtra as situações de acompanhamento do conselho de classe
    Given que login gerou um token de acesso válido
    When envio a requisição GET para endpoint de filtrar situações do fechamento
    Then retorna o status 200 do conselho de classe

  Scenario: Não filtra as situações de acompanhamento do conselho de classe sem autenticação
    Given que não login não gerou um token de acesso válido
    When tento a requisição GET para endpoint de filtrar situações do fechamento
    Then retorna o status 401 sem conselho de classe