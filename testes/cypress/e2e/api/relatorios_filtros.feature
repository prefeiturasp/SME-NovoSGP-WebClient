# language: pt

Funcionalidade: API - Relatório filtros

  Cenário: Filtra DREs no relatório
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint relatórios filtros DRE
    Então retorna o status 200 com dados da DRE

  Cenário: Não acessar a versão sem autenticação sem autenticação
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint relatórios filtros DRE
    Então retorna o status 401 sem dados da DRE

  Cenário: Filtra o código da DRE no relatório
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint relatórios filtros o código DRE
    Então retorna o status 200 com dados de DRE no ano

  Cenário: Ano letivo é obrigatório ao filtrar o código da DRE no relatório
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint relatórios filtros código DRE
    E não insiro o ano letivo
    Então retorna o status 422 sem dados de DRE pois o ano é inválido

  Cenário: DRE é obrigatória ao filtrar por código no relatório
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint relatórios filtros código de DRE
    E não insiro a DRE
    Então retorna o status 500 sem dados de DRE pois o código é vazio

  Cenário: Não filtra o código da DRE no relatório sem autenticação
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint relatórios filtros o código DRE
    Então retorna o status 401 sem dados da DRE no ano

  Cenário: Filtra as UEs no relatório
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint relatórios filtros com UE
    Então retorna o status 200 com dados de UE no ano

  Cenário: Ano letivo é obrigatório ao filtrar a UE no relatório
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint relatórios filtros UE
    E não insiro ano letivo
    Então retorna o status 422 sem dados de UE pois o ano é inválido

  Cenário: UE é obrigatória ao filtrar por código no relatório
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint relatórios dos filtros UE
    E não insiro a UE
    Então retorna o status 500 sem dados de UE pois o código é vazio

  Cenário: Não filtra o código da UE no relatório sem autenticação
    Dado que não login não gerou um token de acesso válido
    Quando tento uma requisição GET para o endpoint relatórios filtros com UE
    Então retorna o status 401 sem dados da UE no ano

  Cenário: Filtra modalidade das UEs no relatório
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint relatórios modalidade filtros com UE
    Então retorna o status 200 com dados de UE das modalidades no ano

  Cenário: Ano letivo é obrigatório ao filtrar a UE no relatório de modalidade
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint relatórios filtros UE modalidades
    E não insire ano letivo
    Então retorna o status 500 sem dados de UE no ano inválido

  Cenário: UE é obrigatória ao filtrar por código no relatório de modalidade
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint relatórios dos filtros UE modalidades
    E não insire a UE
    Então retorna o status 500 sem dados de UE do código é vazio

  Cenário: Histórico é obrigatório ao filtrar por código no relatório de modalidade
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint relatórios dos filtros modalidades
    E não insiro histórico
    Então retorna o status 500 sem dados de UE do histórico vazio

  Cenário: Não filtra o código da UE no relatório modalidade sem autenticação
    Dado que não login não gerou um token de acesso válido
    Quando tento requisição GET para o endpoint relatórios modalidade filtros com UE
    Então retorna o status 401 sem dados da UE do ano

   Cenário: Filtra modalidade e abrangencias das UEs no relatório
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint relatórios modalidade e abrangencias de filtros da UE
    Então retorna o status 200 com dados de abrangencias da UE

  Cenário: UE é obrigatória ao filtrar relatório de modalidade com abrangencia
    Dado que login gerou um token de acesso válido
    Quando envio requisição GET para endpoint relatórios dos filtros de abrangencias da modalidade
    E não insiro ano letivo no filtro
    Então retorna o status 500 sem dados de abrangencias da UE

  Cenário: Não filtra modalidade e abrangencias das UEs no relatório
    Dado que não login não gerou um token de acesso válido
    Quando tento requisição GET para endpoint relatórios modalidade e abrangencias de filtros da UE
    Então retorna o status 401 sem dados de abrangencias da UE

  Cenário: Filtra modalidade dos anos escolares no relatório
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint relatórios modalidade no ano escolar
    Então retorna o status 200 com valor e descrição da modalidade

  Cenário: UE é obrigatória ao filtrar modalidade dos anos escolares
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint relatórios modalidade do ano escolar
    E não insiro a UE ao filtrar
    Então retorna o status 500 sem dados de modalidade da UE

  Cenário: Modalidade é obrigatória ao filtrar anos escolares
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint relatórios modalidade ano escolar
    E não seleciono o código ao filtrar
    Então retorna o status 500 sem dados de modalidade no ano

  Cenário: Não filtra modalidade dos anos escolares no relatório sem autenticação
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint relatórios modalidade no ano escolar
    Então retorna o status 401 sem valor e descrição da modalidade

  Cenário: Filtra turmas do ano letivo no relatório
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint relatórios filtrar turmas
    Então retorna o status 200 com turmas no ano letivo

  Cenário: UE é obrigatória ao filtrar turmas do ano letivo no relatório
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint relatórios turmas do ano letivo
    E não insiro UE ao enviar
    Então retorna o status 500 sem dados de UE das turmas

  Cenário: Ano letivo é obrigatória ao filtrar turmas no relatório
    Dado que login gerou um token de acesso válido
    Quando envio requisição GET para o endpoint relatórios turmas do ano letivo
    E não seleciono o ano ao filtrar
    Então retorna o status 500 sem dados de turmas no ano

  Cenário: Não filtra turmas do ano letivo no relatório sem autenticação
    Dado que não login não gerou um token de acesso válido
    Quando tento requisição GET para o endpoint relatórios filtrar turmas
    Então retorna o status 401 sem turmas no ano letivo

  Cenário: Filtra turmas do ano atual no relatório
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint filtrar turmas no ano
    Então retorna o status 200 com turmas do ano atual

  Cenário: UE é obrigatória ao filtrar turmas do ano atual no relatório
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint relatórios turmas do ano 
    E sem UE
    Então retorna o status 500 sem dados de UE das turmas no atual

  Cenário: Ano atual é obrigatória ao filtrar turmas no relatório
    Dado que login gerou um token de acesso válido
    Quando envio requisição GET para o endpoint relatórios turmas atual
    E sem selecionar o ano
    Então retorna o status 500 sem dados devido ao ano

  Cenário: Não filtra turmas do ano atual no relatório
    Dado que não login não gerou um token de acesso válido
    Quando tento requisição GET para o endpoint filtrar turmas no ano
    Então retorna o status 401 sem turmas no ano atual

  Cenário: Filtra ciclos da modalidade na UE
    Dado que login gerou um token de acesso válido
    Quando envio a requisição GET para o endpoint de filtrar ciclos
    Então retorna o status 200 com as modalidades da UE

  Cenário: UE é obrigatória ao filtrar ciclos da modalidade
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de filtrar ciclos da modalidade
    E sem UE selecionada
    Então retorna o status 500 sem dados de UE neste ciclo

  Cenário: Modalidade é obrigatória ao filtrar ciclos da turma
    Dado que login gerou um token de acesso válido
    Quando envio requisição GET para o endpoint de filtrar ciclos modalidade
    E sem selecionar modalidade
    Então retorna o status 500 sem dados de ciclos da UE

  Cenário: Não filtra turmas do ano atual no relatório
    Dado que não login não gerou um token de acesso válido
    Quando tento requisição GET para o endpoint filtrar turmas no ano
    Então retorna o status 401 sem turmas no ano atual

  Cenário: Filtra componentes curriculares da modalidade na UE
    Dado que login gerou um token de acesso válido
    Quando envio a requisição GET para o endpoint de filtrar modalidade
    Então retorna o status 200 e componentes curriculares da UE

  Cenário: UE é obrigatória ao filtrar componentes curriculares da modalidade
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de filtrar componentes curriculares
    E sem UE selecionada da modalidade
    Então retorna o status 500 sem dados de UE neste componentes

  Cenário: Modalidade é obrigatória ao filtrar componentes curriculares
    Dado que login gerou um token de acesso válido
    Quando envio requisição GET para endpoint de filtrar componentes curriculares
    E sem selecionar o código da modalidade
    Então retorna o status 500 sem dados de componentes da UE

  Cenário: Ano letivo é obrigatório ao filtrar componentes curriculares da modalidade
    Dado que login gerou um token de acesso válido
    Quando envio requisição GET para o endpoint filtrar componentes curriculares
    E sem selecionar o ano letivo
    Então retorna o status 500 sem dados da modalidade no ano

  Cenário: Não filtra componentes curriculares da modalidade na UE
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint de filtrar modalidade
    Então retorna o status 401 sem componentes curriculares da modalidade

  Cenário: Filtra tipos de visualização da ata final
    Dado que login gerou um token de acesso válido
    Quando envio a requisição GET para o endpoint de filtrar a ata final
    Então retorna o status 200 com os tipos de visualização

  Cenário: Não filtra tipos de visualização da ata final sem autenticação
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint de filtrar a ata final
    Então retorna o status 401 sem os tipos de visualização

  Cenário: Filtra modalidade dos bimestres
    Dado que login gerou um token de acesso válido
    Quando envio a requisição GET para o endpoint de filtrar a modalidade
    Então retorna o status 200 com as modalidades dos bimestres

  Cenário: Modalidade é obrigatória ao filtrar componentes curriculares
    Dado que login gerou um token de acesso válido
    Quando envio requisição GET para o endpoint de filtrar a modalidade
    E sem o código da modalidade
    Então retorna o status 500 sem dados dos bimestres

  Cenário: Não filtra modalidade dos bimestres sem autenticação
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint de filtrar a modalidade
    Então retorna o status 401 sem as modalidades dos bimestres

  Cenário: Filtra as situações de acompanhamento do fechamento
    Dado que login gerou um token de acesso válido
    Quando envio a requisição GET para o endpoint de filtrar situações do fechamento
    Então retorna o status 200 do acompanhamento

  Cenário: Não filtra as situações de acompanhamento do fechamento sem autenticação
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint de filtrar situações do fechamento
    Então retorna o status 401 sem acompanhamento

  Cenário: Filtra as situações de acompanhamento do conselho de classe
    Dado que login gerou um token de acesso válido
    Quando envio a requisição GET para endpoint de filtrar situações do fechamento
    Então retorna o status 200 do conselho de classe

  Cenário: Não filtra as situações de acompanhamento do conselho de classe sem autenticação
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para endpoint de filtrar situações do fechamento
    Então retorna o status 401 sem conselho de classe