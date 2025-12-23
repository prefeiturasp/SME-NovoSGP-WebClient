# language: pt

Funcionalidade: API - Dashboard EA

  Cenário: Buscar adesão no dashboard EA
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de adesão EA
    E informo a UE com a DRE
    Então retorna o status 200 de busca no dashboard EA

  Cenário: Buscar adesão ao dashboard na UE
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de adesão sem DRE
    E informo somente a UE
    Então retorna o status 200 de busca EA da UE

  Cenário: Buscar adesão ao dashboard na DRE
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de adesão sem UE
    E informo somente a DRE
    Então retorna o status 200 de busca EA da DRE

  Cenário: Não buscar adesão no dashboard EA sem autenticação
    Dado que não login não gerou um token de acesso válido
    Quando tento uma requisição GET para o endpoint de adesão EA
    Então retorna o status 401 sem as adesões

  Cenário: Buscar adesão no dashboard EA agrupado por DRE
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de adesão EA agrupados 
    Então retorna o status 200 de busca no dashboard EA totalizado as Dres

  Cenário: Não buscar adesão agrupado no dashboard EA sem autenticação
    Dado que não login não gerou um token de acesso válido
    Quando tento uma requisição GET para o endpoint de adesão EA
    Então retorna o status 401 sem o agrupamento

  Cenário: Nome do processamento no dashboard EA é obrigatório
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint sem o processamento
    Então retorna o status 601 que o nome do processo é obrigatório

  Cenário: Não buscar com nome do processamento no dashboard EA inválido
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint com nome inválido
    Então retorna o status 601 ao obter dados de adesão do aplicativo

  Cenário: Não buscar processamento no dashboard EA sem autenticação
    Dado que não login não gerou um token de acesso válido
    Quando tento uma requisição GET para o endpoint de processamento
    Então retorna o status 401 sem os nomes de processos

  Cenário: Buscar comunicados totais no dashboard
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de comunicados totais
    Então retorna o status 200 com os vigentes e expirados

   Cenário: Ano letivo no dashboard de comunicados totais é obrigatório
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de comunicados sem ano letivo
    Então retorna o status 422 que o valor é inválido

  Cenário: Não buscar comunicados totais no dashboard sem autenticação
    Dado que não login não gerou um token de acesso válido
    Quando tento uma requisição GET para o endpoint de comunicados totais
    Então retorna o status 401 sem os vigentes e expirados

  Cenário: Buscar comunicados totais agrupados no dashboard
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de comunicados totais agrupados
    Então retorna o status 200 com nome da DRE, os vigentes e expirados

  Cenário: Ano letivo no dashboard de comunicados totais agrupados é obrigatório
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de comunicados agrupados sem ano letivo
    Então retorna o status 422 que o valor é inválido para listar

  Cenário: Não buscar comunicados totais agrupados no dashboard sem autenticação
    Dado que não login não gerou um token de acesso válido
    Quando tento uma requisição GET para o endpoint de comunicados totais agrupados
    Então retorna o status 401 sem nome da DRE, os vigentes e expirados

   Cenário: Buscar leitura dos comunicados no dashboard
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de leituras de comunicados
    Então retorna o status 200 com nome da DRE, Ue, não receberam, não visualizaram e visualizaram

  Cenário: Campo do código do comunicado é obrigatório
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de leituras sem o código do comunicado
    Então retorna o status 422 informando que o comunicado é obrigatório

  Cenário: Não buscar com código do comunicado inválido
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de leituras com o código do comunicado inválido
    Então retorna o status 400 informando que não existe

  Cenário: Modo de visualização é obrigatório
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de leituras sem o modo de visualização
    Então retorna o status 422 informando que o modo é obrigatório

  Cenário: Não buscar comunicados totais agrupados no dashboard sem autenticação
    Dado que não login não gerou um token de acesso válido
    Quando tento uma requisição GET para o endpoint de leituras de comunicados
    Então retorna o status 401 sem nome da DRE, Ue, não receberam, não visualizaram e visualizaram

  Cenário: Buscar leitura dos comunicados agrupados no dashboard
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de leituras de comunicados agrupados
    Então retorna o status 200 com as notificações

  Cenário: Campo do código do comunicado agrupados é obrigatório
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de leituras agrupados sem o código do comunicado
    Então retorna o status 422 informando que o comunicado é obrigatório para agrupar

  Cenário: Não buscar agrupado com código do comunicado inválido
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de leituras agrupados com o código do comunicado inválido
    Então retorna o status 400 informando que não existe para agrupar

  Cenário: Modo de visualização é obrigatório para agrupar
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de leituras agrupados sem o modo de visualização
    Então retorna o status 422 informando que o modo é obrigatório para agrupar

  Cenário: Não buscar comunicados totais agrupados no dashboard sem autenticação
    Dado que não login não gerou um token de acesso válido
    Quando tento uma requisição GET para o endpoint de leituras agrupados de comunicados
    Então retorna o status 401 sem agrupar nome da DRE, Ue, não receberam, não visualizaram e visualizaram

  Cenário: Filtrar comunicados no dashboard EA
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de filtro de comunicados
    Então retorna o status 200 de sucesso do dashboard EA

  Cenário: Ano letivo é obrigatório para filtrar dashboard EA
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de filtro de comunicados sem o ano
    Então retorna o status 422 informando que o ano letivo é inválido

  Cenário: Modalidade é obrigatório para filtrar dashboard EA
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de filtro de comunicados sem a modalidade
    Então retorna o status 422 informando que a modalidade é inválida

  Cenário: Não filtrar comunicados no dashboard EA sem autenticação
    Dado que não login não gerou um token de acesso válido
    Quando tento uma uma requisição GET para o endpoint de filtro de comunicados
    Então retorna o status 401 sem filtrar o dashboard EA

  Cenário: Leitura de comunicados de modalidades no dashboard EA
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de leitura de comunicados
    Então retorna o status 200 de sucesso do dashboard EA de comunicados

  Cenário: Código da DRE é obrigatório para leitura de comunicados de modalidades
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de leitura de comunicados sem a DRE
    Então retorna o status 601 que o código da DRE é obrigatório

  Cenário: Código da UE é obrigatório para leitura de comunicados de modalidades
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de leitura de comunicados sem a UE
    Então retorna o status 601 que o código da UE é obrigatório

  Cenário: Código da notificação é obrigatório para leitura de comunicados de modalidades
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de leitura de comunicados sem a notificação
    Então retorna o status 422 que o código da notificação é obrigatório

  Cenário: Modo de visualização é obrigatório para leitura de comunicados de modalidades
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de leitura de comunicados sem o modo de visualização
    Então retorna o status 422 que o modo de visualização é obrigatório

  Cenário: Não retornar a leitura de comunicados de modalidades no dashboard EA sem autenticação
    Dado que não login não gerou um token de acesso válido
    Quando tento uma requisição GET para o endpoint de leitura de comunicados
    Então retorna o status 401 sem a leitura no dashboard EA

  Cenário: Leitura de comunicados de turmas no dashboard EA
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de leitura de turmas
    Então retorna o status 200 de leitura do dashboard EA de comunicados

  Cenário: Código da DRE é obrigatório para leitura de comunicados de turmas
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de leitura de turmas sem a DRE
    Então retorna o status 422 que o código da DRE é obrigatório na leitura

  Cenário: Código da UE é obrigatório para leitura de comunicados de turmas
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de leitura de turmas sem a UE
    Então retorna o status 422 que o código da UE é obrigatório na leitura

  Cenário: Código da notificação é obrigatório para leitura de comunicados de turmas
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de leitura de turmas sem a notificação
    Então retorna o status 422 que o código da notificação é obrigatório na leitura

  Cenário: Modo de visualização é obrigatório para leitura de comunicados de turmas
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de leitura de turmas sem o modo de visualização
    Então retorna o status 422 que o modo de visualização é obrigatório na leitura

  Cenário: Não retornar a leitura de turmas de modalidades no dashboard EA sem autenticação
    Dado que não login não gerou um token de acesso válido
    Quando tento uma requisição GET para o endpoint de leitura de turmas
    Então retorna o status 401 sem a leitura no dashboard EA na leitura

  Cenário: Leitura de comunicados de alunos no dashboard EA
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de alunos de turmas
    Então retorna o status 200 de alunos do dashboard EA de comunicados

  Cenário: Código da turma é obrigatório para leitura de comunicados de alunos
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de leitura de alunos sem a turma
    Então retorna o status 422 que o código da turma é obrigatório na leitura

  Cenário: Código da notificação é obrigatório para leitura de comunicados de alunos
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para o endpoint de leitura de alunos sem a notificação
    Então retorna o status 422 que o código da notificação é obrigatório na turma

  Cenário: Não retornar a leitura de alunos de modalidades no dashboard EA sem autenticação
    Dado que não login não gerou um token de acesso válido
    Quando tento uma requisição GET para o endpoint de leitura de alunos
    Então retorna o status 401 sem a leitura no dashboard EA da turma