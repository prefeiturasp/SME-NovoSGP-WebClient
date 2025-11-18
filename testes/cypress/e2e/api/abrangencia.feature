Feature: API - Abrangência

  Scenario: Filtra a abrangência sem considerar histórico
    Given que possuo um token de acesso válido
    When envio uma requisição GET de filtro da abrangência
    Then retorna os dados com status 204 sem considerar histórico

  Scenario: Não filtra a abrangência sem considerar histórico
    Given que possuo um token de acesso válido
    When envio uma requisição GET sem filtro da abrangência
    Then retorna os dados com status 204 e sem considerar histórico

 Scenario: Filtra a abrangência considerando histórico
    Given que possuo um token de acesso válido
    When envio uma requisição GET com filtro da abrangência
    Then retorna os dados com status 204 considerando histórico

  Scenario: Não filtra a abrangência considerando histórico
    Given que possuo um token de acesso válido
    When envio uma requisição GET não filtrando a abrangência
    Then retorna os dados com status 204 mas considerando histórico

  Scenario: Campo de filtro é obrigatório ao filtrar abrangência
    Given que possuo um token de acesso válido
    When envio uma requisição GET sem o campo de filtro
    Then retorna o status 500 que o filtro é inválido

  Scenario: Campo de considerar histórico é obrigatório ao filtrar abrangência
    Given que possuo um token de acesso válido
    When envio uma requisição GET sem o campo de histórico
    Then retorna o status 500 que o considerar o histórico é inválido

  Scenario: Não retorna quantidade do apanhado geral sem autenticação
    Given que não possuo um token de acesso válido
    When tento a requisição GET de filtro da abrangência
    Then não os dados de filtro de abrangência mostrando o status 401

  Scenario: Filtra considerando histórico da UE por modalidade no ano letivo
    Given que possuo um token de acesso válido
    When envio uma requisição GET de filtro da abrangência da UE por modalidade
    Then retorna os dados da UE com status 204 considerando histórico

  Scenario: Filtra sem histórico da UE por modalidade no ano letivo
    Given que possuo um token de acesso válido
    When envio uma requisição GET de filtro de abrangência da UE por modalidade
    Then retorna os dados da UE com status 200 sem histórico

  Scenario: UE deve ser obrigatório no filtro por modalidade no ano letivo
    Given que possuo um token de acesso válido
    When envio uma requisição GET de filtro de abrangência sem UE por modalidade
    Then não retorna os dados da UE com status 500 sem histórico

  Scenario: Modalidade deve ser obrigatório no filtro por UE no ano letivo
    Given que possuo um token de acesso válido
    When envio uma requisição GET de filtro de abrangência sem modalidade por UE
    Then não retorna os dados da UE com status 500 sem modalidade

   Scenario: Ano letivo deve ser obrigatório no filtro por UE da abrangência
    Given que possuo um token de acesso válido
    When envio uma requisição GET de filtro de abrangência sem ano letivo
    Then não retorna os dados da UE com status 500 filtrada

  Scenario: Histórico deve ser obrigatório no filtro por UE da abrangência
    Given que possuo um token de acesso válido
    When envio uma requisição GET de filtro de abrangência sem o histórico
    Then não retorna os dados da UE com status 500

  Scenario: Não filtrar abrangência da UE por modalidade no ano letivo sem autenticação
    Given que não possuo um token de acesso válido
    When tento o envio uma requisição GET de filtro da abrangência da UE por modalidade
    Then não retorna os dados da UE com status 401 no ano letivo

  Scenario: Retorna as abrangências dos anos letivos com histórico
    Given que possuo um token de acesso válido
    When envio uma requisição GET de abrangências dos anos letivos
    Then retorna o status 200 com histórico do ano
  
  Scenario: Retorna as abrangências dos anos letivos sem histórico
    Given que possuo um token de acesso válido
    When envio uma requisição GET de abrangências de anos letivos
    Then retorna o status 200 sem histórico do ano

  Scenario: Não retorna as abrangências dos anos letivos sem autenticação
    Given que não possuo um token de acesso válido
    When tento uma requisição GET de abrangências dos anos letivos
    Then retorna o status 401 sem histórico do ano

  Scenario: Retorna as abrangências de todos anos letivos com histórico
    Given que possuo um token de acesso válido
    When envio uma requisição GET de abrangências de todos anos letivos
    Then retorna o status 200 com histórico dos anos
  
  Scenario: Retorna as abrangências de todos anos letivos sem histórico
    Given que possuo um token de acesso válido
    When envio uma requisição GET de abrangências todos anos letivos
    Then retorna o status 200 sem histórico dos anos

  Scenario: Não retorna as abrangências de todos anos letivos sem autenticação
    Given que não possuo um token de acesso válido
    When tento uma requisição GET de abrangências de todos anos letivos
    Then retorna o status 401 sem histórico dos anos

  Scenario: Retorna as abrangências de DREs com histórico
    Given que possuo um token de acesso válido
    When envio uma requisição GET de abrangências de DREs
    Then retorna o status 200 com histórico de DREs
  
  Scenario: Retorna as abrangências de DREs sem histórico
    Given que possuo um token de acesso válido
    When envio uma requisição GET de abrangências das DREs
    Then retorna o status 200 sem histórico de DREs

  Scenario: Não retorna as abrangências de DREs sem autenticação
    Given que não possuo um token de acesso válido
    When tento uma requisição GET de abrangências de DREs
    Then retorna o status 401 sem histórico de DREs

  Scenario: Retorna modalidades das abrangências com histórico
    Given que possuo um token de acesso válido
    When envio uma requisição GET de abrangências de modalidades
    Then retorna o status 200 com histórico de modalidades
  
  Scenario: Retorna modalidades das abrangências de DREs sem histórico
    Given que possuo um token de acesso válido
    When envio uma requisição GET de abrangências das modalidades
    Then retorna o status 200 sem histórico de modalidades

  Scenario: Não retorna as modalidades de abrangência sem autenticação
    Given que não possuo um token de acesso válido
    When tento uma requisição GET de abrangências de modalidades
    Then retorna o status 401 sem histórico modalidades

  Scenario: Retorna semestres das abrangências com histórico
    Given que possuo um token de acesso válido
    When envio uma requisição GET de abrangências de semestres
    Then retorna o status 200 com histórico de semestres
  
  Scenario: Retorna semestres das abrangências de DREs sem histórico
    Given que possuo um token de acesso válido
    When envio uma requisição GET de abrangências das semestres
    Then retorna o status 200 sem histórico de semestres

  Scenario: Não retorna as semestres de abrangência sem autenticação
    Given que não possuo um token de acesso válido
    When tento uma requisição GET de abrangências de semestres
    Then retorna o status 401 sem histórico semestres

  Scenario: Retorna abrangências da turma com histórico
    Given que possuo um token de acesso válido
    When envio uma requisição GET de abrangências da turma
    Then retorna o status 200 com histórico da turma
  
  Scenario: Retorna abrangências da turma sem histórico
    Given que possuo um token de acesso válido
    When envio uma requisição GET de abrangências de turma
    Then retorna o status 200 sem histórico de turma

  Scenario: Não retorna as turmas de abrangência sem autenticação
    Given que não possuo um token de acesso válido
    When tento uma requisição GET de abrangências da turma
    Then retorna o status 401 sem histórico de turmas

  Scenario: Retorna abrangências da turma vigente
    Given que possuo um token de acesso válido
    When envio uma requisição GET de abrangências das turmas 
    Then retorna o status 200 com as vigentes

  Scenario: Não retorna abrangências da turma vigente sem autenticação
    Given que não possuo um token de acesso válido
    When tento uma requisição GET de abrangências das turmas
    Then retorna o status 401 sem vigentes

  Scenario: Retorna abrangências de adm com histórico
    Given que possuo um token de acesso válido
    When envio uma requisição GET de abrangências do adm
    Then retorna o status 200 com histórico de adm
  
  Scenario: Retorna abrangências de adm sem histórico
    Given que possuo um token de acesso válido
    When envio uma requisição GET de abrangências de adm
    Then retorna o status 200 sem histórico de adm

  Scenario: Não retorna as turmas de adm sem autenticação
    Given que não possuo um token de acesso válido
    When tento uma requisição GET de abrangências de adm
    Then retorna o status 401 sem histórico de adm

  Scenario: Retorna abrangências do perfil do usuário
    Given que possuo um token de acesso válido
    When envio uma requisição GET de abrangências de perfil
    Then retorna o status 200 da consulta do usuário

  Scenario: Não retorna abrangências do perfil do usuário
    Given que não possuo um token de acesso válido
    When tento uma requisição GET de abrangências de perfil
    Then retorna o status 401 sem consulta do usuário

  Scenario: Sincronizar abrangências do perfil no ano letivo
    Given que possuo um token de acesso válido
    When envio uma requisição POST de sincronizar abrangências do professor
    Then retorna o status 200 do ano letivo sincronizado

  Scenario: Não sincronizar abrangências do perfil no ano letivo
    Given que não possuo um token de acesso válido
    When tento uma requisição POST de sincronizar abrangências do professor
    Then retorna o status 401 sem ano letivo sincronizado

  Scenario: Considera histórico de abrangências da DRE
    Given que possuo um token de acesso válido
    When envio uma requisição GET abrangências da DRE
    Then retorna o status 200 com histórico da DRE na UE

  Scenario: Não considera histórico de abrangências da DRE
    Given que possuo um token de acesso válido
    When envio uma requisição GET abrangências de DRE
    Then retorna o status 200 sem histórico da DRE na UE

  Scenario: Não busca histórico de abrangências da DRE sem autenticação
    Given que não possuo um token de acesso válido
    When tento uma requisição GET abrangências da DRE
    Then retorna o status 401 histórico da DRE na UE

  Scenario: Considera histórico de abrangências das turmas regulares
    Given que possuo um token de acesso válido
    When envio uma requisição GET abrangências das turmas regulares
    Then retorna o status 204 com histórico da turma na UE

  Scenario: Não considera histórico de abrangências das turmas regulares
    Given que possuo um token de acesso válido
    When envio uma requisição GET abrangências das turmas regulares
    Then retorna o status 204 sem histórico da turma na UE

  Scenario: Histórico é obrigatório na abrangências nas turmas regulares
    Given que possuo um token de acesso válido
    When envio uma requisição GET abrangências sem histórico da UE
    Then retorna o status 500 histórico é obrigatório nas regulares

  Scenario: UE é obrigatório na abrangências das turmas regulares
    Given que possuo um token de acesso válido
    When envio uma requisição GET abrangências sem UE
    Then retorna o status 500 a UE é obrigatório

  Scenario: Não busca histórico de abrangências das turmas regulares sem autenticação
    Given que não possuo um token de acesso válido
    When tento uma requisição GET abrangências das turmas regulares
    Then retorna o status 401 histórico da turmas na UE

  Scenario: Considera histórico de abrangências da disciplina na UE
    Given que possuo um token de acesso válido
    When envio uma requisição GET abrangências da disciplina na UE
    Then retorna o status 204 com histórico da disciplina na UE

  Scenario: Não considera histórico de abrangências da disciplina na UE
    Given que possuo um token de acesso válido
    When envio uma requisição GET abrangências de disciplina na UE
    Then retorna o status 200 sem histórico da disciplina na UE

  Scenario: Histórico é obrigatório na abrangências da disciplina na UE
    Given que possuo um token de acesso válido
    When envio uma requisição GET abrangências sem histórico da disciplina na UE
    Then retorna o status 500 histórico é obrigatório disciplina

  Scenario: UE é obrigatório na abrangências da disciplina na UE
    Given que possuo um token de acesso válido
    When envio uma requisição GET abrangências da disciplina na UE
    Then retorna o status 204 a UE é obrigatório na disciplina

  Scenario: Disciplina é obrigatória na abrangências da UE
    Given que possuo um token de acesso válido
    When envio uma requisição GET abrangências sem disciplina da UE
    Then retorna o status 500 que a disciplina é obrigatória

  Scenario: Ano letivo é obrigatório na abrangências da disciplina na UE
    Given que possuo um token de acesso válido
    When envio uma requisição GET abrangências sem ano letivo da UE
    Then retorna o status 422 o ano é obrigatório na disciplina

  Scenario: Não busca histórico de abrangências das turmas regulares sem autenticação
    Given que não possuo um token de acesso válido
    When tento uma requisição GET abrangências das turmas regulares
    Then retorna o status 401 histórico da turmas na UE