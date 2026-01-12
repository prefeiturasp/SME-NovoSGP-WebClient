# language: pt

Funcionalidade: API - Lista o código e tipo de responsável

  Cenário: Listar todos os códigos e tipos
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para supervisores responsável
    Então carrega o status 200 com todos os códigos e tipos

  Cenário: Não retornar dados sem usuário autenticado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET para supervisores responsável
    Então não retorna todos os códigos e tipos mostrando o status 401

