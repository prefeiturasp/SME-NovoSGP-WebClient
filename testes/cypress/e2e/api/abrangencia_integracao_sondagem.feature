# language: pt

Funcionalidade: API - Abrangência Integração (Acesso Sondagem)

  Cenário: Não retornar dados com RF inválido
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET de abrangência integração com RF inválido
    Então retorna status 422 de erro


  Cenário: Não retornar dados com RF vazio
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET de abrangência integração com RF inválido
    Então retorna status 422 de erro


  Cenário: Não retornar dados com RF em formato inválido
    Dado que possuo um token de acesso válido
    Quando envio uma requisição GET de abrangência integração com RF inválido
    Então retorna status 422 de erro