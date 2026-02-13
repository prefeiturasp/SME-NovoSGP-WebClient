# language: pt

Funcionalidade: API - Abrangência

  Cenário: Filtra a abrangência sem considerar histórico
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET de filtro da abrangência
    Então retorna os dados com status 204 sem considerar histórico

  Cenário: Não filtra a abrangência sem considerar histórico
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET sem filtro da abrangência
    Então retorna os dados com status 204 e sem considerar histórico

  Cenário: Filtra a abrangência considerando histórico
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET com filtro da abrangência
    Então retorna os dados com status 204 considerando histórico

  Cenário: Não filtra a abrangência considerando histórico
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET não filtrando a abrangência
    Então retorna os dados com status 204 mas considerando histórico

  Cenário: Campo de filtro é obrigatório ao filtrar abrangência
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET sem o campo de filtro
    Então retorna o status 500 que o filtro é inválido

  Cenário: Campo de considerar histórico é obrigatório ao filtrar abrangência
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET sem o campo de histórico
    Então retorna o status 500 que o considerar o histórico é inválido

  Cenário: Não retorna quantidade do apanhado geral sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET de filtro da abrangência
    Então não os dados de filtro de abrangência mostrando o status 401

  Cenário: Filtra considerando histórico da UE por modalidade no ano letivo
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET de filtro da abrangência da UE por modalidade
    Então retorna os dados da UE com status 204 considerando histórico

@ignore
  Cenário: Filtra sem histórico da UE por modalidade no ano letivo
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET de filtro de abrangência da UE por modalidade
    Então retorna os dados da UE com status 200 sem histórico

  Cenário: UE deve ser obrigatório no filtro por modalidade no ano letivo
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET de filtro de abrangência sem UE por modalidade
    Então não retorna os dados da UE com status 500 sem histórico

  Cenário: Modalidade deve ser obrigatório no filtro por UE no ano letivo
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET de filtro de abrangência sem modalidade por UE
    Então não retorna os dados da UE com status 500 sem modalidade

   Cenário: Ano letivo deve ser obrigatório no filtro por UE da abrangência
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET de filtro de abrangência sem ano letivo
    Então não retorna os dados da UE com status 500 filtrada

  Cenário: Histórico deve ser obrigatório no filtro por UE da abrangência
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET de filtro de abrangência sem o histórico
    Então não retorna os dados da UE com status 500

  Cenário: Não filtrar abrangência da UE por modalidade no ano letivo sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento o envio uma requisição GET de filtro da abrangência da UE por modalidade
    Então não retorna os dados da UE com status 401 no ano letivo

  Cenário: Retorna as abrangências dos anos letivos com histórico
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET de abrangências dos anos letivos
    Então retorna o status 200 com histórico do ano
  
  Cenário: Retorna as abrangências dos anos letivos sem histórico
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET de abrangências de anos letivos
    Então retorna o status 200 sem histórico do ano

  Cenário: Não retorna as abrangências dos anos letivos sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento uma requisição GET de abrangências dos anos letivos
    Então retorna o status 401 sem histórico do ano

  Cenário: Retorna as abrangências de todos anos letivos com histórico
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET de abrangências de todos anos letivos
    Então retorna o status 200 com histórico dos anos
  
  Cenário: Retorna as abrangências de todos anos letivos sem histórico
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET de abrangências todos anos letivos
    Então retorna o status 200 sem histórico dos anos

  Cenário: Não retorna as abrangências de todos anos letivos sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento uma requisição GET de abrangências de todos anos letivos
    Então retorna o status 401 sem histórico dos anos
@ignore
  Cenário: Retorna as abrangências de DREs com histórico
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET de abrangências de DREs
    Então retorna o status 200 com histórico de DREs
@ignore
  Cenário: Retorna as abrangências de DREs sem histórico
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET de abrangências das DREs
    Então retorna o status 200 sem histórico de DREs

  Cenário: Não retorna as abrangências de DREs sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento uma requisição GET de abrangências de DREs
    Então retorna o status 401 sem histórico de DREs
@ignore
  Cenário: Retorna modalidades das abrangências com histórico
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET de abrangências de modalidades
    Então retorna o status 200 com histórico de modalidades
@ignore  
  Cenário: Retorna modalidades das abrangências de DREs sem histórico
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET de abrangências das modalidades
    Então retorna o status 200 sem histórico de modalidades

  Cenário: Não retorna as modalidades de abrangência sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento uma requisição GET de abrangências de modalidades
    Então retorna o status 401 sem histórico modalidades
@ignore
  Cenário: Retorna semestres das abrangências com histórico
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET de abrangências de semestres
    Então retorna o status 200 com histórico de semestres
@ignore  
  Cenário: Retorna semestres das abrangências de DREs sem histórico
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET de abrangências das semestres
    Então retorna o status 200 sem histórico de semestres

  Cenário: Não retorna as semestres de abrangência sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento uma requisição GET de abrangências de semestres
    Então retorna o status 401 sem histórico semestres
@ignore
  Cenário: Retorna abrangências da turma com histórico
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET de abrangências da turma
    Então retorna o status 200 com histórico da turma
 @ignore
   Cenário: Retorna abrangências da turma sem histórico
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET de abrangências da turma
    Então retorna o status 200 sem histórico de turma

  Cenário: Não retorna as turmas de abrangência sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento uma requisição GET de abrangências da turma
    Então retorna o status 401 sem histórico de turmas

  Cenário: Retorna abrangências da turma vigente
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET de abrangências das turmas 
    Então retorna o status 200 com as vigentes

  Cenário: Não retorna abrangências da turma vigente sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento uma requisição GET de abrangências das turmas
    Então retorna o status 401 sem vigentes

  Cenário: Retorna abrangências de adm com histórico
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET de abrangências do adm
    Então retorna o status 200 com histórico de adm
  
  Cenário: Retorna abrangências de adm sem histórico
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET de abrangências de adm
    Então retorna o status 200 sem histórico de adm

  Cenário: Não retorna as turmas de adm sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento uma requisição GET de abrangências de adm
    Então retorna o status 401 sem histórico de adm

  Cenário: Retorna abrangências do perfil do usuário
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET de abrangências de perfil
    Então retorna o status 200 da consulta do usuário

  Cenário: Não retorna abrangências do perfil do usuário
    Dado que não possuo um token de acesso válido
    Quando tento uma requisição GET de abrangências de perfil
    Então retorna o status 401 sem consulta do usuário

  Cenário: Sincronizar abrangências do perfil no ano letivo
    Dado que possuo um token de acesso válido
    Quando envio uma requisição POST de sincronizar abrangências do professor
    Então retorna o status 200 do ano letivo sincronizado

  Cenário: Não sincronizar abrangências do perfil no ano letivo
    Dado que não possuo um token de acesso válido
    Quando tento uma requisição POST de sincronizar abrangências do professor
    Então retorna o status 401 sem ano letivo sincronizado
@ignore
  Cenário: Considera histórico de abrangências da DRE
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET abrangências da DRE
    Então retorna o status 200 com histórico da DRE na UE
@ignore
  Cenário: Não considera histórico de abrangências da DRE
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET abrangências de DRE
    Então retorna o status 200 sem histórico da DRE na UE

  Cenário: Não busca histórico de abrangências da DRE sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento uma requisição GET abrangências da DRE
    Então retorna o status 401 histórico da DRE na UE
@ignore
  Cenário: Considera histórico de abrangências das turmas regulares
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET abrangências das turmas regulares
    Então retorna o status 204 com histórico da turma na UE
@ignore
  Cenário: Não considera histórico de abrangências das turmas regulares
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET abrangências das turmas regulares
    Então retorna o status 204 sem histórico da turma na UE

  Cenário: Histórico é obrigatório na abrangências nas turmas regulares
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET abrangências sem histórico da UE
    Então retorna o status 500 histórico é obrigatório nas regulares

  Cenário: UE é obrigatório na abrangências das turmas regulares
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET abrangências sem UE
    Então retorna o status 500 a UE é obrigatório

  Cenário: Não busca histórico de abrangências das turmas regulares sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento uma requisição GET abrangências das turmas regulares
    Então retorna o status 401 histórico da turmas na UE
@ignore
  Cenário: Considera histórico de abrangências da disciplina na UE
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET abrangências da disciplina na UE
    Então retorna o status 204 com histórico da disciplina na UE
@ignore
  Cenário: Não considera histórico de abrangências da disciplina na UE
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET abrangências de disciplina na UE
    Então retorna o status 200 sem histórico da disciplina na UE

  Cenário: Histórico é obrigatório na abrangências da disciplina na UE
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET abrangências sem histórico da disciplina na UE
    Então retorna o status 500 histórico é obrigatório disciplina
@ignore
  Cenário: UE é obrigatório na abrangências da disciplina na UE
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET abrangências da disciplina na UE
    Então retorna o status 204 a UE é obrigatório na disciplina

  Cenário: Disciplina é obrigatória na abrangências da UE
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET abrangências sem disciplina da UE
    Então retorna o status 500 que a disciplina é obrigatória

  Cenário: Ano letivo é obrigatório na abrangências da disciplina na UE
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET abrangências sem ano letivo da UE
    Então retorna o status 422 o ano é obrigatório na disciplina

  Cenário: Não busca histórico de abrangências das turmas regulares sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento uma requisição GET abrangências das turmas regulares
    Então retorna o status 401 histórico da turmas na UE