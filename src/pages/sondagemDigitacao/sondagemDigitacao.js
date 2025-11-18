import { useEffect, useState } from 'react';
import { ROUTES } from '@/core/enum/routes';
import { useSelector } from 'react-redux';
import { Auditoria, Colors, Loader } from '~/componentes';
import { ehTurmaInfantil } from '~/servicos/Validacoes/validacoesInfatil';
import AlertaModalidadeInfantil from '~/componentes-sgp/AlertaModalidadeInfantil/alertaModalidadeInfantil';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import Alert from '~/componentes/alert';
import Button from '~/componentes/button';
import Card from '~/componentes/card';
import Grid from '~/componentes/grid';
import { Cabecalho } from '~/componentes-sgp';
import SelectComponent from '~/componentes/select';
import {
  SGP_BUTTON_CANCELAR,
  SGP_BUTTON_SALVAR_ALTERAR,
} from '~/constantes/ids/button';

const SondagemDigitacao = () => {
  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;
  const turmaId = turmaSelecionada ? turmaSelecionada.turma : 0;
  const periodo = turmaSelecionada ? turmaSelecionada.periodo : 0;
  const { modalidade } = turmaSelecionada;

  const [desabilitarDisciplina, setDesabilitarDisciplina] = useState(false);
  const [listaDisciplinas, setListaDisciplinas] = useState([]);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [disciplinaIdSelecionada, setDisciplinaIdSelecionada] = useState();
  const [dadoslista, setDadosLista] = useState([]);
  const [auditoria, setAuditoria] = useState(undefined);
  const permissoesTela = usuario.permissoes[ROUTES.SondagemDigitacao]; 
  const [somenteConsulta, setSomenteConsulta] = useState(false); // Verificar se realmente vai ser usado.
  const [exibirLoader, setExibirLoader] = useState(false);

  const modalidadesFiltroPrincipal = useSelector(
    store => store.filtro.modalidades
  );

//   useEffect(() => {
//     const naoSetarSomenteConsultaNoStore = ehTurmaInfantil(
//       modalidadesFiltroPrincipal,
//       turmaSelecionada
//     );
//     setSomenteConsulta(
//       verificaSomenteConsulta(permissoesTela, naoSetarSomenteConsultaNoStore)
//     );
//   }, [turmaSelecionada, permissoesTela, modalidadesFiltroPrincipal]);

  const perguntaAoSalvar = async () => {
    return confirmar(
      'Atenção',
      '',
      'Suas alterações não foram salvas, deseja salvar agora?'
    );
  };

  const onClickCancelar = async () => {
    if (modoEdicao) {
      const confirmado = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?'
      );
      if (confirmado) {
        resetarTela();
      }
    }
  };

  const onClickSalvar = async () => {
    // await salvar();
  };

  const onChangeDisciplinas = async disciplinaId => {
    // if (modoEdicao) {
    //   const confirmarSalvar = await perguntaAoSalvar();
    //   if (confirmarSalvar) {
    //     await salvar();
    //   }
    // }

    if (disciplinaId) {
      setDisciplinaIdSelecionada(String(disciplinaId));
      await buscarDados(disciplinaId);
    } else {
      setDadosLista([]);
      setAuditoria(undefined);
      setDisciplinaIdSelecionada(undefined);
    }
  };

  const buscarDados = async (disciplinaId, novosDados) => {
    // setExibirLoader(true);
    // let dadosAula = null;
    // if (novosDados) {
    //   dadosAula = novosDados;
    // } else {
    //   const resposta = await api.get(
    //     `v1/aula-prevista/modalidades/${modalidade}/turmas/${turmaId}/disciplinas/${disciplinaId}/semestres/${periodo}`
    //   );
    //   dadosAula = resposta.data;
    // }
    // let periodosFechados = '';
    // if (dadosAula && dadosAula.aulasPrevistasPorBimestre) {
    //   const dadosBimestre = dadosAula.aulasPrevistasPorBimestre;
    //   let totalPrevistas = 0;
    //   let totalCriadasTitular = 0;
    //   let totalCriadasCj = 0;
    //   let totalDadas = 0;
    //   let totalRepostas = 0;
    //   dadosBimestre.forEach(item => {
    //     item.ehBimestreAtual = verificarBimestreAtual(item.inicio, item.fim);
    //     item.dadas = item.cumpridas;
    //     totalPrevistas += item.previstas.quantidade;
    //     totalCriadasTitular += item.criadas.quantidadeTitular;
    //     totalCriadasCj += item.criadas.quantidadeCJ;
    //     totalDadas += item.dadas;
    //     totalRepostas += item.reposicoes;
    //     if (item.previstas.mensagens && item.previstas.mensagens.length > 0) {
    //       item.previstas.temDivergencia = true;
    //     }
    //     periodosFechados += !item.podeEditar
    //       ? periodosFechados.length > 0
    //         ? `, ${item.bimestre}`
    //         : item.bimestre
    //       : '';
    //   });
    //   const dados = {
    //     id: dadosAula.id,
    //     bimestres: dadosBimestre,
    //     totalPrevistas,
    //     totalCriadasTitular,
    //     totalCriadasCj,
    //     totalDadas,
    //     totalRepostas,
    //   };
    //   setDadosLista(dados);
    //   const aud = {
    //     alteradoRf: dadosAula.alteradoRF,
    //     alteradoEm: dadosAula.alteradoEm,
    //     alteradoPor: dadosAula.alteradoPor,
    //     criadoRf: dadosAula.criadoRF,
    //     criadoEm: dadosAula.criadoEm,
    //     criadoPor: dadosAula.criadoPor,
    //   };
    //   if (periodosFechados.length > 0) {
    //     periodosFechados = periodosFechados.replace(/,(?=[^,]*$)/, ' e ');
    //     const mensagem = `Apenas é possível consultar o(s) registro(s) para o(s) bimestre(s) ${periodosFechados},
    //      pois seus períodos de fechamento estão encerrados.`;
    //     exibirAlerta('warning', mensagem);
    //   }
    //   setAuditoria(aud);
    // }
    // setExibirLoader(false);
  };

  return (
    <Loader loading={exibirLoader} tip="Carregando...">
      {!turmaSelecionada.turma &&
      !ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada) ? (
        <Grid cols={12} className="p-0">
          <Alert
            alerta={{
              tipo: 'warning',
              id: 'AlertaPrincipal',
              mensagem: 'Você precisa escolher uma turma.',
              estiloTitulo: { fontSize: '18px' },
            }}
            className="mb-2"
          />
        </Grid>
      ) : null}
      <AlertaModalidadeInfantil />
      <Cabecalho pagina="Sondagem - Digitação">
        <>
          <BotaoVoltarPadrao className="mr-2" onClick={() => onClickVoltar()} />
          <Button
            id={SGP_BUTTON_CANCELAR}
            label="Cancelar"
            color={Colors.Roxo}
            border
            className="mr-2"
            onClick={onClickCancelar}
            disabled={!modoEdicao || somenteConsulta}
          />
          <Button
            id={SGP_BUTTON_SALVAR_ALTERAR}
            label={dadoslista?.id ? 'Alterar' : 'Salvar'}
            color={Colors.Roxo}
            border
            bold
            onClick={onClickSalvar}
            disabled={!modoEdicao || somenteConsulta}
          />
        </>
      </Cabecalho>
      <Card>
        <div className="col-md-12">
          <div className="row">
            <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-2">
              <SelectComponent
                id="disciplina"
                name="disciplinaId"
                lista={listaDisciplinas}
                valueOption="id"
                valueText="nome"
                valueSelect={disciplinaIdSelecionada}
                onChange={onChangeDisciplinas}
                placeholder="Selecione um componente curricular"
                // disabled={desabilitarDisciplina || !turmaSelecionada.turma}
              />
            </div>
            <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-2">
              <SelectComponent
                id="Proficiencia"
                name="Proficiencia"
                lista={listaDisciplinas}
                valueOption="id"
                valueText="nome"
                valueSelect={disciplinaIdSelecionada}
                onChange={onChangeDisciplinas}
                placeholder="Selecione uma Proficiência"
                // disabled={desabilitarDisciplina || !turmaSelecionada.turma}
              />
            </div>
          </div>
        </div>
      </Card>
    </Loader>
  );
};

export default SondagemDigitacao;
