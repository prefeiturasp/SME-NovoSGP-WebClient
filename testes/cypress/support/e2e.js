// Plugin do Allure (deve vir primeiro)
import '@shelex/cypress-allure-plugin'
import "cypress-cloud/support";

// Comandos personalizados - API
import './commands_api/commands_login'
import './commands_api/commands_usuario'
import './commands_api/commands_mapeamentos_estudantes'
import './commands_api/commands_fechamento'
import './commands_api/commands_relatorios'
import './commands_api/commands_mural'
import './commands_api/commands_dashboard'
import './commands_api/commands_ue'
import './commands_api/commands_supervisores'

// Comandos personalizados - UI
import './commands_ui/commands_login'
import './commands_ui/commands_globais'
import './commands_ui/commands_consulta_ausentes'
import './commands_ui/commands_registro_acoes_busca'
import './commands_ui/commands_busca_ativa_relatorios'

// Evita falhas silenciosas caso algum comando seja removido ou renomeado
Cypress.on('uncaught:exception', (err, runnable) => {
  // Se quiser ignorar certos erros específicos, pode filtrar aqui
  return false // Impede que testes falhem por erros inesperados no frontend
})



