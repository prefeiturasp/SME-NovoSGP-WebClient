import { Cabecalho } from '~/componentes-sgp';
import { Card, Loader, ButtonGroup, Grid, Alert } from '~/componentes';
import { SelectComponent } from '~/componentes';
import BarraNavegacao from './componentes/BarraNavegacao';
import PeriodosDropDown from './componentes/PeriodosDropDown';
import { Linha } from '~/componentes/EstilosGlobais';
import { useSelector } from 'react-redux';
import { useReducer, useState, useEffect } from 'react';
import BotaoGerarRelatorio from '~/componentes-sgp/BotoesAcaoPadrao/botaoGerarRelatorio';
import Ordenacao from '../../../componentes-sgp/Ordenacao/ordenacao';
import AlertaSelecionarTurma from './componentes/AlertaSelecionarTurma';

function RelatorioPAP() {
  const [semPeriodos, setSemPeriodos] = useState(false);
  const [periodo, setPeriodo] = useState(null);
  const [opcoes, setOpcoes] = useState(null);
  const { turmaSelecionada } = useSelector(store => store.usuario);
  const [ordenacao, setOrdenacao] = useState(1);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [estadoOriginalAlunos, setEstadoOriginalAlunos] = useState(null);

  useEffect(() => {
    console.log(turmaSelecionada)
  }, [])

  // const onChangeObjetivoHandler = useCallback(
  //   async objetivo => {
  //     if (!somenteLeitura) {
  //       salvarAlteracoes(objetivo);
  //       return;
  //     }

  //     if (objetivo) {
  //       disparar(setarObjetivoAtivo(objetivo.id));
  //     }
  //   },
  //   [salvarAlteracoes, somenteLeitura]
  // );

  return (
    <>
      <AlertaSelecionarTurma />
      <Cabecalho pagina="Relatório PAP">
        <ButtonGroup
          onClickVoltar={() => console.log('voltar')}
          onClickBotaoPrincipal={() =>
            salvarAlteracoes(estado.ObjetivoAtivo, true)
          }
          onClickCancelar={() => console.log('cancelar')}
          labelBotaoPrincipal="Salvar"
        />
      </Cabecalho>
      <Card>
        <Grid cols={12}>
          <Linha className="row m-0">
            <Grid cols={3}>
              <PeriodosDropDown
                codigoTurma={turmaSelecionada && turmaSelecionada.turma}
                setSemPeriodos={setSemPeriodos}
                valor={periodo}
              />
            </Grid>
          </Linha>
        </Grid>
        <Grid className="mt-2" cols={12}>
            <Ordenacao />
            {/* <BotaoGerarRelatorio /> */}
        </Grid>
        <Grid className="mt-4" cols={12}>
          <BarraNavegacao />
        </Grid>
        <Grid className="mt-2" cols={12}>
            {/* <TabelaAlunos
              alunos={estado.Alunos}
              objetivoAtivo={estado.ObjetivoAtivo}
              respostas={respostasCorrentes}
              onChangeResposta={onChangeRespostaHandler}
              somenteConsulta={
                permTela.podeConsultar &&
                !permTela.podeIncluir &&
                !permTela.podeAlterar &&
                !permTela.podeExcluir
              }
            /> */}
          </Grid>
      </Card>
    </>
  );
}

export default RelatorioPAP;
