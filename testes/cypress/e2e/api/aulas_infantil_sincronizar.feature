# language: pt

Funcionalidade: API - Sincronizar aulas infantil através do código da turma

  Cenário: Realizar sincronização das aulas infantil
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para sincronizar através do código da turma
    Então a sincronização aulas infantil retorna com status 200

  Cenário: Não sincronizar sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento sincronizar através do código da turma com requisição GET
    Então não sincroniza as aulas infantil retornando com status 401

