# language: pt

Funcionalidade: API - Busca ativa de crianças e estudantes ausentes

  Cenário: Retornar todas as ausências
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET de ausentes
    Então retorna o status 200 com todas as ausências

  Cenário: Retornar as ausências no dia de hoje
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET de ausentes do dia
    Então retorna o status 200 com ausências de hoje

  Cenário: Retornar as ausências há 2 dias seguidos
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET de ausentes há 2 dias seguidos
    Então retorna o status 200 somente as ausências do filtro

  Cenário: Retornar as ausências há 3 dias seguidos
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET de ausentes há 3 dias seguidos
    Então retorna o status 200 somente as ausências do filtro

  Cenário: Retornar as ausências há 4 dias seguidos
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET de ausentes há 4 dias seguidos
    Então retorna o status 200 somente as ausências do filtro

  Cenário: Retornar as ausências há 5 dias seguidos
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET de ausentes há 5 dias seguidos
    Então retorna o status 200 somente as ausências do filtro

  Cenário: Retornar as ausências entre 6 e 10 dias seguidos
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET os ausentes entre 6 e 10 dias seguidos
    Então retorna o status 200 somente as ausências do filtro

  Cenário: Retornar as ausências entre 11 e 15 dias seguidos
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET os ausentes entre 11 e 15 dias seguidos
    Então retorna o status 200 somente as ausências do filtro

  Cenário: Retornar as ausências há mais de 15 dias seguidos
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET os ausentes há mais de 15 dias seguidos
    Então retorna o status 200 somente as ausências do filtro

  Cenário: Retornar 3 ausências nos últimos 10 dias
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET de 3 ausências nos últimos 10 dias
    Então retorna o status 200 somente as ausências do filtro

  Cenário: UE deve ser obrigatório na consulta
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET os ausentes sem a UE
    Então retorna o status 601 que a UE deve ser informada

  Cenário: Ano letivo deve ser obrigatório na consulta
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET os ausentes sem o ano letivo
    Então retorna o status 601 que invalidando a consulta

  Cenário: Turma deve ser obrigatório na consulta
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET os ausentes sem a turma
    Então retorna o status 601 que a turma deve ser informada

  Cenário: Não ausências da turma quando estiver deslogado
    Dado que não login não gerou um token de acesso válido
    Quando tento uma requisição GET os ausentes da turma
    Então retorna o status 401 sem as ausências

  