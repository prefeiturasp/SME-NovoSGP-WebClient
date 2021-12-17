import { Col, Row } from 'antd';
import React, { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setAcaoTelaEmEdicao,
  setTelaEmEdicao,
} from '~/redux/modulos/geral/actions';
import { Button, Colors } from '~/componentes';
import {
  SGP_BUTTON_CANCELAR,
  SGP_BUTTON_SALVAR,
  SGP_BUTTON_VOLTAR,
} from '~/componentes-sgp/filtro/idsCampos';
import { RotasDto } from '~/dtos';
import { confirmar, erros, history, sucesso } from '~/servicos';
import ListaoContext from '../listaoContext';
import ServicoFrequencia from '~/servicos/Paginas/DiarioClasse/ServicoFrequencia';

const ListaoOperacoesBotoesAcao = () => {
  const dispatch = useDispatch();
  const { dadosFrequencia, permissaoTela } = useContext(ListaoContext);

  const telaEmEdicao = useSelector(store => store.geral.telaEmEdicao);

  const pergutarParaSalvar = () =>
    confirmar(
      'Atenção',
      '',
      'Suas alterações não foram salvas, deseja salvar agora?'
    );

  const onClickSalvar = async () => {
    const paramsSalvar = dadosFrequencia.aulas
      .map(aula => {
        const alunos = dadosFrequencia?.alunos
          ?.map(aluno => {
            let aulasParaSalvar = [];
            if (aula?.frequenciaId) {
              aulasParaSalvar = aluno?.aulas?.filter(a => a?.alterado);
            } else {
              aulasParaSalvar = aluno?.aulas;
            }
            if (aulasParaSalvar?.length) {
              const aulaAlunoPorIdAula = aulasParaSalvar.find(
                aulaAluno => aulaAluno?.aulaId === aula?.aulaId
              );

              return {
                codigoAluno: aluno?.codigoAluno,
                frequencias: aulaAlunoPorIdAula?.detalheFrequencia,
              };
            }
            return {};
          })
          ?.filter(a => a?.codigoAluno && a?.frequencias?.length);
        return {
          aulaId: aula.aulaId,
          frequenciaId: aula?.frequenciaId,
          alunos,
        };
      })
      ?.filter(a => a?.alunos?.length);

    // TODO - ADD LOADER
    const resposta = await ServicoFrequencia.salvarFrequenciaListao(
      paramsSalvar
    ).catch(e => erros(e));

    if (resposta?.data) {
      dispatch(setTelaEmEdicao(false));
      return true;
    }

    return false;
  };

  const validarSalvar = async () => {
    let salvou = true;
    if (telaEmEdicao) {
      const confirmado = await pergutarParaSalvar();

      if (confirmado) {
        salvou = await onClickSalvar();
        if (salvou) {
          sucesso('Frequência realizada com sucesso.');
        } else {
          salvou = false;
        }
      } else {
        dispatch(setTelaEmEdicao(false));
      }
    }
    return salvou;
  };

  useEffect(() => {
    if (telaEmEdicao) {
      dispatch(setAcaoTelaEmEdicao(validarSalvar));
    }
  }, [dispatch, telaEmEdicao]);

  const onClickVoltar = async () => {
    if (telaEmEdicao) {
      const salvou = await validarSalvar();
      if (salvou) {
        history.push(RotasDto.LISTAO);
      }
    } else {
      history.push(RotasDto.LISTAO);
    }
  };

  return (
    <Col span={24}>
      <Row gutter={[16, 16]} type="flex" justify="end">
        <Col>
          <Button
            id={SGP_BUTTON_VOLTAR}
            label="Voltar"
            icon="arrow-left"
            color={Colors.Azul}
            border
            onClick={onClickVoltar}
          />
        </Col>
        <Col>
          <Button
            id={SGP_BUTTON_CANCELAR}
            label="Cancelar"
            color={Colors.Azul}
            border
          />
        </Col>
        <Col>
          <Button
            id={SGP_BUTTON_SALVAR}
            label="Salvar"
            color={Colors.Roxo}
            border
            bold
            onClick={onClickSalvar}
            disabled={!permissaoTela.podeIncluir && !permissaoTela.podeAlterar}
          />
        </Col>
      </Row>
    </Col>
  );
};

export default ListaoOperacoesBotoesAcao;
