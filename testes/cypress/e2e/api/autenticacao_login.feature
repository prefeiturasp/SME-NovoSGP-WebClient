# language: pt

Funcionalidade: API - Autenticação do acesso de usuário

  Cenário: Permitir realizar login com credenciais válidas
    Dado que vou autenticar
    Quando envio a requisição POST com credenciais válidas
    Então realiza o login com sucesso

  Cenário: Não autorizar acesso com usuário inválido
    Dado que vou autenticar
    Quando envio a requisição POST com usuário inválido
    Então não autoriza acesso

  Cenário: Não autorizar acesso com senha inválida
    Dado que vou autenticar
    Quando envio a requisição POST com senha inválida
    Então não autoriza acesso o login

  Cenário: Não autorizar acesso com usuário inexistente
    Dado que vou autenticar
    Quando envio a requisição POST com usuário inexistente
    Então retorna não autorizado

  Cenário: Usuário deve ser inserido para acesso
    Dado que vou autenticar
    Quando envio a requisição POST com usuário vazio
    Então retorna que usuário deve ser inserido para acesso

  Cenário: Não permitir acesso sem inserir a senha
    Dado que vou autenticar
    Quando envio a requisição POST com senha vazia
    Então não permitir acesso sem inserir a senha

<<<<<<< HEAD
 Cenário: Realizar múltiplos logins válidos consecutivos
    Dado que vou autenticar
    Quando envio a requisição POST com credenciais válidas
    Então realiza o login com sucesso

  Cenário: Garantir que login com usuário inválido continue bloqueado
    Dado que vou autenticar
    Quando envio a requisição POST com usuário inválido
    Então não autoriza acesso

  Cenário: Garantir que login com senha inválida continue bloqueado
    Dado que vou autenticar
    Quando envio a requisição POST com senha inválida
    Então não autoriza acesso o login

  Cenário: Garantir que usuário inexistente não obtenha acesso
    Dado que vou autenticar
    Quando envio a requisição POST com usuário inexistente
    Então retorna não autorizado

  Cenário: Validar que usuário vazio não é permitido
    Dado que vou autenticar
    Quando envio a requisição POST com usuário vazio
    Então retorna que usuário deve ser inserido para acesso

  Cenário: Validar que senha vazia não é permitida
    Dado que vou autenticar
    Quando envio a requisição POST com senha vazia
    Então não permitir acesso sem inserir a senha
=======
>>>>>>> 30bf60295d01cd530ce194fd0d6be7b5374d3805
