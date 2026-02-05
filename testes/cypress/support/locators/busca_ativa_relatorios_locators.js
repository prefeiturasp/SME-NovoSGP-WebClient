class Busca_Ativa_Relatorios_SGP_Localizadores {
    menu_relatorios = () => { return 'span.ant-menu-title-content:eq(2)' }
    menu_naapa = () => { return 'span.ant-menu-title-content:eq(3)' }
    menu_busca_ativa = () => { return 'span.ant-menu-title-content:eq(4)' }
    campo_turma = () => { return '.ant-select-selector:eq(5)' }
    clica_turma = () => { return '.ant-select-dropdown' }
    gerar_relatorio = () => { return '#SGP_BUTTON_GERAR_RELATORIO' }
    notificacoes = () => { return '.ant-notification.ant-notification-topRight' }
}

export default Busca_Ativa_Relatorios_SGP_Localizadores


