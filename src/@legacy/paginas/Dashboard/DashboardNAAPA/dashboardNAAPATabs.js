import { ModalidadeEnum } from '@/core/enum/modalidade-enum';
import { Col, Row, Tabs } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { ContainerTabsCard } from '~/componentes/tabs/style';
import { OPCAO_TODOS } from '~/constantes';
import GraficosEncaminhamento from './GraficosEncaminhamento/graficosEncaminhamento';
import GraficosEvasaoEscolar from './GraficosEvasaoEscolar/graficosEvasaoEscolar';
import NAAPAContext from './naapaContext';

const DashboardNAAPATabs = () => {
  const {
    anoLetivo,
    dre,
    ue,
    modalidade,
    semestre,
    listaModalidades,
    setListaModalidades,
    setModalidade,
  } = useContext(NAAPAContext);

  const [tabSelecionada, setTabSelecionada] = useState(0);

  const TAB_RISCO_ABANDONO = '1';
  const TAB_ENCAMINHAMENTO = '2';

  const ehModalidadeEJAouCelp =
    Number(modalidade) === ModalidadeEnum.EJA ||
    Number(modalidade) === ModalidadeEnum.CELP;

  const exibirAbas = anoLetivo && dre?.codigo && ue?.codigo;

  const exibirDados =
    exibirAbas && modalidade && (ehModalidadeEJAouCelp ? !!semestre : true);

  const montarDados = () => {
    if (exibirDados) {
      return (
        <div className="col-md-12 p-0">
          {tabSelecionada === TAB_RISCO_ABANDONO ? (
            <GraficosEvasaoEscolar />
          ) : (
            <></>
          )}

          {tabSelecionada === TAB_ENCAMINHAMENTO ? (
            <GraficosEncaminhamento />
          ) : (
            <></>
          )}
        </div>
      );
    }

    return (
      <div className="col-md-12 p-0">
        <div className="text-center">
          Para visualizar esta seção é necessário selecionar a modalidade e
          semestre no caso de EJA
        </div>
      </div>
    );
  };

  const onChangeTab = tabAtiva => {
    if (modalidade === OPCAO_TODOS) {
      setModalidade(undefined);
    }
    setTabSelecionada(tabAtiva);
  };

  useEffect(() => {
    if (listaModalidades?.length && listaModalidades?.length > 1) {
      if (tabSelecionada === TAB_RISCO_ABANDONO) {
        setListaModalidades(
          listaModalidades.filter(mod => mod?.valor !== OPCAO_TODOS)
        );
      } else {
        const temOpcaoTodas = listaModalidades.find(
          mod => mod?.valor === OPCAO_TODOS
        );
        if (!temOpcaoTodas) {
          const novaLista = [
            { desc: 'Todas', valor: OPCAO_TODOS },
            ...listaModalidades,
          ];
          setListaModalidades(novaLista);
        }
      }

      if (tabSelecionada === TAB_ENCAMINHAMENTO) {
        setModalidade(OPCAO_TODOS);
      }
    }
  }, [tabSelecionada]);

  useEffect(() => {
    setTabSelecionada(0);
  }, [ue]);

  return (
    <Col span={24}>
      <Row gutter={[16, 16]}>
        <Col sm={24}>
          {exibirAbas && (
            <>
              <ContainerTabsCard
                width="auto"
                type="card"
                onChange={onChangeTab}
                activeKey={tabSelecionada}
              >
                <Tabs.TabPane tab="Risco de abandono" key={TAB_RISCO_ABANDONO}>
                  {montarDados()}
                </Tabs.TabPane>
                <Tabs.TabPane tab="Encaminhamento" key={TAB_ENCAMINHAMENTO}>
                  {montarDados()}
                </Tabs.TabPane>
              </ContainerTabsCard>
              {!tabSelecionada ? (
                <Row justify="center">Selecione uma aba</Row>
              ) : (
                <></>
              )}
            </>
          )}
        </Col>
      </Row>
    </Col>
  );
};

export default DashboardNAAPATabs;
