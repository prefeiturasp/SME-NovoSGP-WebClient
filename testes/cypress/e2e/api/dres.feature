# language: pt

Funcionalidade: API - Buscar DREs, UE e sem tipos de responsável

  Cenário: Retornar todas as DREs cadastradas
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint DREs
    Então retorna todas DREs cadastradas com status 200

  Cenário: Sem retornar DREs quando usuário não está autenticado
    Dado não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint DREs
    Então retorna o status 401 sem dados de DREs

  Cenário: Buscar todas UEs sem Assistente Social
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint buscar sem atribuição
    E insiro o tipo de responsável Assistente Social
    Então retorna todas UEs com status 200

  Cenário: Buscar todas UEs sem PAAI
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint buscar sem atribuição
    E insiro o tipo de responsável PAAI
    Então retorna todas UEs com status 200

  Cenário: Buscar todas UEs sem Psicólogo Escolar
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint buscar sem atribuição
    E insiro o tipo de responsável Psicólogo Escolar
    Então retorna todas UEs com status 200

  Cenário: Buscar todas UEs sem Psicopedagogo
  Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint buscar sem atribuição
    E insiro o tipo de responsável Psicopedagogo
    Então retorna todas UEs com status 200

  Cenário: Buscar todas UEs sem Supervisor Escolar
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint buscar sem atribuição
    E insiro o tipo de responsável Supervisor Escolar
    Então retorna todas UEs com status 200

  Cenário: DRE deve ser informada
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint buscar sem DRE    
    Então deve retornar status 404 sem nenhuma UE

  Cenário: Tipo de responsável deve ser informado
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint buscar sem tipo de responsável
    Então deve retornar status 404 sem nenhum responsável

  Cenário: Sem retornar UES quando usuário não está autenticado
    Dado não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint de buscar DRE sem atribuição
    Então retorna o status 401 sem dados de UEs
@ignore
  Cenário: Retornar todas as UEs cadastradas
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de UEs na DRE
    Então retorna todas UEs cadastradas com status 200

  Cenário: DRE deve ser informada para buscar UE
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint sem DRE da UE
    Então retorna sem UE com status 500

  Cenário: Sem retornar UEs quando usuário não está autenticado
    Dado não gerou um token de acesso válido
    Quando tento uma requisição GET para o endpoint de UEs na DRE
    Então retorna o status 401 sem dados de UEs