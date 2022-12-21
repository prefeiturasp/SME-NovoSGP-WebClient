import PropTypes from 'prop-types';
import React, { useEffect, useCallback, useState } from 'react';

import * as moment from 'moment';
import { Button, Colors, ListaPaginada } from '~/componentes';
import { RotasDto } from '~/dtos';
import { erros, history } from '~/servicos';
import { SGP_BUTTON_DOWNLOAD_ARQUIVO } from '~/constantes/ids/button';
import ServicoArmazenamento from '~/servicos/Componentes/ServicoArmazenamento';
import { downloadBlob } from '~/utils';
import { SGP_TABLE_DOCUMENTOS_PLANOS_TRABALHO } from '~/constantes/ids/table';

const DocPlanosTrabalhoListaPaginada = props => {
  const { form } = props;

  const ueCodigo = form?.values?.ueCodigo;
  const listaUes = form?.values?.listaUes;
  const tipoDocumentoId = form?.values?.tipoDocumentoId;
  const classificacaoId = form?.values?.classificacaoId;

  const [filtros, setFiltros] = useState();

  const TIPO_DOCUMENTO = {
    DOCUMENTOS: '2',
  };

  const TIPO_CLASSIFICACAO = {
    DOCUMENTOS_DA_TURMA: '10',
  };

  const ocultarColunaTurmaComponente =
    (tipoDocumentoId &&
      tipoDocumentoId?.toString() !== TIPO_DOCUMENTO.DOCUMENTOS) ||
    (classificacaoId &&
      classificacaoId?.toString() !== TIPO_CLASSIFICACAO.DOCUMENTOS_DA_TURMA);

  const formatarCampoDataGrid = data => {
    let dataFormatada = '';
    if (data) {
      dataFormatada = moment(data).format('DD/MM/YYYY');
    }
    return <span> {dataFormatada}</span>;
  };

  const onClickDownload = linha => {
    linha.arquivos.forEach(arquivo => {
      ServicoArmazenamento.obterArquivoParaDownload(arquivo?.codigo)
        .then(resposta => {
          downloadBlob(resposta.data, arquivo?.nome);
        })
        .catch(e => erros(e));
    });
  };

  const colunas = [
    {
      title: 'Tipo',
      dataIndex: 'tipoDocumento',
    },
    {
      title: 'Cassificação',
      dataIndex: 'classificacao',
    },
    {
      title: 'Usuário',
      dataIndex: 'usuario',
    },
    {
      title: 'Data de inclusão',
      dataIndex: 'data',
      render: data => formatarCampoDataGrid(data),
    },
  ];

  if (!ocultarColunaTurmaComponente) {
    colunas.push({
      title: 'Turma/Componente Curricular',
      dataIndex: 'turmaComponenteCurricular',
    });
  }

  colunas.push({
    title: 'Anexo',
    dataIndex: 'anexo',
    width: '10%',
    render: (_, linha) => {
      const qtdAquivos = linha?.arquivos?.length;
      return (
        <Button
          icon={`fas fa-arrow-down ${SGP_BUTTON_DOWNLOAD_ARQUIVO}`}
          label={`Download de ${qtdAquivos || 0} arquivo(s)`}
          color={Colors.Azul}
          className={`ml-2 text-center ${SGP_BUTTON_DOWNLOAD_ARQUIVO}`}
          onClick={() => qtdAquivos && onClickDownload(linha)}
        />
      );
    },
  });

  const filtrar = useCallback(() => {
    if (ueCodigo && listaUes?.length) {
      const ueSelecionada = listaUes.find(
        item => String(item.codigo) === String(ueCodigo)
      );
      const params = {
        ueId: ueSelecionada?.id || '',
        tipoDocumentoId,
        classificacaoId,
      };
      setFiltros({ ...params });
    } else {
      setFiltros({});
    }
  }, [ueCodigo, tipoDocumentoId, classificacaoId, listaUes]);

  useEffect(() => {
    filtrar();
  }, [filtrar]);

  const onClickEditar = (linha, colunaClicada) => {
    let executarClick = true;
    if (colunaClicada?.target?.className) {
      const clicouNoBotao = colunaClicada.target.className.includes(
        SGP_BUTTON_DOWNLOAD_ARQUIVO
      );
      executarClick = !clicouNoBotao;
    }

    if (executarClick) {
      history.push(
        `${RotasDto.DOCUMENTOS_PLANOS_TRABALHO}/editar/${linha.documentoId}`
      );
    }
  };

  return filtros?.ueId ? (
    <ListaPaginada
      url="v1/armazenamento/documentos"
      id={SGP_TABLE_DOCUMENTOS_PLANOS_TRABALHO}
      colunaChave="documentoId"
      colunas={colunas}
      filtro={filtros}
      onClick={(linha, colunaClicada) => onClickEditar(linha, colunaClicada)}
      filtroEhValido={!!filtros?.ueId}
    />
  ) : (
    <></>
  );
};

DocPlanosTrabalhoListaPaginada.propTypes = {
  form: PropTypes.oneOfType([PropTypes.any]),
};

DocPlanosTrabalhoListaPaginada.defaultProps = {
  form: null,
};

export default DocPlanosTrabalhoListaPaginada;
