# language: pt

Funcionalidade: API - Reiniciar senha do usuário

  Cenário: Reiniciar senha de usuário válido
    Dado que possuo um token de acesso válido
    Quando envio uma requisição PUT para reiniciar a senha
    Então deve confirmar com status 200

  Cenário: Não reiniciar para usuário inválido
    Dado que possuo um token de acesso válido
    Quando envio uma requisição PUT para reiniciar a senha de usuário inválido
    Então retorna o status 601 que não foi possível reiniciar deste usuário

  Cenário: Código da DRE deve ser obrigatório
    Dado que possuo um token de acesso válido
    Quando envio uma requisição PUT sem a DRE para reiniciar a senha
    Então retorna erro informando que o código da DRE é obrigatório
