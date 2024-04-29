import { useAppSelector } from '@/core/hooks/use-redux';
import { Col, Row } from 'antd';
import TabelaRetratil from '~/componentes/TabelaRetratil';
import { BotaoOrdenarMapeamentoEstudantes } from '../botao-ordenar-estudantes';

export const TabelaRetratilMapeamentoEstudantes = ({
  onChangeAlunoSelecionado,
  children,
  permiteOnChangeAluno,
}) => {
  const estudantesMapeamentoEstudantes = useAppSelector(
    store => store.mapeamentoEstudantes?.estudantesMapeamentoEstudantes
  );

  return (
    <>
      {estudantesMapeamentoEstudantes?.length ? (
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <BotaoOrdenarMapeamentoEstudantes />
          </Col>
          <Col xs={24}>
            <TabelaRetratil
              onChangeAlunoSelecionado={onChangeAlunoSelecionado}
              permiteOnChangeAluno={permiteOnChangeAluno}
              pularDesabilitados
              alunos={estudantesMapeamentoEstudantes}
            >
              {children}
            </TabelaRetratil>
          </Col>
        </Row>
      ) : (
        <></>
      )}
    </>
  );
};
