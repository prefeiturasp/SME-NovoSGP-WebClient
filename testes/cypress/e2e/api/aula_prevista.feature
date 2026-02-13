# language: pt

Funcionalidade: API - Aula prevista

  Cenário: Retornar aulas prevista por bimestre
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para buscar aula no bimestre
    Então retorna o status 200 com as aulas previstas

  Cenário: Modalidade deve ser obrigatória
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET sem modalidade
    Então retorna o status 500 sem as aulas previstas
  
  Cenário: Não retornar aula com modalidade inválida
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET com modalidade inválida
    Então retorna o status 422 sem as aulas previstas

  Cenário: Turma deve ser obrigatória
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET sem turma
    Então retorna o status 500 sem as aulas previstas

  Cenário: Não retornar aula com turma inválida
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET com turma inválida
    Então retorna o status 601 sem as aulas previstas

  Cenário: Disciplina deve ser obrigatória
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET sem disciplina
    Então retorna o status 500 sem as aulas previstas

  Cenário: Semestre deve ser obrigatório
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET sem semestre
    Então retorna o status 500 sem as aulas previstas

  Cenário: Não retornar aula no bimestre quando estiver deslogado
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para buscar aula no bimestre
    Então retorna o status 401 sem as aulas

  Cenário: Retornar aulas prevista através do ID
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para buscar o ID aula
    Então retorna o status 200 com a aula prevista

  Cenário: Não retornar aula prevista quando estiver deslogado
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição GET para buscar o ID aula
    Então retorna o status 401 sem a aula

  Cenário: ID da aulas prevista deve ser obrigatório
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para buscar sem o ID
    Então retorna o status 405 de método inválido

  Cenário: Alterar aulas prevista através do ID
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição PUT com o ID aula
    Então retorna o status 200 com a mensagem de sucesso
  
  Cenário: Não alterar aulas prevista sem o ID
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição PUT sem o ID aula
    Então retorna o status 405 sem realizar a alteração

  Cenário: Corpo da requisição não poderá estar vazio
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição PUT sem o corpo da requisição
    Então retorna o status 415 com a mensagem de vazio
  
  Cenário: Não alterar aula prevista quando estiver deslogado
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição PUT com o ID aula
    Então retorna o status 401 sem realizar a alteração

  Cenário: Componente curricular deve ser informado
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição PUT sem o componente curricular
    Então retorna o status 422 com a mensagem que a disciplina deve ser informada para alterar

  Cenário: Modalidade deve ser informada
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição PUT sem a modalidade
    Então retorna o status 422 com a mensagem que deve ser informada para alterar

  Cenário: Turma deve ser informada
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição PUT sem a turma
    Então retorna o status 422 com a mensagem que a turma deve ser informada para alterar

  Cenário: Criar aulas prevista
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição POST 
    Então retorna o status 200 com a mensagem de aulas previstas no bimestre

  Cenário: Não criar aulas sem componente curricular informado
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição POST sem o componente curricular
    Então retorna o status 422 com a mensagem que a disciplina deve ser informada para criar

  Cenário: Não criar aulas sem modalidade informada
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição POST sem a modalidade
    Então retorna o status 422 com a mensagem que deve ser informada para criar

  Cenário: Não criar aulas sem turma informada
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição POST sem a turma
    Então retorna o status 422 com a mensagem que a turma deve ser informada para criar

  Cenário: Corpo da requisição  para criar aula não poderá estar vazio
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição POST sem o corpo da requisição
    Então retorna o status 415 com a mensagem de vazio ao criar

  Cenário: Não criar aula prevista quando estiver deslogado
    Dado que não login não gerou um token de acesso válido
    Quando tento a requisição POST
    Então retorna o status 401 sem realizar a alteração ao criar

  Cenário: Validar retorno estruturado das aulas previstas após criação
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição POST 
    Então retorna o status 200 com a mensagem de aulas previstas no bimestre

  Cenário: Validar retorno estruturado após alteração
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição PUT com o ID aula
    Então retorna o status 200 com a mensagem de sucesso

  Cenário: Validar bloqueio de criação e consulta no mesmo fluxo sem autenticação
    Dado que não gerou um token de acesso válido
    Quando tento a requisição POST
    Então retorna o status 401 sem realizar a alteração ao criar

  Cenário: Validar bloqueio de alteração e consulta no mesmo fluxo sem autenticação
    Dado que não gerou um token de acesso válido
    Quando tento a requisição PUT com o ID aula
    Então retorna o status 401 sem realizar a alteração

  Cenário: Validar que ID inválido não permite alteração
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição PUT sem o ID aula
    Então retorna o status 405 sem realizar a alteração

  Cenário: Validar que ID inválido não permite consulta
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição GET para buscar sem o ID
    Então retorna o status 405 de método inválido

  Cenário: Validar obrigatoriedade completa dos campos no PUT
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição PUT sem o componente curricular
    Então retorna o status 422 com a mensagem que a disciplina deve ser informada para alterar

  Cenário: Validar obrigatoriedade completa dos campos no POST
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição POST sem o componente curricular
    Então retorna o status 422 com a mensagem que a disciplina deve ser informada para criar

  Cenário: Validar que requisição vazia sempre retorna 415 no PUT
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição PUT sem o corpo da requisição
    Então retorna o status 415 com a mensagem de vazio

  Cenário: Validar que requisição vazia sempre retorna 415 no POST
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição POST sem o corpo da requisição
    Então retorna o status 415 com a mensagem de vazio ao criar

  Cenário: Validar consistência após criação e consulta por ID
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição POST 
    Então retorna o status 200 com a mensagem de aulas previstas no bimestre

  Cenário: Validar consistência após alteração e consulta por ID
    Dado que login gerou um token de acesso válido
    Quando envio uma requisição PUT com o ID aula
    Então retorna o status 200 com a mensagem de sucesso

