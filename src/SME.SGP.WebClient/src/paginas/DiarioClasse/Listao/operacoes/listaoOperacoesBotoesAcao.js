import { Col, Row } from 'antd';
import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTelaEmEdicao } from '~/redux/modulos/geral/actions';
import { Button, Colors } from '~/componentes';
import {
  SGP_BUTTON_CANCELAR,
  SGP_BUTTON_SALVAR,
  SGP_BUTTON_VOLTAR,
} from '~/componentes-sgp/filtro/idsCampos';
import { RotasDto } from '~/dtos';

import { confirmar, history } from '~/servicos';
import ListaoContext from '../listaoContext';

import { erros, history, sucesso } from '~/servicos';
import ServicoFrequencia from '~/servicos/Paginas/DiarioClasse/ServicoFrequencia';
import ListaoContext from '../listaoContext';

const ListaoOperacoesBotoesAcao = () => {
  const dispatch = useDispatch();

  const { dadosFrequencia, setExibirLoaderGeral } = useContext(ListaoContext);

  const emEdicao = useSelector(store => store.geral.telaEmEdicao);

  const onClickSalvar = async () => {
    setExibirLoaderGeral(true);

    const dadosParaEnviar = [];
    dadosFrequencia.listaFrequencia.forEach(item => {
      let detalheAlterado = false;
      item.aulasDetalhes.forEach(aulasDetalhes => {
        const aulasParaEnviar = [];

        aulasDetalhes.aulas.forEach(aulas => {
          const { alterado, numeroAula, tipoFrequencia } = aulas;
          if (alterado) {
            detalheAlterado = true;
            aulasParaEnviar.push({
              aulaId: aulasDetalhes.aulaId,
              numeroAula,
              tipoFrequencia,
            });
          }
        });

        if (aulasParaEnviar?.length) {
          dadosParaEnviar.push({
            alunoCodigo: item.codigoAluno,
            dataAula: aulasDetalhes.dataAula,
            aulas: aulasParaEnviar,
          });
        }
      });

      if (detalheAlterado) return;

      item.aulas.forEach(aulas => {
        const { alterado, aulaId, dataAula, tipoFrequencia } = aulas;
        if (alterado) {
          const aulasDetalhes = item.aulasDetalhes.find(
            detalhes => detalhes.aulaId === aulaId
          );
          const numeroAula =
            aulasDetalhes &&
            aulasDetalhes.aulas.map(detalhesAulas => detalhesAulas.numeroAula);

          dadosParaEnviar.push({
            alunoCodigo: item.codigoAluno,
            dataAula,
            aulaId: [aulaId],
            numeroAula,
            tipoFrequencia,
          });
        }
      });
    });

    const resposta = await ServicoFrequencia.salvarFrequenciaListao(
      dadosParaEnviar
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoaderGeral(false));

    if (resposta?.status === 200) {
      sucesso('Frequência realizada com sucesso.');
    }
  };

  const pergutarParaSalvar = () => {
    return confirmar(
      'Atenção',
      '',
      'Suas alterações não foram salvas, deseja salvar agora?'
    );
  };

  const onClickSalvar = () => {
    // SALVAR!
    dispatch(setTelaEmEdicao(false));
  };

  const onClickVoltar = async () => {
    if (emEdicao) {
      const confirmado = await pergutarParaSalvar();
      if (confirmado) {
        const salvou = true; //TODO mudar para função correta
        if (salvou) {
          history.push(RotasDto.LISTAO);
        }
      } else {
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
          />
        </Col>
      </Row>
    </Col>
  );
};

export default ListaoOperacoesBotoesAcao;
