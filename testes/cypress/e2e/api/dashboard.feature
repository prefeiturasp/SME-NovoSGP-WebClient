# language: pt

Funcionalidade: API - Dashboard tela inicial

@ignore
  Cenário: Carrega os dashboards da tela inicial
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de dashboard
    Então retorna o status 200 carregando os dados

  Cenário: Não exibe o dashboard sem usuário autenticado
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para o endpoint de dashboard
    Então retorna o status 401 sem os dados
	
	

