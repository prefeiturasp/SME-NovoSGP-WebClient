class Consulta_Ausentes_SGP_Localizadores {
    menu_naapa = () => { return '.ant-menu-submenu-title:eq(1)' }
    busca_ativa = () => { return '.ant-menu-title-content:eq(2)' }
    menu_ausentes = () => { return '.ant-menu-item.ant-menu-item-only-child:eq(0)' }
    campo_ausencias = () => { return 'input[id="SGP_SELECT_AUSENCIAS"]' }
    clica_ausencia = () => { return '.ant-select-item-option-content' }
    turmas_sem_dados = () => { return 'td.ant-table-cell[colspan="2"]' }
}

export default Consulta_Ausentes_SGP_Localizadores




