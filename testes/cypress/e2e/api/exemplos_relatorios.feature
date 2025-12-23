# language: pt

Funcionalidade: API - Exemplos relatórios

  Cenário: Retorna dados de relatórios
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de exemplos relatórios    
    Então retorna o relatório com status 200

  Cenário: Não retorna relatório sem usuário autenticado
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint de exemplos relatórios
    Então retorna o status 401 sem dados

