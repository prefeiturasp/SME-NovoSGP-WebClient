# language: pt
Funcionalidade: NAAPA - Registro de ações

Background

  Esquema do Cenário: Validar a busca de ações pelo ABAE para o cenário "<cenario>" 
    Dado que eu acesso o sistema com a visualização "<device>"
    E informo os dados nos campos "<usuario>" e "<senha>"
    E clico no botão de acessar
    Quando acesso a tela de registro de ações
    E seleciono "<turma>" no campo de turma
    E escolho o período
    E meio de contato
    Entao o sistema realiza a validação para o cenario "<cenario>" 

    Exemplos:
    | usuario     | senha    | device | turma                  | cenario          |
    | 41810315000 | Sgp@1234 | web    | Todas                  | Selecionar todas |
    | 41810315000 | Sgp@1234 | web    | EF - 1A - 1º Ano       | Somente uma turma|
    | 41810315000 | Sgp@1234 | web    | EF - 2C - 2º Ano  | Sem dados encontrados |