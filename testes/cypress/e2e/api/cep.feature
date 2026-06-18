# language: pt

Funcionalidade: API - CEP

  Cenário: Buscar dados com CEP válido
    Dado que possuo um token de acesso
    Quando envio uma requisição GET com CEP válido
    Então retorna o status 200 de confirmação da busca

  Cenário: CEP informado deve ser inválido
    Dado que possuo um token de acesso
    Quando envio uma requisição GET com CEP inválido
    Então retorna o status 204 que não foi possível buscar os dados

  Cenário: CEP deve ser informado para busca
    Dado que possuo um token de acesso
    Quando tento a requisição GET para o endpoint buscar sem o cep
    Então não realiza a consulta retornando o status 500

  Cenário: Não permitir busca de CEP sem autenticação
    Dado que possuo um token de acesso
    Quando envio uma requisição GET com CEP válido
    Então retorna o status 200 de confirmação da busca

  Cenário: Não permitir busca com token inválido
    Dado que possuo um token de acesso
    Quando envio uma requisição GET com CEP inválido
    Então retorna o status 204 que não foi possível buscar os dados

  Cenário: Garantir que o retorno do CEP válido contenha dados obrigatórios
    Dado que possuo um token de acesso
    Quando envio uma requisição GET com CEP válido
    Então retorna o status 200 de confirmação da busca

  Cenário: Garantir que CEP inválido não retorne corpo na resposta
    Dado que possuo um token de acesso
    Quando envio uma requisição GET com CEP inválido
    Então retorna o status 204 que não foi possível buscar os dados
