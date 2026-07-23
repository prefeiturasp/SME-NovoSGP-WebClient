# language: pt

Funcionalidade: API - Reiniciar senha do usuário

  Contexto:
    Dado que possuo um token de acesso válido

  Cenário: Reiniciar senha de usuário válido
    Quando envio uma requisição PUT para reiniciar a senha
    Então deve confirmar com status 200

  Cenário: Validar resposta de sucesso com dados consistentes
    Quando envio uma requisição PUT para reiniciar a senha
    Então deve confirmar com status 200

  Cenário: Validar comportamento em múltiplas requisições consecutivas
    Quando envio uma requisição PUT para reiniciar a senha
    Então deve confirmar com status 200

  Cenário: Não reiniciar para usuário inválido
    Quando envio uma requisição PUT para reiniciar a senha de usuário inválido
    Então retorna o status 601 que não foi possível reiniciar deste usuário

  Cenário: Validar consistência do erro para usuário inválido
    Quando envio uma requisição PUT para reiniciar a senha de usuário inválido
    Então retorna o status 601 que não foi possível reiniciar deste usuário

  Cenário: Código da DRE deve ser obrigatório
    Quando envio uma requisição PUT sem a DRE para reiniciar a senha
    Então retorna erro informando que o código da DRE é obrigatório

  Cenário: Validar mensagem de erro ao não informar DRE
    Quando envio uma requisição PUT sem a DRE para reiniciar a senha
    Então retorna erro informando que o código da DRE é obrigatório

  Cenário: Validar tentativa de reinício com dados inconsistentes
    Quando envio uma requisição PUT para reiniciar a senha de usuário inválido
    Então retorna o status 601 que não foi possível reiniciar deste usuário

  Cenário: Validar estabilidade da API em chamadas repetidas
    Quando envio uma requisição PUT para reiniciar a senha
    Então deve confirmar com status 200