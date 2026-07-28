# language: pt

Funcionalidade: API - Dados de atribuições da DRE

  Cenário: Retorna dados da DRE
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET do endpoint de atribuições de UEs
    Então retorna o status 200 e dados da DRE atribuídas

  Cenário: Garantir que o retorno contenha estrutura válida das atribuições
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET do endpoint de atribuições de UEs
    Então retorna o status 200 e dados da DRE atribuídas

  Cenário: Retorna dados da DRE no ano letivo
    Dado que possuo um token de acesso válido
    Quando envio a requisição GET de atribuições de UEs no ano letivo
    Então retorna o status 200 e dados da DRE atribuídas no ano

  Cenário: Garantir que os dados retornados estejam consistentes no ano letivo
    Dado que possuo um token de acesso válido
    Quando envio a requisição GET de atribuições de UEs no ano letivo
    Então retorna o status 200 e dados da DRE atribuídas no ano

  Cenário: Código da DRE deve ser obrigatório
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET do endpoint de atribuições de UEs sem a DRE
    Então retorna o status 500 que sem dados atribuições que DRE deve ser obrigatório

  Cenário: Não retornar dados quando código da DRE não for informado
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET do endpoint de atribuições de UEs sem a DRE
    Então retorna o status 500 que sem dados atribuições que DRE deve ser obrigatório

  Cenário: Não retorna dados sem usuário autenticado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET do endpoint de atribuições de UEs
    Então não retorna dados da DRE atribuídas mostrando o status 401

  Cenário: Não retorna dados com token inválido
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET do endpoint de atribuições de UEs
    Então não retorna dados da DRE atribuídas mostrando o status 401

  Cenário: Não retorna dados com token expirado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET do endpoint de atribuições de UEs
    Então não retorna dados da DRE atribuídas mostrando o status 401
