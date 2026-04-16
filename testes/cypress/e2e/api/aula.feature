# language: pt

Funcionalidade: API - Aula

  Cenário: Consultar aula por ID #1
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de aulas com id da aula existente
    Então retorna sucesso com status 200
    E as informações da aula

  Cenário: Consultar aula com ID inexistente #2
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint com id da aula inexistente
    Então retorna o status 601
    E a mensagem de aula ID não encontrada

  Cenário: Não retorna a aula sem autenticação #3
    Dado que não possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint sem token de acesso
    Então retorna o status 401 de acesso não autorizado

Cenário: Consulta recorrência da aula #1
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de recorrência da aula com id da aula existente
    Então retorna sucesso com status 200
    E a recorrência da aula

Cenário: Consulta da recorrência da aula com ID inválido #2
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de recorrência da aula com id da aula inexistente
    Então retorna o status 601
    E a mensagem de aula não encontrada

  Cenário: Não retorna a recorrência da aula sem autenticação #3
    Dado que não possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de recorrência da aula sem token de acesso
    Então retorna o status 401 de acesso não autorizado

  Cenário: Consulta Aula Por Data e Componente Curricular Para Cadastro #1
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de aula por data e componente curricular para cadastro com dados válidos
    Então retorna sucesso com status 200
    E as informações da aula para cadastro

  Cenário: Consulta Aula Por Data e Componente Curricular Para Cadastro sem a data #2
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de aula por data e componente curricular para cadastro sem a data
    Então retorna o status 601
    E a mensagem de data da aula é obrigatória

  Cenário: Consulta Aula Por Data e Componente Curricular Para Cadastro sem autenticação #3
    Dado que não possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de aula por data e componente curricular para cadastro sem token de acesso
    Então retorna o status 401 de acesso não autorizado

  Cenário: Consulta Aula Por Data e Componente Curricular Para Cadastro com data inválida #4
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de aula por data e componente curricular para cadastro com data inválida
    Então retorna o status 422
    E a mensagem de data inválida

  Cenário: Consulta Aula Por Data e Componente Curricular Para Cadastro com tipo aula inválida #5
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de aula por data e componente curricular para cadastro com tipo aula inválida
    Então retorna o status 422
    E a mensagem de tipo aula inválida

  Cenário: Consultar Aula Por Data e Componente Curricular Para Cadastro com aula do tipo Normal com dia selecionado inválido #6
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de aula por data e componente curricular para cadastro com aula do tipo Normal com dia selecionado inválido
    Então retorna o status 601
    E a mensagem de dia selecionado inválido para aula do tipo Normal

Cenário: Consultar Aula Por Data e Componente Curricular Para Cadastro com aula do tipo Reposição com dia selecionado inválido #7
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de aula por data e componente curricular para cadastro com aula do tipo Reposição com dia selecionado inválido
    Então retorna o status 601
    E a mensagem de dia selecionado inválido para aula do tipo Reposição
