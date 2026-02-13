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

<<<<<<< HEAD
  Cenário: Validar que a sincronização retorna sucesso com token válido
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para sincronizar através do código da turma
    Então a sincronização aulas infantil retorna com status 200

  Cenário: Validar que múltiplas sincronizações consecutivas continuam retornando sucesso
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para sincronizar através do código da turma
    Então a sincronização aulas infantil retorna com status 200

  Cenário: Validar que a sincronização não ocorre sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento sincronizar através do código da turma com requisição GET
    Então não sincroniza as aulas infantil retornando com status 401

  Cenário: Garantir que requisição inválida continua bloqueada sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento sincronizar através do código da turma com requisição GET
    Então não sincroniza as aulas infantil retornando com status 401


=======
>>>>>>> 30bf60295d01cd530ce194fd0d6be7b5374d3805
