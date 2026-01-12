# language: pt
Funcionalidade: NAAPA - Consulta de crianças/estudantes ausentes

Background

  Esquema do Cenário: Validar consulta de ausências pelo ABAE para o cenário "<cenario>" 
    Dado que eu acesso o sistema com a visualização "<device>"
    E informo os dados nos campos "<usuario>" e "<senha>"
    E clico no botão de acessar
    Quando acesso a tela de consulta de ausentes
    E seleciono as ausências "<ausencia>"
    Então realiza a validação para o cenário "<cenario>" 

    Exemplos:
    | usuario     | senha    | device | ausencia                    | cenario                 |
    | 41810315000 | Sgp@1234 | web    | No dia de hoje              | Ausente hoje            |
    | 41810315000 | Sgp@1234 | web    | Há 2 dias seguidos          | Ausente 2 dias seguidos |
    | 41810315000 | Sgp@1234 | web    | Há 3 dias seguidos          | Ausente 3 dias seguidos |
    | 41810315000 | Sgp@1234 | web    | Há 4 dias seguidos          | Ausente 4 dias seguidos |
    | 41810315000 | Sgp@1234 | web    | Há 5 dias seguidos          | Ausente 5 dias seguidos |
    | 41810315000 | Sgp@1234 | web    | Entre 11 e 15 dias seguidos | Ausente 11 e 15 dias seguidos |
    | 41810315000 | Sgp@1234 | we     | Há mais de 15 dias seguidos | Ausente mais de 15 dias seguidos |
    | 41810315000 | Sgp@1234 | web    | 3 ausências nos últimos 10 dias | Ausente 3 dias nos últimos 10 dias |