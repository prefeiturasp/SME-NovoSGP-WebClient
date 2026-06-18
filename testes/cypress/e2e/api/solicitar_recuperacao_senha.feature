# language: pt

Funcionalidade: API - Recuperação de senha do usuário

  Cenário: Solicitar recuperação de senha para usuário válido
    Dado que possuo um token de acesso válido
    Quando envio uma requisição POST para recuperar a senha
    Então solicita recuperação de senha para usuário válido

  Cenário: Usuário deve ser informado para recuperação de senha
    Dado que possuo um token de acesso válido
    Quando envio uma requisição POST de recuperar a senha
    Então o usuário deve ser informado para recuperação de senha

  Cenário: Não solicitar recuperação para usuário inválido
    Dado que não possuo um token de acesso válido
    Quando tento a requisição POST para recuperar a senha
    Então não solicita recuperação para usuário inválido

  Cenário: Não solicitar recuperação com token expirado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição POST para recuperar a senha
    Então não solicita recuperação para usuário inválido

  Cenário: Garante consistência ao solicitar recuperação múltiplas vezes
    Dado que possuo um token de acesso válido
    Quando envio uma requisição POST para recuperar a senha
    Então solicita recuperação de senha para usuário válido

  Cenário: Garante que usuário continua obrigatório após sucesso anterior
    Dado que possuo um token de acesso válido
    Quando envio uma requisição POST de recuperar a senha
    Então o usuário deve ser informado para recuperação de senha

  Cenário: Valida acesso autorizado após tentativa não autorizada
    Dado que possuo um token de acesso válido
    Quando envio uma requisição POST para recuperar a senha
    Então solicita recuperação de senha para usuário válido

  Cenário: Garante que ausência de usuário sempre retorna erro mesmo em chamadas repetidas
    Dado que possuo um token de acesso válido
    Quando envio uma requisição POST de recuperar a senha
    Então o usuário deve ser informado para recuperação de senha