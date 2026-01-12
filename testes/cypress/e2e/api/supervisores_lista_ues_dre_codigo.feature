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

