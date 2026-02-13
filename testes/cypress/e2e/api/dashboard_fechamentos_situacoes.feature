# language: pt

Funcionalidade: API - Dashboard de fechamentos - Situações

  Cenário: Carrega situações do dashboard de fechamentos
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint do dashboard de fechamentos
    Então retorna todas situações com status 200 

  Cenário: Não retorna situações sem usuário autenticado
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint do dashboard de fechamentos
    Então retorna o status 401 sem as situações
	
	

