# language: pt

Funcionalidade: API - Lista UEs através do código da DRE

  Cenário: Listar todas UEs através da DRE
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET de supervisores responsável
    Então carrega o status 200 com todas UEs através da DRE

  Cenário: Código da DRE deve ser obrigatório
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para supervisores sem dre
    Então carrega o status 500 que a DRE do responsável deve ser obrigatório

  Cenário: Não retornar dados sem usuário autenticado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET de supervisores responsável
    Então não retorna todos os códigos e tipostodas UEs através da DRE mostrando o status 401

  Cenário: Não retorna dados com token expirado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET de supervisores responsável
    Então não retorna todos os códigos e tipostodas UEs através da DRE mostrando o status 401

  Cenário: Garante consistência ao consultar múltiplas vezes com DRE válida
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET de supervisores responsável
    Então carrega o status 200 com todas UEs através da DRE

  Cenário: Garante que DRE continua obrigatória mesmo após sucesso anterior
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para supervisores sem dre
    Então carrega o status 500 que a DRE do responsável deve ser obrigatório

  Cenário: Valida acesso autorizado após tentativa não autorizada
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET de supervisores responsável
    Então carrega o status 200 com todas UEs através da DRE

  Cenário: Garante que chamadas repetidas sem autenticação continuam bloqueadas
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET de supervisores responsável
    Então não retorna todos os códigos e tipostodas UEs através da DRE mostrando o status 401

  Cenário: Garante que ausência de DRE sempre retorna erro em chamadas repetidas
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para supervisores sem dre
    Então carrega o status 500 que a DRE do responsável deve ser obrigatório