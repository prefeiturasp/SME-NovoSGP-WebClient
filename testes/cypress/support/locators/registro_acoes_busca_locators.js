class Registro_Acoes_Busca_SGP_Localizadores {
    menu_naapa = () => '.ant-menu-submenu-title:eq(1)'
    busca_ativa = () => '.ant-menu-title-content:eq(2)'
    menu_registro_acoes = () => '.ant-menu-item.ant-menu-item-only-child:eq(1)'
    campo_turma_registro_acoes_busca = () => 'input[id="SGP_SELECT_TURMA"]'
    clica_turma_registro_acoes_busca = () => '.ant-select-item-option-content'
    tabela_dados_registro_acoes_busca = () => '.ant-table-placeholder > .ant-table-cell'
    data_inicio_registro_acoes_busca = () => 'input[id="SGP_DATE_INICIO"]'
    data_fim_registro_acoes_busca = () => 'input[id="SGP_DATE_FIM"]'
    calendario_registro_acoes_busca = () => '.ant-picker-content'
    mes_atual_registro_acoes_busca = () => '.ant-picker-month-btn'
    mes_inicio_registro_acoes_busca = () => '.ant-picker-cell-inner:eq(0)'
    dia_registro_acoes_busca = () => '.ant-picker-cell-inner:eq(3)'
    hoje_registro_acoes_busca = () => '.ant-picker-today-btn:eq(1)'
    campo_meio_contato_registro_acoes_busca = () => '#SGP_SELECT_ENTROU_CONTATO_FAMILIA_POR'
    dropdown_visivel = () => '.ant-select-dropdown:not(.ant-select-dropdown-hidden)'    
    opcao_meio_contato = (index) => `.ant-select-item.ant-select-item-option:eq(${index})`
}

export default Registro_Acoes_Busca_SGP_Localizadores
