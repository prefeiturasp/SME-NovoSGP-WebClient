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