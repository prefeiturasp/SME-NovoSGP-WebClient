import PropTypes from 'prop-types';
import React, { useContext, useState, useEffect } from 'react';
import { Button, Colors, Loader } from '~/componentes';
import situacaoFechamentoDto from '~/dtos/situacaoFechamentoDto';
import ListaoContext from '~/paginas/DiarioClasse/Listao/listaoContext';
import {
  DataFechamentoProcessado,
  SituacaoProcessadoComPendencias,
} from '~/paginas/Fechamento/FechamentoBimestre/fechamento-bimestre-lista/fechamento-bimestre-lista.css';
import { erros, sucesso } from '~/servicos';
import ServicoFechamentoBimestre from '~/servicos/Paginas/Fechamento/ServicoFechamentoBimestre';

const DadosCabecalhoTabFechamentoListao = props => {
  const { dadosFechamento } = useContext(ListaoContext);

  const { desabilitarCampos } = props;

  let descDataFechamento = '';

  const [exibirLoader, setExibirLoader] = useState(false);
  const [situacaoNome, setSituacaoNome] = useState();
  const [situacao, setSituacao] = useState();
  const [dataFechamento, setDataFechamento] = useState();

  useEffect(() => {
    setSituacaoNome(dadosFechamento?.situacaoNome);
    setSituacao(dadosFechamento?.situacao);
    setDataFechamento(dadosFechamento?.dataFechamento);
  }, [dadosFechamento]);

  if (situacaoNome && dadosFechamento?.fechamentoId && dataFechamento) {
    const dataMoment = window.moment(dataFechamento);
    const data = dataMoment.format('L');
    const hora = dataMoment.format('LT');
    descDataFechamento = `${situacaoNome} em ${data} às ${hora}`;
  }

  const alertaSucessoReprocessamento =
    'Solicitação de fechamento realizada com sucesso. Em breve você receberá uma notificação com o resultado do processo.';

  const onClickReprocessarNotasConceitos = async () => {
    setExibirLoader(true);
    const processando = await ServicoFechamentoBimestre.reprocessarNotasConceitos(
      dadosFechamento?.fechamentoId
    ).catch(e => {
      erros(e);
      setSituacao(situacaoFechamentoDto.ProcessadoComErro);
      setSituacaoNome('Processado com erro');
      setDataFechamento(window.moment());
    });
    if (processando?.status === 200) {
      setSituacao(situacaoFechamentoDto.EmProcessamento);
      setSituacaoNome('Em Processamento');
      setDataFechamento(window.moment());
      sucesso(alertaSucessoReprocessamento);
    }
    setExibirLoader(false);
  };

  return situacaoNome ? (
    <div className="row">
      {dadosFechamento?.fechamentoId && dataFechamento ? (
        <div className="col-md-12 d-flex justify-content-end">
          <DataFechamentoProcessado>
            <span>{descDataFechamento}</span>
          </DataFechamentoProcessado>
        </div>
      ) : (
        <></>
      )}
      <div className="col-md-6 col-sm-12 d-flex justify-content-start mb-2">
        <Loader loading={exibirLoader} tip="">
          <Button
            id="btn-reprocessar"
            label="Reprocessar"
            color={Colors.Azul}
            border
            className="mr-2"
            onClick={onClickReprocessarNotasConceitos}
            disabled={
              desabilitarCampos ||
              (situacao !== situacaoFechamentoDto.ProcessadoComPendencias &&
                situacao !== situacaoFechamentoDto.ProcessadoComErro)
            }
          />
        </Loader>
      </div>
      <div className="col-md-6 col-sm-12 d-flex justify-content-end">
        <SituacaoProcessadoComPendencias>
          <span>{situacaoNome}</span>
        </SituacaoProcessadoComPendencias>
      </div>
    </div>
  ) : (
    <></>
  );
};

DadosCabecalhoTabFechamentoListao.propTypes = {
  desabilitarCampos: PropTypes.bool,
};

DadosCabecalhoTabFechamentoListao.defaultProps = {
  desabilitarCampos: false,
};

export default DadosCabecalhoTabFechamentoListao;
