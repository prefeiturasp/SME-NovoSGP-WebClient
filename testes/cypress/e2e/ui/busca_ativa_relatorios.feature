# language: pt
Funcionalidade: NAAPA - Busca ativa - Relatórios

Background

  Esquema do Cenário: Validar a geração de relatório pelo ABAE filtrando por "<cenario>"
    Dado que eu acesso o sistema com a visualização "<device>"
    E informo os dados nos campos "<usuario>" e "<senha>"
    E clico no botão de acessar
    Quando acesso a tela de busca ativa
    E seleciono "<turma>" no campo de turma
    E gero o relatório
    Entao o sistema confirma o relatório para o cenario "<cenario>"

    Exemplos:
    | usuario     | senha    | device | turma                  | cenario         |
    #| 41810315000 | SENHA | web    | Todas                  | Todas as turmas |
    #| 41810315000 | SENHA | web    | EF - 1A - 1º Ano       | Turma A |
    #| 41810315000 | SENHA | web    | EF - 1B - 1º Ano       | Turma B |
    #| 41810315000 | SENHA | web    | EF - 1C - 1º Ano       | Turma C |
    | 41810315000 | SENHA | web    | EF - 1A - 1º Ano,EF - 1B - 1º Ano,EF - 1C - 1º Ano | Turmas A, B e C |
