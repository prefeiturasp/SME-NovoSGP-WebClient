# language: pt

Funcionalidade: API - Lista UEs com vínculos a DRE

  Cenário: Listar todos os códigos e nomes das UEs
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET de vínculos DRE
    Então retorna o status 200 todos os códigos e nomes das UEs

  Cenário: Não retorna dados sem usuário autenticado
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET de vínculos DRE
    Então não retorna todos os códigos e nomes das UEs mostrando o status 401

