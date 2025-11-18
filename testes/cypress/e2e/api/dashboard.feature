Feature: API - Dashboard tela inicial

  Scenario: Carrega os dashboards da tela inicial
    Given que login gerou um token de acesso válido
    When envio uma requisição GET para o endpoint de dashboard
    Then retorna o status 200 carregando os dados

  Scenario: Não exibe o dashboard sem usuário autenticado
    Given que não login não gerou um token de acesso válido
    When tento a requisição GET para o endpoint de dashboard
    Then retorna o status 401 sem os dados
	
	

