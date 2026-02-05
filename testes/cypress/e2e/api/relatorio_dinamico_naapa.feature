# language: pt

Funcionalidade: API - Relatório dinâmico NAAPA

  Cenário: Carrega os dados do relatório
    Dado que possuo um token de acesso válido
    Quando envio uma requisição POST para NAAPA dinâmico
    Então carrega o status 200 o relatório dinâmico NAAPA

  Cenário: Não retorna dados sem usuário autenticado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição POST para NAAPA dinâmico
    Então não retorna o relatório dinâmico NAAPA mostrando o status 401

