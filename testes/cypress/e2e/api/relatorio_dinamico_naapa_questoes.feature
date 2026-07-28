# language: pt

Funcionalidade: API - Relatório dinâmico de questões NAAPA

  Cenário: Retorna os grupos de questões
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET ao NAAPA dinâmico
    Então retorna o status 200 com os grupos de questões

  Cenário: Não retorna dados sem usuário autenticado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET ao NAAPA dinâmico
    Então não retorna os dados mostrando o status 401

  Cenário: Carrega os dados do relatório
    Dado que possuo um token de acesso válido
    Quando envio uma requisição POST para NAAPA dinâmico
    Então carrega o status 200 o relatório dinâmico NAAPA

  Cenário: Não retorna dados sem usuário autenticado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição POST para NAAPA dinâmico
    Então não retorna o relatório dinâmico NAAPA mostrando o status 401

