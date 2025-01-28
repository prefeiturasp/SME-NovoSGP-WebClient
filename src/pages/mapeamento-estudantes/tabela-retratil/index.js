import { useAppSelector } from '@/core/hooks/use-redux';
import { Col, Row, Tooltip } from 'antd';
import { Base } from '~/componentes';
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

  const obterIconeEstudanteCustomizado = estudante => {
    if (!estudante?.exibirIconeCustomizado)
      return (
        <i
          className="icone-concluido fa fa-check-circle"
          style={{ marginRight: 4 }}
        />
      );

    if (estudante?.processoConcluido)
      return (
        <i
          className="icone-concluido fa fa-check-circle"
          style={{ color: Base.LaranjaAlerta, marginRight: 4 }}
        />
      );

    return (
      <Tooltip
        title={
          estudante?.alertaVermelho
            ? 'É necessário fazer o mapeamento deste estudante pois ele é não alfabético na hipótese de escrita.'
            : 'É necessário fazer o mapeamento deste estudante pois ele é público do AEE, participa do PAP ou teve resultado abaixo do básico na PSP.'
        }
      >
        <i
          className="fa fa-info-circle"
          style={{
            color: estudante?.alertaVermelho
              ? Base.VermelhoAlerta
              : Base.AmareloAlerta,
            marginRight: 4,
          }}
        />
      </Tooltip>
    );
  };

  return (
    <>
      {estudantesMapeamentoEstudantes?.length ? (
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <BotaoOrdenarMapeamentoEstudantes />
          </Col>
          <Col xs={24}>
            <TabelaRetratil
              pularDesabilitados
              alunos={estudantesMapeamentoEstudantes}
              permiteOnChangeAluno={permiteOnChangeAluno}
              onChangeAlunoSelecionado={onChangeAlunoSelecionado}
              obterIconeEstudanteCustomizado={obterIconeEstudanteCustomizado}
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
