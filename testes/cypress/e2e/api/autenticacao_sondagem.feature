# language: pt

Funcionalidade: API - Autenticação de acesso ao Sondagem

  Cenário: Permitir realizar acesso ao Sondagem com credenciais válidas
    Dado que possuo um token de acesso válido
    E vou autenticar no Sondagem
    Quando envio a requisição POST com credenciais válidas para o endpoint de autenticação do Sondagem
    Então realiza o acesso com sucesso ao Sondagem

  Cenário: Não autorizar acesso ao Sondagem com credenciais inválidas
    Dado que possuo um token de acesso inválido
    E vou autenticar no Sondagem
    Quando envio a requisição POST com credenciais inválidas para o endpoint de autenticação do Sondagem
    Então não autoriza acesso ao Sondagem
