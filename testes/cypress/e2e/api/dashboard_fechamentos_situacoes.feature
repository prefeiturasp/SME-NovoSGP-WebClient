Feature: API - Dashboard de fechamentos - Situações

  Scenario: Carrega situações do dashboard de fechamentos
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint do dashboard de fechamentos
    Then retorna todas situações com status 200 

  Scenario: Não retorna situações sem usuário autenticado
    Given que não login não gerou um token de acesso válido
    When tento a requisição GET para o endpoint do dashboard de fechamentos
    Then retorna o status 401 sem as situações
	
	

