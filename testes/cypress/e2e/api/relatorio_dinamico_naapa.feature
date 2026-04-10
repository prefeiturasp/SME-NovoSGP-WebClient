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

  Cenário: Não retorna dados com token expirado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição POST para NAAPA dinâmico
    Então não retorna o relatório dinâmico NAAPA mostrando o status 401

  Cenário: Garante consistência ao chamar múltiplas vezes com token válido
    Dado que possuo um token de acesso válido
    Quando envio uma requisição POST para NAAPA dinâmico
    Então carrega o status 200 o relatório dinâmico NAAPA

  Cenário: Garante que a API não retorna dados sem autenticação mesmo após sucesso anterior
    Dado que não possuo um token de acesso válido
    Quando tento a requisição POST para NAAPA dinâmico
    Então não retorna o relatório dinâmico NAAPA mostrando o status 401

  Cenário: Valida acesso autorizado após tentativa não autorizada
    Dado que possuo um token de acesso válido
    Quando envio uma requisição POST para NAAPA dinâmico
    Então carrega o status 200 o relatório dinâmico NAAPA