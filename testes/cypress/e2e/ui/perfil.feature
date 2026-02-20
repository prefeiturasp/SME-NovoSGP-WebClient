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
    | 8482195     | Sgp@1234   | web    | Professor CJ           | Usuario professor                       |
    | 8269149     | Sgp@1234   | web    | Professor Ed. Infantil | Usuario professor de ed. infantil       |    
    | 7238711     | Sgp@1234   | web    | Supervisor             | Usuario supervisor                      |
    | 7268009     | Sgp@1234   | web    | Diretor                | Usuario diretor                         |
    | 7574657     | Sgp@1234   | web    | CP                     | Usuario CP                              |
    | 8850895     | Sgp@1234   | web    | Assistente Social      | Usuario assistente Social               |
    | 7551487     | Sgp@1234   | web    | Adm UE                 | Usuario ADM UE                          |
    | 6957315     | Sgp@1234   | web    | AD                     | Usuario AD                              |
    #| 7940432     | Sgp@1234   | web    | PAAI                   | Usuario PAAI                            |
    | 7228287     | Sgp@1234   | web    | Coordenador CEFAI      | Usuario Coordenador CEFAI               |
    | marlon.amcom | Sgp@1234  | web    | Adm COTIC              | Usuario ADM COTIC                       |
    | 41810315000 | Sgp@1234   | web    | ABAE                   | Usuario ABAE                            |
    