# language: pt

Funcionalidade: API - Consultas de anotações de frequência do aluno

  Cenário: Retorna a anotação do aluno através do id
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint do id da anotação
    Então retorna os dados do id com status 200

  Cenário: Id da anotação é obrigatório na consulta do aluno
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint sem id da anotação
    Então retorna o status 405 que o id é obrigatório

  Cenário: Id da anotação inválido na consulta do aluno
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint com id da anotação incorreto
    Então retorna o status 601 que o id deve ser informado

  Cenário: Id da anotação inexistente na consulta do aluno
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint com id da anotação inexistente
    Então retorna o status 601 que anotação não foi encontrada

  Cenário: Não retorna a anotação do aluno através do id sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET para o endpoint do id da anotação
    Então não retorna dados da anotação id mostrando o status 401
  
  Cenário: Retorna a anotação do aluno na aula
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de anotação do aluno na aula
    Então retorna os dados do id aula com status 204

  Cenário: Id do aluno é obrigatório na anotação da aula
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint sem id do aluno na aula
    Então retorna o status 500 sem dados de aula

  Cenário: Id da aula é obrigatório na anotação do aluno
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint sem id da aula do aluno
    Então retorna o status 500 sem dados de aluno  

  Cenário: Não retorna a anotação do aluno através do id sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET para o endpoint do id da anotação
    Então não retorna dados da anotação id mostrando o status 401

  Cenário: Retorna os motivos de ausências nas anotações do aluno
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de motivos de ausências
    Então retorna o status 200 as descrições nas anotações do aluno

  Cenário: Não retorna os motivos de ausências sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento uma requisição GET para o endpoint de motivos de ausências
    Então não retorna as descrições exibindo o status 401

  Cenário: Retorna as anotações do aluno na data selecionada
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de anotações na data
    Então retorna o status 200 com os dados de aluno no período

  Cenário: Data de fim deve ser maior que início
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de anotações com data
    E data de fim é maior que início
    Então retorna o status 601 que o fim deve ser maior

  Cenário: Não permitir data inválida
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de anotações da data
    E a data está inválida
    Então retorna o status 422 que o valor é inválido

  Cenário: Data fim deve ser preenchida
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint sem data fim preenchida
    Então retorna o status 422 que data fim é inválida

  Cenário: Filtrar somente com data fim
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint sem data fim
    Então retorna o status 601 que data fim é obrigatório

  Cenário: Data início deve ser preenchida
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint sem data início preenchida
    Então retorna o status 422 que data início é inválida

  Cenário: Filtrar somente com data início
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint sem data início
    Então retorna o status 601 que data início é obrigatório

  Cenário: Aluno deve ser preenchido
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint da data sem o aluno
    Então retorna o status 422 que a consulta do aluno é inválida

  Cenário: Não retorna as anotações do aluno na data selecionada sem autenticação
    Dado que não possuo um token de acesso válido
    Quando tento uma requisição GET para o endpoint de anotações na data
    Então não retorna os dados de aluno no período exibindo o status 401

    Cenário: Validar estrutura da anotação do aluno
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint do id da anotação
    Então retorna os dados do id com status 200

  Cenário: Validar erro ao consultar anotação inexistente
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint com id da anotação inexistente
    Então retorna o status 601 que anotação não foi encontrada

  Cenário: Validar erro ao consultar anotação com id inválido
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint com id da anotação incorreto
    Então retorna o status 601 que o id deve ser informado

  Cenário: Validar erro ao consultar anotação sem id
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint sem id da anotação
    Então retorna o status 405 que o id é obrigatório

  Cenário: Validar acesso não autorizado ao consultar anotação por id
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET para o endpoint do id da anotação
    Então não retorna dados da anotação id mostrando o status 401

  Cenário: Validar acesso não autorizado na consulta por aula
    Dado que não possuo um token de acesso válido
    Quando tento a requisição GET para o endpoint do id da anotação
    Então não retorna dados da anotação id mostrando o status 401

  Cenário: Validar retorno vazio ao consultar anotação por aula
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de anotação do aluno na aula
    Então retorna os dados do id aula com status 204

  Cenário: Validar obrigatoriedade do id do aluno na consulta por aula
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint sem id do aluno na aula
    Então retorna o status 500 sem dados de aula

  Cenário: Validar obrigatoriedade do id da aula na consulta por aula
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint sem id da aula do aluno
    Então retorna o status 500 sem dados de aluno

  Cenário: Validar obrigatoriedade da data fim
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint sem data fim
    Então retorna o status 601 que data fim é obrigatório

  Cenário: Validar obrigatoriedade da data início
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint sem data início
    Então retorna o status 601 que data início é obrigatório

  Cenário: Validar erro ao informar data inválida
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de anotações da data
    E a data está inválida
    Então retorna o status 422 que o valor é inválido

  Cenário: Validar erro quando data fim é menor que início
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET para o endpoint de anotações com data
    E data de fim é maior que início
    Então retorna o status 601 que o fim deve ser maior

  Cenário: Validar acesso não autorizado na consulta por data
    Dado que não possuo um token de acesso válido
    Quando tento uma requisição GET para o endpoint de anotações na data
    Então não retorna os dados de aluno no período exibindo o status 401

  Cenário: Validar acesso não autorizado na consulta de motivos de ausência
    Dado que não possuo um token de acesso válido
    Quando tento uma requisição GET para o endpoint de motivos de ausências
    Então não retorna as descrições exibindo o status 401

