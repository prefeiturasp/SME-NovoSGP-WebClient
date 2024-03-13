import { TagDescricao } from '@/components/sgp/tag-totalizador';
import { ModalidadeEnum } from '@/core/enum/modalidade-enum';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Loader, SelectComponent } from '~/componentes';
import GraficoBarras from '~/componentes-sgp/Graficos/graficoBarras';
import { OPCAO_TODOS } from '~/constantes';
import { erros } from '~/servicos';
import ServicoDashboardNAAPA from '~/servicos/Paginas/Dashboard/ServicoDashboardNAAPA';
import NAAPAContext from '../../naapaContext';
import { ListaEstudantesFrequenciaRiscoAbandono } from '../ListaEstudantes';

const GraficoQuantidadeFrequenciaInferior = () => {
  const {
    consideraHistorico,
    anoLetivo,
    dre,
    ue,
    modalidade,
    semestre,
    listaMesesReferencias,
  } = useContext(NAAPAContext);

  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [exibirLoader, setExibirLoader] = useState(false);

  const [meseReferencia, setMeseReferencia] = useState(OPCAO_TODOS);

  const ehModalidadeEJAouCelp =
    Number(modalidade) === ModalidadeEnum.EJA ||
    Number(modalidade) === ModalidadeEnum.CELP;

  const obterDadosGrafico = useCallback(async () => {
    setExibirLoader(true);
    const retorno =
      await ServicoDashboardNAAPA.obterFrequenciaTurmaEvasaoAbaixo50Porcento(
        consideraHistorico,
        anoLetivo,
        dre?.codigo,
        ue?.codigo,
        modalidade,
        semestre,
        meseReferencia
      )
        .catch(e => erros(e))
        .finally(() => setExibirLoader(false));

    if (retorno?.data?.graficosFrequencia?.length) {
      setDadosGrafico(retorno.data);
    } else {
      setDadosGrafico([]);
    }
  }, [
    consideraHistorico,
    anoLetivo,
    dre,
    ue,
    modalidade,
    semestre,
    meseReferencia,
  ]);

  useEffect(() => {
    const validouEJA = ehModalidadeEJAouCelp ? !!semestre : true;
    if (anoLetivo && dre && ue && modalidade && validouEJA && meseReferencia) {
      obterDadosGrafico();
    } else {
      setDadosGrafico([]);
    }
  }, [
    consideraHistorico,
    anoLetivo,
    dre,
    ue,
    modalidade,
    semestre,
    meseReferencia,
    ehModalidadeEJAouCelp,
    obterDadosGrafico,
  ]);

  const onChangeMes = valor => setMeseReferencia(valor);

  return (
    <>
      <div className="row">
        <div className="col-sm-12 col-md-12 col-lg-3 col-xl-3 mb-2">
          <SelectComponent
            id="meses"
            lista={listaMesesReferencias}
            valueOption="numeroMes"
            valueText="nome"
            label="Mês de referência"
            disabled={listaMesesReferencias?.length === 1}
            valueSelect={meseReferencia}
            onChange={mes => {
              onChangeMes(mes);
            }}
            placeholder="Mês de referência"
            allowClear={false}
          />
        </div>
        {dadosGrafico?.graficosFrequencia?.length ? (
          <div className="col-sm-12 mb-2 mt-2">
            <TagDescricao
              descricao={`Total de estudantes: ${
                dadosGrafico?.totalEstudantes || 0
              }`}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
      <Loader
        loading={exibirLoader}
        className={exibirLoader ? 'text-center' : ''}
      >
        {dadosGrafico?.graficosFrequencia?.length ? (
          <>
            <GraficoBarras
              data={dadosGrafico.graficosFrequencia}
              xAxisVisible={ue.codigo !== '-99'}
              legendVisible={false}
            />
            <ListaEstudantesFrequenciaRiscoAbandono
              anoLetivo={anoLetivo}
              dre={dre}
              ue={ue}
              modalidade={modalidade}
              semestre={semestre}
              meseReferencia={meseReferencia}
              dadosGrafico={dadosGrafico.graficosFrequencia}
              url="/v1/dashboard/naapa/frequencia/turma/evasao/abaixo50porcento/alunos"
            />
          </>
        ) : !exibirLoader ? (
          <div className="text-center">Sem dados</div>
        ) : (
          <></>
        )}
      </Loader>
    </>
  );
};

export default GraficoQuantidadeFrequenciaInferior;
