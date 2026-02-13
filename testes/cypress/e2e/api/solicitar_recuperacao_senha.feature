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

