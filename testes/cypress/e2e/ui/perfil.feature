# language: pt
Funcionalidade: Perfil

Background

 Esquema do Cenário: Logar no SGP com perfil de "<cenario>"
   Dado que estou acessando o sistema com a visualização "<device>"
   E digito os dados nos campos "<usuario>" e "<senha>"
   Quando clico para acessar
   Então devo ter acesso do perfil "<perfil>" para o cenario "<cenario>"

   Exemplos:
    | usuario     | senha      | device | perfil                 | cenario                                 |
    | 8482195     | SENHA      | web    | Professor CJ           | Usuario professor                       |
    | 8269149     | SENHA      | web    | Professor Ed. Infantil | Usuario professor de ed. infantil       |
    | 7238711     | SENHA      | web    | Supervisor             | Usuario supervisor                      |
    | 7268009     | SENHA      | web    | Diretor                | Usuario diretor                         |
    | 7574657     | SENHA      | web    | CP                     | Usuario CP                              |
    | 8850895     | SENHA      | web    | Assistente Social      | Usuario assistente Social               |
    | 7551487     | SENHA      | web    | Adm UE                 | Usuario ADM UE                          |
    | 6957315     | SENHA      | web    | AD                     | Usuario AD                              |
    #| 7940432     | SENHA      | web    | PAAI                   | Usuario PAAI                            |
    | 7228287     | SENHA      | web    | Coordenador CEFAI      | Usuario Coordenador CEFAI               |
    | marlon.amcom | SENHA     | web    | Adm COTIC              | Usuario ADM COTIC                       |
    | 41810315000 | SENHA      | web    | ABAE                   | Usuario ABAE                            |
